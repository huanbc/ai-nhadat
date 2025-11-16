
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadedFile } from '../types';
import { generateDirectiveResponse, analyzeDirectiveDocuments } from '../services/geminiService';
import { useOfficialDocumentStore } from '../hooks/useOfficialDocumentStore';

interface DirectiveResponseGeneratorProps {
    onBack: () => void;
}

declare global {
    interface Window {
        html2pdf: any;
    }
}

export const DirectiveResponseGenerator: React.FC<DirectiveResponseGeneratorProps> = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [directiveFiles, setDirectiveFiles] = useState<UploadedFile[]>([]);
    const [templateFile, setTemplateFile] = useState<UploadedFile | null>(null);
    const [userNotes, setUserNotes] = useState('');
    const [documentTitle, setDocumentTitle] = useState('');

    const [generatedResponse, setGeneratedResponse] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
    
    const [analysisContent, setAnalysisContent] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [copySuccess, setCopySuccess] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);
    const { addOfficialDocument } = useOfficialDocumentStore();
    const [isTableFocused, setIsTableFocused] = useState(false);

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
        if (step === 4) {
            const editor = contentRef.current;
            if (editor) {
                const handleFocusChange = () => setTimeout(checkTableFocus, 0);
                document.addEventListener('selectionchange', handleFocusChange);
                return () => document.removeEventListener('selectionchange', handleFocusChange);
            }
        }
    }, [step, checkTableFocus]);
    // --- End Editor Functions ---


    const handleDirectiveFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles: UploadedFile[] = [];
            let filesToProcess = files.length;
    
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = (event.target?.result as string).split(',')[1];
                    newFiles.push({
                        name: file.name,
                        base64,
                        mimeType: file.type,
                    });
                    filesToProcess--;
                    if (filesToProcess === 0) {
                        setDirectiveFiles(prev => [...prev, ...newFiles]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
        e.target.value = ''; // Reset input
    };
    
    const removeDirectiveFile = (index: number) => {
        setDirectiveFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleTemplateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = (event.target?.result as string).split(',')[1];
                setTemplateFile({
                    name: file.name,
                    base64,
                    mimeType: file.type,
                });
            };
            reader.readAsDataURL(file);
        }
        e.target.value = ''; // Reset input
    };
    
    const handleAnalyzeDirectives = async () => {
        if (directiveFiles.length === 0) return;
        setIsAnalyzing(true);
        setAnalysisContent(null);
        setError(null);
        try {
            const result = await analyzeDirectiveDocuments(directiveFiles);
            setAnalysisContent(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi phân tích văn bản.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerate = async () => {
        if (directiveFiles.length === 0 || !userNotes) {
            setError('Vui lòng cung cấp Văn bản chỉ đạo và Nội dung thực hiện.');
            return;
        }
        setIsGenerating(true);
        setError(null);
        setGeneratedResponse(null);
        try {
            const response = await generateDirectiveResponse(directiveFiles, templateFile, userNotes);
            setGeneratedResponse(response);
            setStep(4);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedResponse || directiveFiles.length === 0 || !documentTitle.trim()) {
            alert('Vui lòng nhập tiêu đề và đảm bảo đã có văn bản được tạo.');
            return;
        }
        const finalContent = contentRef.current?.innerHTML || generatedResponse;
        addOfficialDocument({
            title: documentTitle.trim(),
            directiveFiles: directiveFiles,
            responseContent: finalContent,
            userNotes: userNotes,
            directiveAnalysis: analysisContent || 'Chưa có phân tích.',
        });
        alert('Đã lưu thành công vào mục "VB Trình ký"!');
    };

    const getContentForExport = (): string => {
        return contentRef.current ? contentRef.current.innerHTML : generatedResponse || '';
    };

    const handleDownloadPdf = () => {
        const content = getContentForExport();
        const element = document.createElement('div');
        element.innerHTML = content;
        element.style.width = '210mm';
        element.style.padding = '2cm 2cm 2cm 3cm';
        element.style.fontFamily = "'Times New Roman', Times, serif";
        element.style.fontSize = '14pt';
        element.style.lineHeight = '1.8';
        document.body.appendChild(element);

        const opt = {
            margin: [2 / 2.54, 2 / 2.54, 2 / 2.54, 3 / 2.54], // top, right, bottom, left in inches
            filename: `${documentTitle || 'van-ban-phan-hoi'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        window.html2pdf().set(opt).from(element).save().then(() => {
            document.body.removeChild(element);
        });
    };

     const handleOpenInGoogleDocs = async () => {
        const htmlContent = getContentForExport();
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

    const renderPreviewModal = () => {
        if (!previewFile) return null;
        return (
            <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 truncate pr-4">{previewFile.name}</h3>
                        <button onClick={() => setPreviewFile(null)} className="text-slate-500 hover:text-slate-800 text-3xl leading-none flex-shrink-0">&times;</button>
                    </div>
                    <div className="flex-grow overflow-auto p-4 bg-slate-50">
                        {previewFile.mimeType.startsWith('image/') ? (
                            <img src={`data:${previewFile.mimeType};base64,${previewFile.base64}`} alt="Xem trước" className="max-w-full h-auto mx-auto"/>
                        ) : previewFile.mimeType === 'application/pdf' ? (
                            <iframe src={`data:application/pdf;base64,${previewFile.base64}`} className="w-full h-full min-h-[75vh]" title="Xem trước PDF"></iframe>
                        ) : (
                            <p className="text-slate-600 text-center py-10">Không thể xem trước loại tệp này.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderStep = () => {
        switch(step) {
            case 1:
            case 2:
            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Bước 1: Tải lên Văn bản Chỉ đạo</h4>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center transition-colors bg-slate-50 hover:border-blue-500">
                                <label htmlFor="directive-files-input" className="cursor-pointer font-semibold text-blue-600">
                                    Chọn một hoặc nhiều file...
                                    <input id="directive-files-input" type="file" multiple className="hidden" accept="image/png, image/jpeg, image/webp, application/pdf" onChange={handleDirectiveFilesChange} />
                                </label>
                                {directiveFiles.length > 0 && (
                                    <div className="mt-4 space-y-2 text-left">
                                        {directiveFiles.map((file, index) => (
                                            <div key={index} className="text-sm text-green-700 font-medium bg-green-50 p-2 rounded-md flex justify-between items-center gap-2">
                                                <span className="truncate flex-grow">{file.name}</span>
                                                <div className="flex items-center space-x-2 flex-shrink-0">
                                                    <button type="button" onClick={() => setPreviewFile(file)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-1 rounded">Xem</button>
                                                    <button onClick={() => removeDirectiveFile(index)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {directiveFiles.length > 0 && (
                                <div className="mt-4">
                                    <button
                                        onClick={handleAnalyzeDirectives}
                                        disabled={isAnalyzing}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400"
                                    >
                                        {isAnalyzing ? 'Đang phân tích...' : 'Phân tích Văn bản Chỉ đạo'}
                                    </button>
                                </div>
                            )}
                            {(isAnalyzing || analysisContent) && (
                                <div className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-md">
                                    <h5 className="font-semibold text-slate-800 mb-2">Kết quả Phân tích & Tóm tắt</h5>
                                    {isAnalyzing && <p className="text-slate-500 animate-pulse">AI đang đọc và tóm tắt...</p>}
                                    {analysisContent && <pre className="whitespace-pre-wrap text-slate-800 text-sm font-sans">{analysisContent}</pre>}
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Bước 2: Tải lên Văn bản Trả lời Mẫu (Tùy chọn)</h4>
                            <FileUpload
                                file={templateFile}
                                onFileChange={handleTemplateFileChange}
                                onPreview={() => templateFile && setPreviewFile(templateFile)}
                                id="template-file"
                            />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Bước 3: Nhập Nội dung/Kết quả đã Thực hiện</h4>
                            <textarea
                                value={userNotes}
                                onChange={(e) => setUserNotes(e.target.value)}
                                placeholder="Ví dụ: Đã tiến hành kiểm tra thực địa, kết quả cho thấy..."
                                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                                rows={6}
                            />
                        </div>
                         {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || directiveFiles.length === 0 || !userNotes}
                            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400"
                        >
                            {isGenerating ? 'Đang tạo văn bản...' : 'Tạo Văn bản Phản hồi'}
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <button onClick={() => setStep(3)} className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 flex items-center">
                            &larr; Quay lại
                        </button>
                        <h3 className="text-xl font-semibold text-slate-900 mb-4">Bước 4: Xem lại, Chỉnh sửa và Lưu trữ</h3>
                        
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
                        
                        <div className="mb-6 flex flex-wrap gap-2 justify-end">
                            <button onClick={handleOpenInGoogleDocs} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">{copySuccess || 'Mở trong Google Docs'}</button>
                            <button onClick={handleDownloadPdf} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">Tải PDF</button>
                        </div>

                         <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
                            <div
                                ref={contentRef}
                                contentEditable
                                suppressContentEditableWarning
                                dangerouslySetInnerHTML={{ __html: generatedResponse || '' }}
                                className="p-8 w-full min-h-[80vh] focus:outline-none"
                                style={{
                                    fontFamily: "'Times New Roman', Times, serif",
                                    fontSize: '14pt',
                                    lineHeight: 1.8,
                                }}
                            />
                        </div>

                        <div className="mt-6 p-4 bg-slate-100 rounded-md space-y-3">
                            <h4 className="font-semibold text-slate-800">Lưu trữ văn bản</h4>
                             <input
                                type="text"
                                value={documentTitle}
                                onChange={(e) => setDocumentTitle(e.target.value)}
                                placeholder="Nhập tiêu đề để lưu (ví dụ: Báo cáo kết quả kiểm tra ABC)"
                                className="w-full p-2 border border-slate-300 rounded-md"
                            />
                            <button onClick={handleSave} className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Lưu vào mục "VB Trình ký"</button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex-grow flex flex-col space-y-4">
            {renderPreviewModal()}
            <p className="text-slate-600 text-sm">Soạn thảo văn bản phản hồi/báo cáo dựa trên văn bản chỉ đạo của cấp trên. AI sẽ phân tích chỉ đạo, kết hợp với nội dung bạn cung cấp để tạo ra văn bản hoàn chỉnh theo mẫu.</p>
            {renderStep()}
        </div>
    );
};

const FileUpload: React.FC<{
    file: UploadedFile | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPreview: () => void;
    id: string;
}> = ({ file, onFileChange, onPreview, id }) => (
    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center transition-colors bg-slate-50 hover:border-blue-500">
        {!file ? (
            <label htmlFor={id} className="cursor-pointer">
                <span className="font-semibold text-blue-600">Chọn file...</span>
                <input id={id} type="file" className="hidden" accept="image/png, image/jpeg, image/webp, application/pdf" onChange={onFileChange} />
            </label>
        ) : (
            <div className="text-sm text-green-700 font-medium flex justify-between items-center gap-2">
               <span className="truncate flex-grow text-left">{file.name}</span>
               <div className="flex items-center space-x-2 flex-shrink-0">
                   <button type="button" onClick={onPreview} className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-1 rounded">Xem trước</button>
                   <label htmlFor={id} className="cursor-pointer text-xs font-semibold text-yellow-600 hover:text-yellow-800 bg-yellow-100 px-2 py-1 rounded">Thay đổi</label>
                   <input id={id} type="file" className="hidden" accept="image/png, image/jpeg, image/webp, application/pdf" onChange={onFileChange} />
               </div>
            </div>
        )}
    </div>
);
