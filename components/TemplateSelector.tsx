import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { DOCUMENT_TEMPLATES } from '../constants';
import { DocumentTemplate, DocumentTemplateKey, UploadedFile } from '../types';
import { useAnalyzedDocumentStore } from '../hooks/useAnalyzedDocumentStore';


interface TemplateSelectorProps {
  onSelect: (template: DocumentTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  // State for AI Consultation
  const [prompt, setPrompt] = useState('');
  const [consultationResponse, setConsultationResponse] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultationError, setConsultationError] = useState('');
  const [consultationFile, setConsultationFile] = useState<UploadedFile | null>(null);
  const [savableResponse, setSavableResponse] = useState<{ fileName: string; content: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { addAnalyzedDocument } = useAnalyzedDocumentStore();

  // State for Document Drafting
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<DocumentTemplateKey | ''>('');

  const selectedTemplate = useMemo(() => {
    if (!selectedTemplateKey) return null;
    return DOCUMENT_TEMPLATES.find(t => t.key === selectedTemplateKey) || null;
  }, [selectedTemplateKey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setConsultationFile({
          name: file.name,
          base64,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setConsultationFile(null);
    }
    // Clear old file name if user cancels file selection
    if (!e.target.value) {
        setConsultationFile(null);
    }
  };


  const handleConsultation = async () => {
    if (!prompt.trim()) return;
    setIsConsulting(true);
    setConsultationError('');
    setConsultationResponse('');
    setSavableResponse(null);
    setSaveSuccess(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const systemInstruction = `Bạn là một trợ lý pháp lý AI chuyên sâu về luật đất đai Việt Nam. Nhiệm vụ của bạn là phân tích và trả lời các câu hỏi một cách chính xác, ngắn gọn và dễ hiểu cho người không chuyên. Khi trả lời, hãy tập trung vào các bước thực hiện, hồ sơ cần chuẩn bị, và thời gian giải quyết.`;
      
      let requestContents;
      if (consultationFile) {
        requestContents = {
          parts: [
            { text: `Dựa vào tài liệu được đính kèm, hãy trả lời câu hỏi sau: ${prompt}` },
            {
              inlineData: {
                mimeType: consultationFile.mimeType,
                data: consultationFile.base64,
              },
            },
          ],
        };
      } else {
        requestContents = { parts: [{ text: prompt }] };
      }

      const modelResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: requestContents,
        config: { systemInstruction },
      });

      setConsultationResponse(modelResponse.text);
      if (consultationFile) {
        setSavableResponse({ fileName: consultationFile.name, content: modelResponse.text });
      }

    } catch (err) {
      console.error(err);
      setConsultationError('Đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.');
    } finally {
      setIsConsulting(false);
    }
  };
  
  const handleSaveResponse = () => {
    if (savableResponse) {
        addAnalyzedDocument(savableResponse.fileName, savableResponse.content);
        setSavableResponse(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleStartDrafting = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Trợ lý Pháp lý Nhà đất AI
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Tham vấn, tra cứu và tự động tạo hợp đồng, văn bản nhà đất chỉ trong vài phút.
        </p>
         <p className="mt-1 text-sm text-slate-500">
          Tác giả: Lê Minh Huấn - 0912041201
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Part 1: AI Consultation */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Phần 1: Tham vấn AI</h3>
          <p className="text-slate-600 text-sm mb-4">Hỏi đáp trực tiếp với AI. Bạn có thể đính kèm tài liệu để AI trả lời chính xác hơn.</p>
          <div className="flex-grow flex flex-col space-y-4">
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ví dụ: Thủ tục tặng cho đất cho con cần những giấy tờ gì?"
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                rows={4}
                aria-label="Nhập câu hỏi tham vấn"
              />
              <div>
                 <label htmlFor="consultation-file-input" className="sr-only">Đính kèm tài liệu</label>
                  <input
                      id="consultation-file-input"
                      type="file"
                      accept="image/png, image/jpeg, image/webp, application/pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  {consultationFile && <p className="text-xs text-slate-500 mt-1">Đã chọn: {consultationFile.name}</p>}
              </div>

              <div 
                className="w-full flex-grow p-3 bg-slate-50 border border-slate-200 rounded-md overflow-y-auto min-h-[140px]"
                aria-live="polite"
              >
                {isConsulting && <p className="text-slate-500 animate-pulse">AI đang suy nghĩ...</p>}
                {consultationError && <p className="text-red-600">{consultationError}</p>}
                {consultationResponse && <pre className="whitespace-pre-wrap text-slate-800 text-sm">{consultationResponse}</pre>}
                {!isConsulting && !consultationResponse && !consultationError && <p className="text-slate-400">Kết quả từ AI sẽ hiển thị ở đây.</p>}
              </div>
              {savableResponse && (
                <button
                    onClick={handleSaveResponse}
                    className="w-full text-sm font-medium px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                >
                    Lưu kết quả phân tích này vào thư viện
                </button>
              )}
               {saveSuccess && (
                <p className="text-sm text-green-600 text-center">Đã lưu thành công!</p>
              )}
          </div>
           <button
              onClick={handleConsultation}
              disabled={isConsulting || !prompt.trim()}
              className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isConsulting ? 'Đang xử lý...' : 'Gửi câu hỏi'}
            </button>
        </div>

        {/* Part 2: Automated Drafting */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Phần 2: Soạn thảo Tự động</h3>
           <p className="text-slate-600 text-sm mb-4">Chọn loại văn bản, tải lên giấy tờ, và để AI tự động điền mẫu cho bạn.</p>
           <div className="flex-grow space-y-4">
            <select
                value={selectedTemplateKey}
                onChange={(e) => setSelectedTemplateKey(e.target.value as DocumentTemplateKey | '')}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                aria-label="Chọn loại văn bản"
            >
                <option value="" disabled>-- Chọn loại văn bản --</option>
                {DOCUMENT_TEMPLATES.map(template => (
                    <option key={template.key} value={template.key}>{template.title}</option>
                ))}
            </select>
            <div className="bg-slate-50 p-4 rounded-md min-h-[100px] border border-slate-200">
                <h4 className="font-semibold text-slate-800">Mô tả</h4>
                <p className="text-sm text-slate-600 mt-1">
                    {selectedTemplate ? selectedTemplate.description : "Vui lòng chọn một loại văn bản để xem mô tả chi tiết."}
                </p>
            </div>
           </div>
           <button
              onClick={handleStartDrafting}
              disabled={!selectedTemplate}
              className="mt-auto w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Bắt đầu Soạn thảo
            </button>
        </div>
      </div>
    </div>
  );
};