import React, { useState, useRef } from 'react';
import { UploadedFile } from '../types';
import { generateDirectiveResponse } from '../services/geminiService';
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
    const [directiveFile, setDirectiveFile] = useState<UploadedFile | null>(null);
    const [templateFile, setTemplateFile] = useState<UploadedFile | null>(null);
    const [userNotes, setUserNotes] = useState('');
    const [documentTitle, setDocumentTitle] = useState('');

    const [generatedResponse, setGeneratedResponse] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
    
    const [copySuccess, setCopySuccess] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);
    const { addOfficialDocument } = useOfficialDocumentStore();

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>, 
        setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = (event.target?.result as string).split(',')[1];
                setter({
                    name: file.name,
                    base64,
                    mimeType: file.type,
                });
            };
            reader.readAsDataURL(file);
        }
        e.target.value = ''; // Reset input
    };
    
    const handleGenerate = async () => {
        if (!directiveFile || !userNotes) {
            setError('Vui lòng cung cấp Văn bản chỉ đạo và Nội dung thực hiện.');
            return;
        }
        setIsGenerating(true);
        setError(null);
        setGeneratedResponse(null);
        try {
            const response = await generateDirectiveResponse(directiveFile, templateFile, userNotes);
            setGeneratedResponse(response);
            setStep(4);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!generatedResponse || !directiveFile || !documentTitle.trim()) {
            alert('Vui lòng nhập tiêu đề và đảm bảo đã có văn bản được tạo.');
            return;
        }
        const finalContent = contentRef.current?.innerHTML || generatedResponse;
        addOfficialDocument({
            title: documentTitle.trim(),
            directiveFile: directiveFile,
            responseContent: finalContent,
            userNotes: userNotes,
        });
        alert('Đã lưu thành công vào mục "VB Trình ký"!');
        // Optionally reset state or navigate away
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
                            <FileUpload
                                file={directiveFile}
                                onFileChange={(e) => handleFileChange(e, setDirectiveFile)}
                                onPreview={() => directiveFile && setPreviewFile(directiveFile)}
                                id="directive-file"
                            />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Bước 2: Tải lên Văn bản Trả lời Mẫu (Tùy chọn)</h4>
                            <FileUpload
                                file={templateFile}
                                onFileChange={(e) => handleFileChange(e, setTemplateFile)}
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
                            disabled={isGenerating || !directiveFile || !userNotes}
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
                        <div className="mb-6 flex flex-wrap gap-2 justify-end">
                            <button onClick={handleOpenInGoogleDocs} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">{copySuccess || 'Mở trong Google Docs'}</button>
                            <button onClick={handleDownloadPdf} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">Tải PDF</button>
                        </div>
                        <div
                            ref={contentRef}
                            contentEditable
                            suppressContentEditableWarning
                            dangerouslySetInnerHTML={{ __html: generatedResponse || '' }}
                            className="border border-slate-300 rounded-md shadow-inner bg-white min-h-[500px] p-6"
                            style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '14pt', lineHeight: 1.8, outline: 'none' }}
                        />
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
