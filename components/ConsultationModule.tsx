import React, { useState, useMemo, useEffect } from 'react';
import { UploadedFile, Procedure, LandPrice, StoredOfficialDocument } from '../types';
import { useAnalyzedDocumentStore } from '../hooks/useAnalyzedDocumentStore';
import { useLegalDocumentStore } from '../hooks/useLegalDocumentStore';
import { checkAndAnalyzeDocuments, consultWithAI } from '../services/geminiService';
import { useLandPriceStore } from '../hooks/useLandPriceStore';
import { DirectiveResponseGenerator } from './DirectiveResponseGenerator';
import { useOfficialDocumentStore } from '../hooks/useOfficialDocumentStore';


interface ConsultationModuleProps {
  onGoHome: () => void;
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


export const ConsultationModule: React.FC<ConsultationModuleProps> = ({ onGoHome }) => {
  const [consultationTab, setConsultationTab] = useState<'q&a' | 'check' | 'response'>('q&a');

  // State for AI Q&A
  const [prompt, setPrompt] = useState('');
  const [consultationField, setConsultationField] = useState<'land2024' | 'other' | 'general'>('land2024');
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
  const { customLandPrices } = useLandPriceStore();
  const [initialLandPrices, setInitialLandPrices] = useState<LandPrice[]>([]);

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

    if (consultationTab === 'check') {
        if (procedures.length === 0) fetchProcedures();
        if (initialLandPrices.length === 0) fetchPrices();
    }
  }, [consultationTab, procedures.length, initialLandPrices.length]);
  
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
            if (!selectedStoredLegalDocIds.includes(existingDoc.id)) {
                setSelectedStoredLegalDocIds(prev => [...prev, existingDoc.id]);
            }
        } else {
            const newDoc: UploadedFile = { name: file.name, base64, mimeType: file.type };
            setLegalDocs(prev => [...prev, newDoc]);
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
        const responseText = await consultWithAI(prompt, consultationField, consultationFile);
        setConsultationResponse(responseText);
        if (consultationFile) {
            setSavableResponse({ fileName: consultationFile.name, content: responseText });
        }
    } catch (err) {
      console.error(err);
      setConsultationError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi kết nối với AI.');
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
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Tham vấn & Phân tích AI (Luật Đất đai 2024)</h3>

          <div className="border-b border-slate-200">
              <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  <TabButton tabId="q&a" label="Hỏi đáp Nhanh" />
                  <TabButton tabId="check" label="Thẩm định Hồ sơ" />
                  <TabButton tabId="response" label="Soạn Công văn" />
              </nav>
          </div>

          {consultationTab === 'q&a' && (
               <div className="pt-6 flex-grow flex flex-col space-y-4">
                  <p className="text-slate-600 text-sm">Hỏi đáp trực tiếp với AI. Chọn lĩnh vực để có câu trả lời chính xác nhất.</p>
                  
                  <div className="w-full md:w-1/2">
                      <label htmlFor="consultation-field" className="block text-sm font-medium text-slate-700 mb-1">Lĩnh vực quan tâm:</label>
                      <select
                          id="consultation-field"
                          value={consultationField}
                          onChange={(e) => setConsultationField(e.target.value as 'land2024' | 'other' | 'general')}
                          className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                          <option value="land2024">Luật Đất đai 2024 (Chính xác cao)</option>
                          <option value="other">Lĩnh vực Pháp luật khác (Dùng Google Search)</option>
                          <option value="general">Tổng hợp</option>
                      </select>
                  </div>

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
                      {isConsulting && <p className="text-slate-500 animate-pulse">AI đang tra cứu và suy nghĩ...</p>}
                      {consultationError && <p className="text-red-600">{consultationError}</p>}
                      {consultationResponse && <div className="prose prose-sm max-w-none"><pre className="whitespace-pre-wrap text-slate-800 bg-transparent p-0 font-sans">{consultationResponse}</pre></div>}
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
                      {checkResponse && <div className="prose prose-sm max-w-none"><pre className="whitespace-pre-wrap text-slate-800 bg-transparent p-0 font-sans">{checkResponse}</pre></div>}
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
