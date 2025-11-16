
import React, { useState, useEffect } from 'react';
import { DocumentTemplate, SubTemplateKey, UploadedFile } from '../types';
import { extractTextFromPdf } from '../services/geminiService';
import { getDefaultTemplate } from '../data/defaultTemplates';

interface CustomTemplateUploaderProps {
  template: DocumentTemplate;
  subTemplateKey: SubTemplateKey;
  onComplete: (content: string | null) => void;
  onBack: () => void;
}

export const CustomTemplateUploader: React.FC<CustomTemplateUploaderProps> = ({ template, subTemplateKey, onComplete, onBack }) => {
  const [content, setContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDefault, setIsUsingDefault] = useState(false);

  useEffect(() => {
    // Automatically load default template on component mount
    const defaultTemplate = getDefaultTemplate(template.key, subTemplateKey);
    setContent(defaultTemplate || '');
    setIsUsingDefault(true);
  }, [template.key, subTemplateKey]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setIsProcessing(true);
      setIsUsingDefault(false);

      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            if (!e.target?.result) throw new Error("Không thể đọc được file.");
            const base64 = (e.target.result as string).split(',')[1];
            const uploadedFile: UploadedFile = { name: file.name, base64, mimeType: file.type };
            const fileContent = await extractTextFromPdf(uploadedFile);
            setContent(fileContent);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định khi trích xuất PDF.');
            setContent(null);
          } finally {
            setIsProcessing(false);
          }
        };
        reader.onerror = () => {
          setError('Không thể đọc file PDF đã chọn.');
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      } else { // Handle txt/html
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target?.result as string;
          setContent(fileContent);
          setIsProcessing(false);
        };
        reader.onerror = () => {
            setError('Không thể đọc file đã chọn.');
            setIsProcessing(false);
        }
        reader.readAsText(file);
      }
    }
    event.target.value = '';
  };

  const handleUseDefault = () => {
    const defaultTemplate = getDefaultTemplate(template.key, subTemplateKey);
    setContent(defaultTemplate || '');
    setIsUsingDefault(true);
    setError(null);
  };
  
  const handleSubmit = () => {
    // If user is using default, we pass null so the generator knows to re-fetch the default.
    // Otherwise, we pass the custom content.
    onComplete(isUsingDefault ? null : content);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-left mb-8">
        <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Quay lại Chỉnh sửa Dữ liệu
        </button>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sử dụng Mẫu Văn bản</h2>
        <p className="mt-2 text-lg text-slate-600">
          Ứng dụng đã tải sẵn mẫu mặc định. Bạn có thể sử dụng mẫu này, hoặc tải lên file mẫu (.pdf, .html, .txt) của riêng bạn.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <label htmlFor="template-upload" className={`cursor-pointer text-sm font-medium px-4 py-2 bg-white text-slate-700 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}>
            {isProcessing ? 'Đang xử lý...' : 'Tải lên Mẫu tùy chỉnh'}
          </label>
          <input type="file" id="template-upload" accept=".html,.txt,.pdf" className="hidden" onChange={handleFileChange} disabled={isProcessing} />
           <button 
                onClick={handleUseDefault} 
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-50"
            >
                Sử dụng Mẫu mặc định
            </button>
        </div>

        {isUsingDefault && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-md text-sm">
            Bạn đang xem trước nội dung của <strong>Mẫu mặc định</strong>.
          </div>
        )}
        {!isUsingDefault && content && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-md text-sm">
                Nội dung dưới đây đã được trích xuất từ <strong>Mẫu tùy chỉnh</strong> bạn đã tải lên.
            </div>
        )}

        <textarea
          value={content || ''}
          onChange={(e) => {
            setContent(e.target.value)
            setIsUsingDefault(false) // Any manual edit makes it a custom template
          }}
          placeholder="Nội dung mẫu sẽ hiển thị ở đây..."
          className="w-full h-80 p-3 border border-slate-300 rounded-md font-mono text-xs shadow-inner focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
          readOnly={isProcessing}
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="pt-4 text-center">
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !content}
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sử dụng Mẫu này & Soạn thảo
          </button>
        </div>
      </div>
    </div>
  );
};
