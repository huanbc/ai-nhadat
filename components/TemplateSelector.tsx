


import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { DOCUMENT_TEMPLATES } from '../constants';
import { DocumentTemplate, DocumentTemplateKey, UploadedFile, Procedure, LandPrice } from '../types';
import { useAnalyzedDocumentStore } from '../hooks/useAnalyzedDocumentStore';
import { useLegalDocumentStore } from '../hooks/useLegalDocumentStore';
import { checkAndAnalyzeDocuments, quickExtractPersonalInfo } from '../services/geminiService';
import { useLandPriceStore } from '../hooks/useLandPriceStore';
import { DirectiveResponseGenerator } from './DirectiveResponseGenerator';


interface TemplateSelectorProps {
  onSelect: (template: DocumentTemplate) => void;
  onGoHome?: () => void;
}

// Simple hash function for content checking
const stringToHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString() + '_' + str.length;
};


export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, onGoHome }) => {
  const [mode, setMode] = useState<'select' | 'consult' | 'draft'>('select');
  const [consultationTab, setConsultationTab] = useState<'q&a' | 'check' | 'response'>('q&a');

  // State for AI Q&A
  const [prompt, setPrompt] = useState('');
  const [consultationResponse, setConsultationResponse] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultationError, setConsultationError] = useState('');
  const [consultationFile, setConsultationFile] = useState<UploadedFile | null>(null);
  const [savableResponse, setSavableResponse] = useState<{ fileName: string; content: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { addAnalyzedDocument } = useAnalyzedDocumentStore();

  // State for Document Check
  const [checkFiles, setCheckFiles] = useState<UploadedFile[]>([]);
  const [legalDocs, setLegalDocs] = useState<UploadedFile[]>([]); // Newly uploaded legal docs for this session
  const [isChecking, setIsChecking] = useState(false);
  const [checkResponse, setCheckResponse] = useState('');
  const [checkError, setCheckError] = useState('');
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>('');
  const [shouldCheckLandPrice, setShouldCheckLandPrice] = useState(false);
  const [taxComparisonSource, setTaxComparisonSource] = useState<'public' | 'internal'>('public');
  const [additionalCheckRequest, setAdditionalCheckRequest] = useState('');


  // State for Legal Document Library
  const { legalDocuments, addLegalDocument, deleteLegalDocument } = useLegalDocumentStore();
  const [selectedStoredLegalDocIds, setSelectedStoredLegalDocIds] = useState<string[]>([]);
  const [uploadMessage, setUploadMessage] = useState('');
  
  // State for Land Prices (for internal check)
  const { customLandPrices, addCustomLandPrices } = useLandPriceStore();
  const [initialLandPrices, setInitialLandPrices] = useState<LandPrice[]>([]);


  // State for Document Drafting
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<DocumentTemplateKey | ''>('');
  
  // State for Quick Extract
  const [quickExtractFile, setQuickExtractFile] = useState<UploadedFile | null>(null);
  const [quickExtractResult, setQuickExtractResult] = useState('');
  const [isQuickExtracting, setIsQuickExtracting] = useState(false);
  const [quickExtractError, setQuickExtractError] = useState('');
  const [copyExtractSuccess, setCopyExtractSuccess] = useState(false);


  const selectedTemplate = useMemo(() => {
    if (!selectedTemplateKey) return null;
    return DOCUMENT_TEMPLATES.find(t => t.key === selectedTemplateKey) || null;
  }, [selectedTemplateKey]);

  useEffect(() => {
    // Fetch procedures when component mounts and check tab is active
    const fetchProcedures = async () => {
        try {
            const response = await fetch('/data/procedures.json');
            if (!response.ok) {
                throw new Error('Failed to load procedures');
            }
            const data = await response.json();
            setProcedures(data);
        } catch (error) {
            console.error(error);
            setCheckError('Không thể tải danh sách thủ tục hành chính.');
        }
    };
     const fetchPrices = async () => {
        try {
            const response = await fetch('/data/landPrices.json');
            if (!response.ok) throw new Error('Failed to load prices');
            const data = await response.json();
            const formattedInitial = data.map((p: any, i: number) => ({ ...p, id: `initial-${i}`}));
            setInitialLandPrices(formattedInitial);
        } catch (error) {
            console.error("Failed to load initial land prices", error);
             setCheckError(prev => prev + ' Không thể tải dữ liệu giá đất.');
        }
    };

    if (mode === 'consult' && consultationTab === 'check') {
        fetchProcedures();
        fetchPrices();
    }
  }, [mode, consultationTab]);
  
  const allLandPrices = useMemo(() => {
    const priceMap = new Map<string, LandPrice>();
    initialLandPrices.forEach(p => p.id && priceMap.set(p.id, p));
    customLandPrices.forEach(p => p.id && priceMap.set(p.id, p));
    return Array.from(priceMap.values());
  }, [initialLandPrices, customLandPrices]);

  const handleConsultationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!e.target.value) {
        setConsultationFile(null);
    }
  };
  
   const handleCheckFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        const newFiles: UploadedFile[] = [];
        let filesToProcess = files.length;

        // FIX: Explicitly type `file` as `File` to resolve type inference issues where `file` was treated as `unknown`.
        Array.from(files).forEach((file: File) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = (event.target?.result as string).split(',')[1];
                newFiles.push({ name: file.name, base64, mimeType: file.type });
                filesToProcess--;
                if (filesToProcess === 0) {
                    setCheckFiles(prev => [...prev, ...newFiles]);
                }
            };
            reader.readAsDataURL(file);
        });
    }
    e.target.value = ''; // Reset input
  };

  const removeCheckFile = (index: number) => {
    setCheckFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleLegalDocsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadMessage('');
    
    // FIX: Iterate directly over the FileList. `file` will be correctly typed as `File`.
    for (const file of files) {
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });

        const hash = stringToHash(base64);
        const existingDoc = legalDocuments.find(doc => doc.contentHash === hash);

        if (existingDoc) {
            setUploadMessage(`Tệp "${file.name}" đã tồn tại trong thư viện. Đã tự động chọn.`);
            // Auto-select the existing document if not already selected
            if (!selectedStoredLegalDocIds.includes(existingDoc.id)) {
                setSelectedStoredLegalDocIds(prev => [...prev, existingDoc.id]);
            }
        } else {
            const newDoc: UploadedFile = { name: file.name, base64, mimeType: file.type };
            // Add to temporary list for this session's check
            setLegalDocs(prev => [...prev, newDoc]);
            // Save to persistent library
            addLegalDocument(file.name, base64, file.type, hash);
             setUploadMessage(`Đã thêm tệp mới "${file.name}" vào thư viện.`);
        }
    }
     setTimeout(() => setUploadMessage(''), 4000); // Clear message after 4s
     e.target.value = ''; // Reset input
  };

  const removeLegalDoc = (index: number) => {
    setLegalDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleStoredLegalDocToggle = (docId: string) => {
    setSelectedStoredLegalDocIds(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };
  
  const handleDeleteLegalDocFromLibrary = (id: string, fileName: string) => {
    if(window.confirm(`Bạn có chắc muốn xóa vĩnh viễn "${fileName}" khỏi thư viện?`)){
        deleteLegalDocument(id);
        setSelectedStoredLegalDocIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  }


  const handleConsultation = async () => {
    if (!prompt.trim()) return;
    setIsConsulting(true);
    setConsultationError('');
    setConsultationResponse('');
    setSavableResponse(null);
    setSaveSuccess(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const systemInstruction = `Bạn là một trợ lý pháp lý AI chuyên sâu về Luật Đất đai 2024 tại Việt Nam.
      
QUY TẮC QUAN TRỌNG:
1. Mọi phân tích, tư vấn và trích dẫn luật PHẢI CĂN CỨ vào LUẬT ĐẤT ĐAI 2024 và các Nghị định, Thông tư hướng dẫn thi hành mới nhất.
2. TUYỆT ĐỐI KHÔNG sử dụng, trích dẫn hoặc tư vấn dựa trên Luật Đất đai 2013 hoặc các văn bản cũ đã hết hiệu lực.
3. Trừ khi người dùng yêu cầu rõ ràng "so sánh với luật cũ", bạn không được đề cập đến luật cũ.
4. Khi trả lời, hãy tập trung vào các bước thực hiện, hồ sơ cần chuẩn bị, và thời gian giải quyết theo quy định mới.`;
      
      let requestContents;
      if (consultationFile) {
        requestContents = {
          parts: [
            { text: `Dựa vào tài liệu được đính kèm và quy định của Luật Đất đai 2024, hãy trả lời câu hỏi sau: ${prompt}` },
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
  
  const handleDocumentCheck = async () => {
    const selectedProcedure = procedures.find(p => p.id === selectedProcedureId);
    if (checkFiles.length === 0 || !selectedProcedure) {
      setCheckError("Vui lòng tải lên hồ sơ và chọn một thủ tục để kiểm tra.");
      return;
    }
    setIsChecking(true);
    setCheckError('');
    setCheckResponse('');
    try {
        const selectedStoredDocs = legalDocuments.filter(doc => selectedStoredLegalDocIds.includes(doc.id));
        const mappedStoredDocs: UploadedFile[] = selectedStoredDocs.map(doc => ({
            name: doc.fileName,
            base64: doc.base64,
            mimeType: doc.mimeType
        }));

        const combinedLegalDocs = [...legalDocs, ...mappedStoredDocs];
        
        const taxCheckOptions = {
            enabled: shouldCheckLandPrice,
            source: taxComparisonSource,
        };

        const internalPricesToPass = taxCheckOptions.enabled && taxComparisonSource === 'internal' ? allLandPrices : [];

        const result = await checkAndAnalyzeDocuments(checkFiles, selectedProcedure, taxCheckOptions, additionalCheckRequest, combinedLegalDocs, internalPricesToPass);
        setCheckResponse(result);
    } catch (err) {
        setCheckError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định khi kiểm tra hồ sơ.');
    } finally {
        setIsChecking(false);
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

  const handleQuickExtractFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              const base64 = (event.target?.result as string).split(',')[1];
              setQuickExtractFile({
                  name: file.name,
                  base64,
                  mimeType: file.type,
              });
              setQuickExtractError('');
          };
          reader.readAsDataURL(file);
      }
  };

  const handleQuickExtract = async () => {
      if (!quickExtractFile) return;
      setIsQuickExtracting(true);
      setQuickExtractError('');
      setQuickExtractResult('');
      try {
          const result = await quickExtractPersonalInfo(quickExtractFile);
          setQuickExtractResult(result);
      } catch (err) {
          setQuickExtractError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi trích xuất.');
      } finally {
          setIsQuickExtracting(false);
      }
  };

  const handleCopyExtractResult = () => {
      navigator.clipboard.writeText(quickExtractResult);
      setCopyExtractSuccess(true);
      setTimeout(() => setCopyExtractSuccess(false), 2000);
  };

  const renderSelection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div onClick={() => setMode('consult')} className="group cursor-pointer bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center text-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-800">Tham vấn & Phân tích AI</h3>
        <p className="mt-2 text-sm text-slate-600">Hỏi đáp pháp lý, kiểm tra đối chiếu và phân tích bộ hồ sơ nhà đất của bạn theo Luật Đất đai 2024.</p>
      </div>

      <div onClick={() => setMode('draft')} className="group cursor-pointer bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center text-center">
         <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-800">Soạn thảo Văn bản Tự động</h3>
        <p className="mt-2 text-sm text-slate-600">Chọn loại văn bản, tải lên giấy tờ, và để AI tự động điền thông tin vào mẫu cho bạn.</p>
      </div>
    </div>
  );

  const renderConsultation = () => {
    const TabButton: React.FC<{ tabId: 'q&a' | 'check' | 'response', label: string }> = ({ tabId, label }) => (
        <button
           onClick={() => setConsultationTab(tabId)}
           className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
             consultationTab === tabId
               ? 'border-blue-600 text-blue-700 bg-white'
               : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
           }`}
         >
           {label}
       </button>
     );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col max-w-4xl mx-auto">
            <button onClick={() => setMode('select')} className="self-start text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Quay lại
            </button>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Tham vấn & Phân tích AI (Luật Đất đai 2024)</h3>

            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton tabId="q&a" label="Hỏi đáp Nhanh" />
                    <TabButton tabId="check" label="Kiểm tra Hồ sơ" />
                    <TabButton tabId="response" label="Phản hồi Văn bản Chỉ đạo" />
                </nav>
            </div>

            {consultationTab === 'q&a' && (
                 <div className="pt-6 flex-grow flex flex-col space-y-4">
                    <p className="text-slate-600 text-sm">Hỏi đáp trực tiếp với AI. Bạn có thể đính kèm một tài liệu để AI trả lời chính xác hơn.</p>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ví dụ: Theo Luật Đất đai 2024, điều kiện tách thửa là gì?"
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
                            onChange={handleConsultationFileChange}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                        />
                        {consultationFile && <p className="text-xs text-slate-500 mt-1">Đã chọn: {consultationFile.name}</p>}
                    </div>
                    <div 
                        className="w-full flex-grow p-3 bg-slate-50 border border-slate-200 rounded-md overflow-y-auto min-h-[140px]"
                        aria-live="polite"
                    >
                        {isConsulting && <p className="text-slate-500 animate-pulse">AI đang tra cứu Luật 2024 và suy nghĩ...</p>}
                        {consultationError && <p className="text-red-600">{consultationError}</p>}
                        {consultationResponse && <pre className="whitespace-pre-wrap text-slate-800 text-sm font-sans">{consultationResponse}</pre>}
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
                    <button
                        onClick={handleConsultation}
                        disabled={isConsulting || !prompt.trim()}
                        className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {isConsulting ? 'Đang xử lý...' : 'Gửi câu hỏi'}
                    </button>
                </div>
            )}
            {consultationTab === 'check' && (
                <div className="pt-6 flex-grow flex flex-col space-y-4">
                    <p className="text-slate-600 text-sm">Tải lên bộ hồ sơ của bạn (CCCD, sổ đỏ, hợp đồng,...), chọn thủ tục cần thực hiện để AI kiểm tra theo quy định của Luật Đất đai 2024.</p>
                     <select
                        value={selectedProcedureId}
                        onChange={(e) => setSelectedProcedureId(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                        aria-label="Chọn thủ tục hành chính"
                    >
                        <option value="" disabled>-- Vui lòng chọn thủ tục cần kiểm tra --</option>
                        {procedures.map(proc => (
                            <option key={proc.id} value={proc.id}>{proc.title}</option>
                        ))}
                    </select>
                     <div className="flex items-start p-3 bg-slate-50 border border-slate-200 rounded-md">
                        <div className="flex items-center h-5">
                            <input
                                type="checkbox"
                                id="check-land-price"
                                checked={shouldCheckLandPrice}
                                onChange={(e) => setShouldCheckLandPrice(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="check-land-price" className="font-medium text-slate-700">
                                Kiểm tra Tờ khai Thuế
                            </label>
                            <p className="text-xs text-slate-500">Đối chiếu giá trị kê khai trên tờ khai thuế với bảng giá đất.</p>
                            {shouldCheckLandPrice && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            id="compare-public"
                                            name="comparison-source"
                                            type="radio"
                                            value="public"
                                            checked={taxComparisonSource === 'public'}
                                            onChange={() => setTaxComparisonSource('public')}
                                            className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="compare-public" className="ml-2 block text-xs font-medium text-slate-600">
                                            Đối chiếu với Bảng giá đất nhà nước (dùng Google Search)
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="compare-internal"
                                            name="comparison-source"
                                            type="radio"
                                            value="internal"
                                            checked={taxComparisonSource === 'internal'}
                                            onChange={() => setTaxComparisonSource('internal')}
                                            className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="compare-internal" className="ml-2 block text-xs font-medium text-slate-600">
                                            Đối chiếu với cơ sở dữ liệu giá đất của ứng dụng
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="additional-request" className="block text-sm font-medium text-slate-700">
                            Yêu cầu kiểm tra bổ sung (Tùy chọn)
                        </label>
                        <textarea
                            id="additional-request"
                            value={additionalCheckRequest}
                            onChange={(e) => setAdditionalCheckRequest(e.target.value)}
                            placeholder="Ví dụ: Kiểm tra xem thông tin thừa kế có phù hợp với di chúc đính kèm không?"
                            className="mt-1 w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label htmlFor="check-files-input" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-dashed border-slate-300 text-center p-4 rounded-md">
                            Tải lên Hồ sơ của Công dân (CCCD, Sổ đỏ, Hợp đồng,...)
                        </label>
                         <input
                            id="check-files-input"
                            type="file"
                            accept="image/png, image/jpeg, image/webp, application/pdf"
                            onChange={handleCheckFilesChange}
                            multiple
                            className="hidden"
                        />
                        {checkFiles.length > 0 && (
                             <div className="mt-2 space-y-1">
                                {checkFiles.map((file, index) => (
                                    <div key={index} className="text-xs text-slate-700 bg-slate-100 p-1.5 rounded-md flex justify-between items-center">
                                        <span>{file.name}</span>
                                        <button onClick={() => removeCheckFile(index)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                     <div className="pt-2 space-y-3">
                        <label htmlFor="legal-docs-input" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 cursor-pointer border border-dashed border-amber-300 text-center p-4 rounded-md">
                            (Tùy chọn) Tải lên Tài liệu Pháp lý để đối chiếu
                            <span className="block text-xs font-normal mt-1">Tệp mới sẽ được tự động lưu vào thư viện bên dưới.</span>
                        </label>
                         <input
                            id="legal-docs-input"
                            type="file"
                            accept="image/png, image/jpeg, image/webp, application/pdf"
                            onChange={handleLegalDocsChange}
                            multiple
                            className="hidden"
                        />
                        {uploadMessage && <p className="text-sm text-green-600 text-center">{uploadMessage}</p>}
                        {legalDocs.length > 0 && (
                             <div className="mt-2 space-y-1">
                                {legalDocs.map((file, index) => (
                                    <div key={index} className="text-xs text-slate-700 bg-amber-100 p-1.5 rounded-md flex justify-between items-center">
                                        <span>{file.name} (mới tải lên)</span>
                                        <button onClick={() => removeLegalDoc(index)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Legal Document Library */}
                    <div className="pt-2">
                      <h4 className="text-sm font-semibold text-slate-800 mb-2">Hoặc chọn từ Thư viện Tài liệu Pháp lý</h4>
                      {legalDocuments.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-md p-2 bg-slate-50">
                          {legalDocuments.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                              <label htmlFor={`stored-doc-${doc.id}`} className="flex items-center gap-3 cursor-pointer flex-grow">
                                <input
                                  type="checkbox"
                                  id={`stored-doc-${doc.id}`}
                                  checked={selectedStoredLegalDocIds.includes(doc.id)}
                                  onChange={() => handleStoredLegalDocToggle(doc.id)}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="text-sm">
                                    <p className="font-medium text-slate-900">{doc.fileName}</p>
                                    <p className="text-xs text-slate-500">Lưu lúc: {new Date(doc.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                              </label>
                              <button onClick={() => handleDeleteLegalDocFromLibrary(doc.id, doc.fileName)} className="text-red-500 hover:text-red-700 text-xl leading-none p-1 rounded-full hover:bg-red-100">&times;</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-sm text-slate-500 py-4">Thư viện trống. Tải lên một tài liệu để bắt đầu.</p>
                      )}
                    </div>
                     <div 
                        className="w-full flex-grow p-3 bg-slate-50 border border-slate-200 rounded-md overflow-y-auto min-h-[200px]"
                        aria-live="polite"
                    >
                        {isChecking && <p className="text-slate-500 animate-pulse">AI đang kiểm tra hồ sơ...</p>}
                        {checkError && <p className="text-red-600">{checkError}</p>}
                        {checkResponse && <pre className="whitespace-pre-wrap text-slate-800 text-sm font-sans">{checkResponse}</pre>}
                        {!isChecking && !checkResponse && !checkError && <p className="text-slate-400">Báo cáo kiểm tra sẽ hiển thị ở đây.</p>}
                    </div>
                    <button
                        onClick={handleDocumentCheck}
                        disabled={isChecking || checkFiles.length === 0 || !selectedProcedureId}
                        className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra Hồ sơ'}
                    </button>
                </div>
            )}
            {consultationTab === 'response' && (
                <div className="pt-6">
                    <DirectiveResponseGenerator onBack={() => setConsultationTab('q&a')} onGoHome={onGoHome} />
                </div>
            )}
        </div>
    )
  };

  const renderDrafting = () => (
     <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col max-w-3xl mx-auto">
        <button onClick={() => setMode('select')} className="self-start text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Quay lại
        </button>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Soạn thảo Tự động</h3>
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
              className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Bắt đầu Soạn thảo
            </button>

            {/* Quick Extract Section */}
            <div className="mt-10 border-t border-slate-200 pt-8">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Công cụ hỗ trợ: Trích xuất danh sách thông tin</h4>
                <p className="text-sm text-slate-600 mb-4">
                    Tải lên ảnh/PDF chứa thông tin cá nhân (CCCD, danh sách...) để lấy chuỗi văn bản chuẩn.
                </p>
                <div className="space-y-3">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, application/pdf"
                        onChange={handleQuickExtractFileChange}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                     {quickExtractFile && (
                        <p className="text-xs text-green-600">Đã chọn: {quickExtractFile.name}</p>
                    )}
                    <button
                        onClick={handleQuickExtract}
                        disabled={!quickExtractFile || isQuickExtracting}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                        {isQuickExtracting ? 'Đang trích xuất...' : 'Trích xuất thông tin'}
                    </button>
                    {quickExtractError && <p className="text-red-600 text-sm">{quickExtractError}</p>}
                    {quickExtractResult && (
                        <div className="mt-3 relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kết quả:</label>
                            <textarea
                                value={quickExtractResult}
                                readOnly
                                className="w-full h-32 p-2 text-sm border border-slate-300 rounded-md bg-slate-50 font-mono"
                            />
                             <button
                                onClick={handleCopyExtractResult}
                                className="absolute top-8 right-2 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                {copyExtractSuccess ? 'Đã copy!' : 'Copy'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
    </div>
  );

  const renderContent = () => {
    switch (mode) {
      case 'consult':
        return renderConsultation();
      case 'draft':
        return renderDrafting();
      case 'select':
      default:
        return renderSelection();
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          AI Trợ lý Nhà đất
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Tham vấn, tra cứu và tự động tạo hợp đồng, văn bản nhà đất chỉ trong vài phút.
        </p>
         <p className="mt-1 text-sm text-slate-500">
          Tác giả: Lê Minh Huấn - 0912041201
        </p>
      </div>
      
      {renderContent()}
    </div>
  );
};
