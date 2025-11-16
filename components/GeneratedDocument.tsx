
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { DocumentTemplate, ExtractedData } from '../types';
import { getDocumentContent } from '../utils/documentGenerator';
import { getDefaultTemplate } from '../data/defaultTemplates';

interface GeneratedDocumentProps {
    template: DocumentTemplate;
    data: ExtractedData;
    customTemplateContent: string | null;
    onRestart: () => void;
    onBackToManager: () => void;
    isEditing: boolean;
    onBack: () => void;
}

declare global {
    interface Window {
        html2pdf: any;
    }
}

export const GeneratedDocument: React.FC<GeneratedDocumentProps> = ({ template, data, customTemplateContent, onRestart, onBackToManager, isEditing, onBack }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);
    const [isTableFocused, setIsTableFocused] = useState(false);

    const documentContent = useMemo(() => {
        const templateToUse = customTemplateContent ?? getDefaultTemplate(template.key, data.subTemplateKey);
        if (!templateToUse) {
             return `<div style="text-align: center; color: red; padding: 2rem;">Lỗi: Không tìm thấy mẫu phù hợp cho loại văn bản này.</div>`;
        }
        return getDocumentContent(template, data, templateToUse);
    }, [template, data, customTemplateContent]);

    const isHtml = /^\s*</.test(documentContent);

    // --- Editor Functions ---
    const applyFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        contentRef.current?.focus();
    };

    const applyBlockStyle = (style: { [key: string]: string }) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        let node = selection.getRangeAt(0).startContainer;
        while (node && node !== contentRef.current) {
            if (node.nodeType === 1) {
                const element = node as HTMLElement;
                const display = window.getComputedStyle(element).display;
                if (display === 'block' || element.tagName === 'P' || element.tagName === 'DIV') {
                    Object.assign(element.style, style);
                    break;
                }
            }
            node = node.parentNode;
        }
        contentRef.current?.focus();
    };

    const insertTable = () => {
        const rowsStr = prompt("Nhập số hàng:", "3");
        const colsStr = prompt("Nhập số cột:", "3");
        const rows = rowsStr ? parseInt(rowsStr) : 0;
        const cols = colsStr ? parseInt(colsStr) : 0;

        if (rows > 0 && cols > 0) {
            let tableHTML = '<table style="border-collapse: collapse; width: 100%; border: 1px solid #ccc;"><thead><tr>';
            for (let j = 0; j < cols; j++) {
                tableHTML += `<th style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">Tiêu đề ${j + 1}</th>`;
            }
            tableHTML += '</tr></thead><tbody>';
            for (let i = 0; i < rows - 1; i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < cols; j++) {
                    tableHTML += '<td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>';
                }
                tableHTML += '</tr>';
            }
            tableHTML += '</tbody></table><p>&nbsp;</p>';
            applyFormat('insertHTML', tableHTML);
        }
    };

    const getCellAndTable = (): { cell: HTMLTableCellElement | null, row: HTMLTableRowElement | null, table: HTMLTableElement | null } => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return { cell: null, row: null, table: null };
        let node = selection.getRangeAt(0).startContainer;
        let cell = null, row = null, table = null;
        while (node && node !== contentRef.current) {
            if (node.nodeName === 'TD' || node.nodeName === 'TH') cell = node as HTMLTableCellElement;
            if (node.nodeName === 'TR') row = node as HTMLTableRowElement;
            if (node.nodeName === 'TABLE') { table = node as HTMLTableElement; break; }
            node = node.parentNode;
        }
        return { cell, row, table };
    };

    const addRowAfter = () => {
        const { row, table } = getCellAndTable();
        if (row && table) {
            const newRow = table.insertRow(row.rowIndex + 1);
            for (let i = 0; i < row.cells.length; i++) {
                const newCell = newRow.insertCell(i);
                newCell.innerHTML = '&nbsp;';
                newCell.style.border = '1px solid #ccc';
                newCell.style.padding = '8px';
            }
        }
    };

    const addColumnAfter = () => {
        const { cell, table } = getCellAndTable();
        if (cell && table) {
            const cellIndex = cell.cellIndex;
            for (let i = 0; i < table.rows.length; i++) {
                // FIX: Corrected typo from `constcurrentRow` to `const currentRow`.
                const currentRow = table.rows[i];
                const newCell = currentRow.insertCell(cellIndex + 1);
                newCell.innerHTML = '&nbsp;';
                newCell.style.border = '1px solid #ccc';
                newCell.style.padding = '8px';
                if (currentRow.parentElement?.tagName === 'THEAD') {
                    newCell.outerHTML = `<th style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">Tiêu đề mới</th>`;
                }
            }
        }
    };

    const checkTableFocus = useCallback(() => {
        const { table } = getCellAndTable();
        setIsTableFocused(!!table);
    }, []);

    useEffect(() => {
        const editor = contentRef.current;
        if (editor) {
            const handleFocusChange = () => setTimeout(checkTableFocus, 0);
            document.addEventListener('selectionchange', handleFocusChange);
            return () => document.removeEventListener('selectionchange', handleFocusChange);
        }
    }, [checkTableFocus]);
    
    // --- End Editor Functions ---

    const getContentForExport = (): string => {
        return contentRef.current ? contentRef.current.innerHTML : documentContent;
    };
    
    const handleCopy = () => {
        if (!contentRef.current) return;
        const textToCopy = contentRef.current.innerText;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopySuccess('Đã sao chép nội dung!');
                setTimeout(() => setCopySuccess(''), 2000);
            })
            .catch(err => {
                setCopySuccess('Lỗi sao chép!');
                console.error('Could not copy text: ', err);
            });
    };
    
    const handleOpenInGoogleDocs = async () => {
        if (!contentRef.current) return;
        const htmlContent = contentRef.current.innerHTML;
        try {
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const item = new ClipboardItem({ 'text/html': blob });
            await navigator.clipboard.write([item]);
            setCopySuccess('Đã sao chép! Dán (Ctrl+V) vào tab mới.');
            window.open('https://docs.new', '_blank')?.focus();
            setTimeout(() => setCopySuccess(''), 4000);
        } catch (err) {
            console.error('Failed to copy HTML to clipboard: ', err);
            setCopySuccess('Lỗi sao chép!');
             setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    const handleDownloadPdf = () => {
        const content = getContentForExport();
        const element = document.createElement('div');
        element.innerHTML = content;
        
        element.style.width = '210mm'; // A4 width
        element.style.padding = '2cm 2cm 2cm 3cm';
        document.body.appendChild(element);

        const topMargin = 2 / 2.54;
        const bottomMargin = 2 / 2.54;
        const leftMargin = 3 / 2.54;
        const rightMargin = 2 / 2.54;

        const opt = {
            margin: [topMargin, rightMargin, bottomMargin, leftMargin],
            filename: `${template.title}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        window.html2pdf().set(opt).from(element).save().then(() => {
             document.body.removeChild(element);
        });
    };

    const handleOpenPrintWindow = () => {
        const content = getContentForExport();
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <title>${template.title} (Bản in)</title>
                    <style>
                        @media print {
                            @page {
                                size: A4;
                                margin: 2cm 2cm 2cm 3cm;
                            }
                        }
                        body {
                            margin: 2cm 2cm 2cm 3cm;
                            font-family: 'Times New Roman', Times, serif; 
                            font-size: 14pt; 
                            color: black;
                            line-height: 1.8;
                        }
                         table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                        }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            alert('Không thể mở cửa sổ mới. Vui lòng cho phép pop-up cho trang web này.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-left mb-4">
                <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    Quay lại
                </button>
            </div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Văn bản đã được Soạn thảo</h2>
                <p className="mt-2 text-lg text-slate-600">
                    Chỉnh sửa trực tiếp nội dung, sau đó sao chép, tải xuống hoặc in.
                </p>
            </div>

            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg border border-slate-200 relative">
                 <div className="sticky top-0 z-10 bg-slate-100 border-b border-slate-300 p-2 flex flex-wrap gap-1 items-center mb-4 rounded-md">
                    <button title="In đậm" onClick={() => applyFormat('bold')} className="p-2 rounded hover:bg-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.25 3a.75.75 0 01.75.75v.5a2.25 2.25 0 002.25 2.25H14a.75.75 0 010 1.5h-1.75a2.25 2.25 0 00-2.25 2.25v.5a.75.75 0 01-1.5 0v-.5A2.25 2.25 0 006.25 10H4.5a.75.75 0 010-1.5h1.75A2.25 2.25 0 008.5 6.25v-.5a.75.75 0 01.75-.75zM8.5 12.25a.75.75 0 00-1.5 0v.5A2.25 2.25 0 014.75 15H3a.75.75 0 000 1.5h1.75a2.25 2.25 0 012.25-2.25v-.5a.75.75 0 00-.75-.75zM12.5 11.5a.75.75 0 01.75.75v.5a2.25 2.25 0 002.25 2.25H17a.75.75 0 010 1.5h-1.75a2.25 2.25 0 00-2.25 2.25v.5a.75.75 0 01-1.5 0v-.5a2.25 2.25 0 00-2.25-2.25H9a.75.75 0 010-1.5h1.75A2.25 2.25 0 0013 12.25v-.5a.75.75 0 01-.5-.75z" /></svg>
                    </button>
                    <button title="In nghiêng" onClick={() => applyFormat('italic')} className="p-2 rounded hover:bg-slate-200">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11.087 4.135a.75.75 0 01.326 1.39l-4 9a.75.75 0 01-1.39-.326l4-9a.75.75 0 011.064-.314z" /></svg>
                    </button>
                    <div className="h-5 border-l border-slate-300 mx-1"></div>
                    <select onChange={(e) => applyFormat('fontSize', e.target.value)} className="bg-transparent p-1 border-0 rounded text-sm focus:ring-1 focus:ring-blue-500">
                        <option value="4">Cỡ chữ</option>
                        <option value="2">Nhỏ</option>
                        <option value="3">Vừa</option>
                        <option value="5">Lớn</option>
                        <option value="6">Rất lớn</option>
                    </select>
                    <select onChange={(e) => applyBlockStyle({ lineHeight: e.target.value })} className="bg-transparent p-1 border-0 rounded text-sm focus:ring-1 focus:ring-blue-500">
                        <option value="">Giãn dòng</option>
                        <option value="1">1.0</option>
                        <option value="1.5">1.5</option>
                        <option value="1.8">1.8</option>
                        <option value="2">2.0</option>
                    </select>
                    <div className="h-5 border-l border-slate-300 mx-1"></div>
                    <button title="Thêm bảng" onClick={insertTable} className="p-2 rounded hover:bg-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm0 2h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" clipRule="evenodd" /></svg>
                    </button>
                    {isTableFocused && (
                        <>
                            <button title="Thêm hàng bên dưới" onClick={addRowAfter} className="p-2 rounded hover:bg-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm13 5a1 1 0 00-1-1H4a1 1 0 00-1 1v2a1 1 0 001 1h12a1 1 0 001-1v-2zM9 15v1H8v-1h1z" /></svg>
                            </button>
                            <button title="Thêm cột bên phải" onClick={addColumnAfter} className="p-2 rounded hover:bg-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1H4zM8 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1H8zm5 12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4a1 1 0 011-1h2a1 1 0 011 1v11zM15 9h1v1h-1V9z" /></svg>
                            </button>
                        </>
                    )}
                </div>

                <div className="mb-6 flex flex-wrap gap-2 justify-center sm:justify-end">
                    <button
                        onClick={handleOpenInGoogleDocs}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        title="Sao chép toàn bộ nội dung đã định dạng và mở tab Google Docs mới. Bạn chỉ cần dán (Ctrl+V) vào."
                    >
                        Mở trong Google Docs
                    </button>
                    <button
                        onClick={handleCopy}
                        className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        {copySuccess || 'Sao chép Nội dung'}
                    </button>
                     <button
                        onClick={handleOpenPrintWindow}
                        className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                        Mở cửa sổ In/Lưu
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        Tải PDF
                    </button>
                </div>
                
                <div className="border border-slate-200 rounded-md shadow-inner bg-white min-h-[500px] p-6">
                    {isHtml ? (
                         <div
                            id="document-editor-area"
                            ref={contentRef}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            dangerouslySetInnerHTML={{ __html: documentContent }}
                            style={{
                                fontFamily: "'Times New Roman', Times, serif",
                                fontSize: '14pt',
                                color: 'black',
                                lineHeight: 1.8,
                                outline: 'none',
                            }}
                        />
                    ) : (
                        <pre className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed font-sans">{documentContent}</pre>
                    )}
                </div>
            </div>
             
            <div className="mt-8 pt-6 text-center space-x-4">
                <button
                    onClick={onRestart}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                    Soạn thảo Văn bản Mới
                </button>
                 {isEditing && (
                    <button
                        onClick={onBackToManager}
                        className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                       Quay lại Danh sách
                    </button>
                )}
            </div>
        </div>
    );
};
