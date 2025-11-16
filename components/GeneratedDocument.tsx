
import React, { useState, useMemo, useRef } from 'react';
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

    const documentContent = useMemo(() => {
        // Use custom template if provided, otherwise fall back to default
        const templateToUse = customTemplateContent ?? getDefaultTemplate(template.key, data.subTemplateKey);
        if (!templateToUse) {
             return `<div style="text-align: center; color: red; padding: 2rem;">Lỗi: Không tìm thấy mẫu phù hợp cho loại văn bản này.</div>`;
        }
        return getDocumentContent(template, data, templateToUse);
    }, [template, data, customTemplateContent]);

    const isHtml = /^\s*</.test(documentContent);

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
