import React, { useState, useMemo, useEffect } from 'react';
import { useDocumentStore } from '../hooks/useDocumentStore';
import { useAnalyzedDocumentStore } from '../hooks/useAnalyzedDocumentStore';
import { useLandPriceStore } from '../hooks/useLandPriceStore';
import { StoredDocument, Procedure, UploadedFile, LandPrice } from '../types';
import { analyzeAndSummarizeDocument, extractPriceDataFromDocument } from '../services/geminiService';
import { TemplateManager } from './TemplateManager';


interface DocumentManagerProps {
  onEdit: (doc: StoredDocument) => void;
  onGoHome: () => void;
  activeTab: 'documents' | 'procedures' | 'prices' | 'templates' | 'analysis';
  onTabChange: (tab: 'documents' | 'procedures' | 'prices' | 'templates' | 'analysis') => void;
}

type AuthorityLevel = 'all' | 'cấp tỉnh' | 'cấp xã';

export const DocumentManager: React.FC<DocumentManagerProps> = ({ onEdit, onGoHome, activeTab, onTabChange }) => {
  const { documents, deleteDocument } = useDocumentStore();
  const { analyzedDocuments, addAnalyzedDocument, deleteAnalyzedDocument } = useAnalyzedDocumentStore();
  const { customLandPrices, addCustomLandPrices, upsertCustomLandPrice } = useLandPriceStore();

  // State for Document Lookup
  const [citizenNameSearch, setCitizenNameSearch] = useState('');
  const [certNumberSearch, setCertNumberSearch] = useState('');

  // State for Land Price Lookup
  const [allLandPrices, setAllLandPrices] = useState<LandPrice[]>([]);
  const [landPriceSearchQuery, setLandPriceSearchQuery] = useState('');
  const [landPriceSearchResults, setLandPriceSearchResults] = useState<LandPrice[]>([]);
  const [isLandPriceSearching, setIsLandPriceSearching] = useState(false);
  const [landPriceSearchError, setLandPriceSearchError] = useState('');
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [priceUpdateError, setPriceUpdateError] = useState('');
  const [previewPrices, setPreviewPrices] = useState<LandPrice[] | null>(null);
  const [isPricePreviewOpen, setIsPricePreviewOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<LandPrice | null>(null);
  const [isEditPricePopupOpen, setIsEditPricePopupOpen] = useState(false);


  // State for Procedure Lookup
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [procedureSearchQuery, setProcedureSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProcedureId, setActiveProcedureId] = useState<string | null>(null);
  const [procedureError, setProcedureError] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState<AuthorityLevel>('all');

  // State for Document Analysis
  const [documentToAnalyze, setDocumentToAnalyze] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);


  // State for Analyzed Document Library
  const [activeAnalyzedDocId, setActiveAnalyzedDocId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const procResponse = await fetch('/data/procedures.json');
        if (!procResponse.ok) throw new Error(`Không thể tải file thủ tục.`);
        const procData = await procResponse.json();
        setProcedures(procData);

        const priceResponse = await fetch('/data/landPrices.json');
        if (!priceResponse.ok) throw new Error(`Không thể tải file giá đất.`);
        const initialPricesRaw = await priceResponse.json();
        
        const initialPrices: LandPrice[] = initialPricesRaw.map((price: Omit<LandPrice, 'id'>, index: number) => ({
            ...price,
            id: `initial-${index}`
        }));
        
        // Merge initial and custom prices
        const priceMap = new Map<string, LandPrice>();
        initialPrices.forEach(p => priceMap.set(p.id!, p));
        customLandPrices.forEach(p => priceMap.set(p.id!, p)); // Custom prices will overwrite initial ones if IDs match

        setAllLandPrices(Array.from(priceMap.values()));

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định.";
        setProcedureError(errorMessage);
        setLandPriceSearchError(errorMessage);
      }
    };
    fetchInitialData();
  }, [customLandPrices]);
  
  const procedureCategories = useMemo(() => {
      const cats = new Set(procedures.map(p => p.category));
      return ['Tất cả', ...Array.from(cats)];
  }, [procedures]);

  const filteredProcedures = useMemo(() => {
    return procedures
      .filter(proc => {
        if (selectedAuthority === 'all') return true;
        return proc.authority === selectedAuthority;
      })
      .filter(proc => {
        if (selectedCategory === 'Tất cả') return true;
        return proc.category === selectedCategory;
      })
      .filter(proc => {
        if (!procedureSearchQuery) return true;
        const searchLower = procedureSearchQuery.toLowerCase();
        return proc.title.toLowerCase().includes(searchLower) || proc.description.toLowerCase().includes(searchLower);
      });
  }, [procedures, procedureSearchQuery, selectedCategory, selectedAuthority]);

  const filteredDocuments = useMemo(() => {
    return documents
      .filter(doc => {
        if (!citizenNameSearch) return true;
        const searchLower = citizenNameSearch.toLowerCase();
        const parties = [
          ...(doc.data.partyA || []),
          ...(doc.data.partyB || []),
          ...(doc.data.heirs || []),
          ...(doc.data.deceasedPersons || []),
        ];
        return parties.some(p => p.fullName?.toLowerCase().includes(searchLower));
      })
      .filter(doc => {
        if (!certNumberSearch) return true;
        const searchLower = certNumberSearch.toLowerCase();
        return doc.data.landInfo?.some(l => l.certificateNumber?.toLowerCase().includes(searchLower));
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [documents, citizenNameSearch, certNumberSearch]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa văn bản "${title}" không? Thao tác này không thể hoàn tác.`)) {
      deleteDocument(id);
    }
  };
  
  const handleLandPriceSearch = () => {
    if (!landPriceSearchQuery.trim()) {
      setLandPriceSearchResults([]);
      return;
    }
    setIsLandPriceSearching(true);
    const lowerCaseQuery = landPriceSearchQuery.toLowerCase();
    const results = allLandPrices.filter(
      (item) => 
        item.streetName.toLowerCase().includes(lowerCaseQuery) || 
        item.section.toLowerCase().includes(lowerCaseQuery) ||
        item.commune?.toLowerCase().includes(lowerCaseQuery) ||
        item.notes?.toLowerCase().includes(lowerCaseQuery)
    );
    setLandPriceSearchResults(results);
    setIsLandPriceSearching(false);
  };

  const handleOpenEditPricePopup = (price: LandPrice) => {
    setEditingPrice(price);
    setIsEditPricePopupOpen(true);
  };

  const handleSaveEditedPrice = () => {
    if (editingPrice) {
      upsertCustomLandPrice(editingPrice);
       // Update search results for immediate feedback
      setLandPriceSearchResults(prevResults => 
        prevResults.map(p => p.id === editingPrice.id ? editingPrice : p)
      );
      setIsEditPricePopupOpen(false);
      setEditingPrice(null);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const toggleProcedure = (id: string) => {
    setActiveProcedureId(prevId => prevId === id ? null : id);
  };
  
  const toggleAnalyzedDoc = (id: string) => {
    setActiveAnalyzedDocId(prevId => (prevId === id ? null : id));
  };

  const handleFileForPriceUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = '';
      return;
    }

    setIsUpdatingPrices(true);
    setPriceUpdateError('');
    setPreviewPrices(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = (event.target?.result as string).split(',')[1];
        const uploadedFile: UploadedFile = { name: file.name, base64, mimeType: file.type };
        const extractedPrices = await extractPriceDataFromDocument(uploadedFile);

        if (extractedPrices && extractedPrices.length > 0) {
          setPreviewPrices(extractedPrices);
          setIsPricePreviewOpen(true);
        } else {
          setPriceUpdateError('Không tìm thấy dữ liệu giá đất hợp lệ trong tài liệu. Vui lòng thử lại với file khác.');
        }
      } catch (err) {
        setPriceUpdateError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định khi xử lý file.");
      } finally {
        setIsUpdatingPrices(false);
        e.target.value = '';
      }
    };
    reader.onerror = () => {
      setIsUpdatingPrices(false);
      setPriceUpdateError('Không thể đọc file đã chọn.');
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewPrices = () => {
    if (previewPrices) {
      addCustomLandPrices(previewPrices);
    }
    setIsPricePreviewOpen(false);
    setPreviewPrices(null);
  };


  const handleFileForAnalysisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setDocumentToAnalyze({
          name: file.name,
          base64,
          mimeType: file.type,
        });
        setAnalysisResult('');
        setAnalysisError('');
        setSaveSuccess(false);
      };
      reader.readAsDataURL(file);
    } else {
        setDocumentToAnalyze(null);
    }
    if (!e.target.value) {
        setDocumentToAnalyze(null);
    }
  };

  const handleAnalyzeDocument = async () => {
    if (!documentToAnalyze) return;
    setIsAnalyzing(true);
    setAnalysisResult('');
    setAnalysisError('');
    setSaveSuccess(false);
    try {
      const summary = await analyzeAndSummarizeDocument(documentToAnalyze);
      setAnalysisResult(summary);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsAnalyzing(false);
    }
  };

   const handleSaveAnalysis = () => {
    if (analysisResult && documentToAnalyze) {
      addAnalyzedDocument(documentToAnalyze.name, analysisResult);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };
  
  const AuthorityButton: React.FC<{ level: AuthorityLevel, label: string }> = ({ level, label }) => {
    const isActive = selectedAuthority === level;
    return (
      <button 
        onClick={() => setSelectedAuthority(level)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive 
            ? 'bg-blue-600 text-white shadow' 
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        {label}
      </button>
    );
  };
  
  const renderPricePreviewPopup = () => (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Xem trước Bảng giá đất Cập nhật</h3>
          <button onClick={() => setIsPricePreviewOpen(false)} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
        </div>
        <p className="text-slate-600 text-sm mb-4">Dữ liệu sau được trích xuất từ tệp của bạn. Nhấn "Lưu và Cập nhật" để thêm những mục này vào bảng giá hiện tại.</p>
        <div className="flex-grow overflow-y-auto border border-slate-200 rounded-md">
           <table className="w-full text-sm text-left text-slate-800">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
              <tr>
                <th scope="col" className="px-4 py-2">Xã/Phường/Đặc khu</th>
                <th scope="col" className="px-4 py-2 text-center">HSĐC</th>
                <th scope="col" className="px-4 py-2 text-center">HSVHM</th>
                <th scope="col" className="px-4 py-2 text-right">Đơn giá (đồng/m²)</th>
                <th scope="col" className="px-4 py-2">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {previewPrices?.map((item, index) => (
                <tr key={index} className="bg-white border-b border-slate-200">
                  <td className="px-4 py-2 font-medium">
                    {item.commune}
                    <span className="block text-xs text-slate-500 font-normal">{item.streetName} - {item.section}</span>
                  </td>
                  <td className="px-4 py-2 text-center">{item.adjustmentFactor}</td>
                  <td className="px-4 py-2 text-center">{item.vhmFactor}</td>
                  <td className="px-4 py-2 text-right font-semibold">{formatPrice(item.price)}</td>
                  <td className="px-4 py-2">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button 
            onClick={() => setIsPricePreviewOpen(false)}
            className="px-6 py-2 font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSaveNewPrices}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Lưu và Cập nhật
          </button>
        </div>
      </div>
    </div>
  );

   const renderEditPricePopup = () => (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Sửa đổi Giá đất</h3>
          <button onClick={() => setIsEditPricePopupOpen(false)} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
        </div>
        <div className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-slate-500">Khu vực</label>
              <p className="mt-1 p-2 bg-slate-100 rounded-md text-slate-800">{editingPrice?.commune} - {editingPrice?.streetName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500">Đoạn đường</label>
              <p className="mt-1 p-2 bg-slate-100 rounded-md text-slate-800">{editingPrice?.section}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500">Mã đoạn</label>
                <p className="mt-1 p-2 bg-slate-100 rounded-md text-slate-800">{editingPrice?.sectionCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500">HSĐC</label>
                <p className="mt-1 p-2 bg-slate-100 rounded-md text-slate-800">{editingPrice?.adjustmentFactor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500">HSVHM</label>
                <p className="mt-1 p-2 bg-slate-100 rounded-md text-slate-800">{editingPrice?.vhmFactor}</p>
              </div>
            </div>
          <div>
            <label htmlFor="edit-price-input" className="block text-sm font-medium text-slate-700">Đơn giá (đồng/m²)</label>
            <input
              id="edit-price-input"
              type="number"
              value={editingPrice?.price || ''}
              onChange={(e) => editingPrice && setEditingPrice({ ...editingPrice, price: Number(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setIsEditPricePopupOpen(false)}
            className="px-6 py-2 font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveEditedPrice}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
  
  const TabButton: React.FC<{ tabId: DocumentManagerProps['activeTab'], label: string }> = ({ tabId, label }) => (
     <button
        onClick={() => onTabChange(tabId)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
          activeTab === tabId
            ? 'border-blue-600 text-blue-700 bg-white'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
      >
        {label}
    </button>
  );

  return (
    <div className="max-w-full mx-auto space-y-8">
      {isPricePreviewOpen && previewPrices && renderPricePreviewPopup()}
      {isEditPricePopupOpen && editingPrice && renderEditPricePopup()}

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Trung tâm Tra cứu & Quản lý</h2>
          <p className="mt-2 text-lg text-slate-600">
            Phân tích, tra cứu thủ tục, quản lý văn bản, giá đất và các mẫu soạn thảo.
          </p>
        </div>
        <button
          onClick={onGoHome}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Soạn thảo mới
        </button>
      </div>

       <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <TabButton tabId="analysis" label="Phân tích & Thư viện" />
            <TabButton tabId="procedures" label="Thủ tục Hành chính" />
            <TabButton tabId="documents" label="Văn bản đã tạo" />
            <TabButton tabId="prices" label="Giá đất" />
            <TabButton tabId="templates" label="Quản lý Mẫu" />
          </nav>
       </div>
      
       {activeTab === 'analysis' && (
        <>
        {/* Document Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Phân tích và Tóm tắt Văn bản</h3>
          <p className="text-slate-600 text-sm mb-4">Tải lên một văn bản pháp lý (hợp đồng, quyết định,...) dưới dạng ảnh hoặc PDF để AI phân tích, tóm tắt nội dung và lưu vào thư viện.</p>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-grow">
                    <label htmlFor="document-analyzer-input" className="sr-only">Chọn văn bản</label>
                    <input
                        id="document-analyzer-input"
                        type="file"
                        accept="image/png, image/jpeg, image/webp, application/pdf"
                        onChange={handleFileForAnalysisChange}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <button
                    onClick={handleAnalyzeDocument}
                    disabled={!documentToAnalyze || isAnalyzing}
                    className="inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isAnalyzing ? 'Đang phân tích...' : 'Phân tích'}
                </button>
            </div>
            {documentToAnalyze && !isAnalyzing && (
              <div className="text-sm text-green-700 font-medium bg-green-50 p-2 rounded-md">
                Tệp đã chọn: {documentToAnalyze.name}
              </div>
            )}
            <div className="w-full flex-grow bg-slate-50 border border-slate-200 rounded-md overflow-y-auto min-h-[220px]">
              {isAnalyzing && <p className="p-4 text-slate-500 animate-pulse">AI đang đọc và phân tích văn bản...</p>}
              {analysisError && <p className="p-4 text-red-600">{analysisError}</p>}
              {analysisResult && (
                <div className="p-4 prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-slate-800 bg-transparent p-0 font-sans">{analysisResult}</pre>
                </div>
              )}
              {!isAnalyzing && !analysisResult && !analysisError && <p className="p-4 text-slate-400 text-center mt-4">Kết quả phân tích sẽ hiển thị ở đây.</p>}
            </div>
             {analysisResult && !isAnalyzing && (
                <div className="flex justify-center">
                    <button onClick={handleSaveAnalysis} className="px-5 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
                        Lưu kết quả này vào thư viện
                    </button>
                </div>
             )}
              {saveSuccess && <p className="text-sm text-green-600 text-center -mt-2">Đã lưu thành công!</p>}
          </div>
        </div>
        
        {/* Analyzed Document Library */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Thư viện Văn bản đã Phân tích</h3>
          {analyzedDocuments.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {analyzedDocuments.map(doc => (
                <div key={doc.id} className="border border-slate-200 rounded-md">
                  <div className="w-full text-left p-4 bg-slate-50 flex justify-between items-center gap-2">
                    <div className="flex-grow">
                      <p className="font-semibold text-slate-800">{doc.fileName}</p>
                      <p className="text-xs text-slate-500">Lưu lúc: {new Date(doc.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleAnalyzedDoc(doc.id)} className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                        {activeAnalyzedDocId === doc.id ? 'Ẩn' : 'Xem'}
                      </button>
                      <button 
                        onClick={() => deleteAnalyzedDocument(doc.id)} 
                        className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  {activeAnalyzedDocId === doc.id && (
                    <div className="p-4 bg-white prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-slate-800 bg-transparent p-0 font-sans">{doc.analysisContent}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">Thư viện trống. Các kết quả phân tích bạn lưu lại sẽ xuất hiện ở đây.</p>
          )}
        </div>
        </>
       )}
      
       {activeTab === 'procedures' && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Tra cứu Thủ tục Hành chính</h3>
            <div className="mb-4 flex space-x-2">
                <AuthorityButton level="all" label="Tất cả" />
                <AuthorityButton level="cấp tỉnh" label="Cấp Tỉnh" />
                <AuthorityButton level="cấp xã" label="Cấp Xã" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="Tìm theo tên thủ tục..."
                value={procedureSearchQuery}
                onChange={(e) => setProcedureSearchQuery(e.target.value)}
                className="md:col-span-2 w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <select 
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                {procedureCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
                {filteredProcedures.map(proc => (
                    <div key={proc.id} className="border border-slate-200 rounded-md">
                        <button onClick={() => toggleProcedure(proc.id)} className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center">
                            <span className="font-semibold text-blue-800">{proc.title}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${activeProcedureId === proc.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {activeProcedureId === proc.id && (
                            <div className="p-4 bg-white text-sm">
                                <p className="text-slate-600 mb-4">{proc.description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <p><strong>Đối tượng:</strong> {proc.applicableTo}</p>
                                    <p><strong>Thời gian giải quyết:</strong> {proc.duration}</p>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Hồ sơ cần chuẩn bị:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                                        {proc.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Các bước thực hiện:</h4>
                                    <ol className="list-decimal list-inside space-y-2 text-slate-700">
                                        {proc.steps.map((step, i) => <li key={i}>{step}</li>)}
                                    </ol>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {filteredProcedures.length === 0 && !procedureError && (
                    <p className="text-center text-slate-500 py-8">Không tìm thấy thủ tục phù hợp.</p>
                )}
                {procedureError && <p className="text-center text-red-500 py-8">{procedureError}</p>}
            </div>
          </div>
       )}
      
       {activeTab === 'documents' && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Tra cứu Văn bản đã tạo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Tra cứu theo Tên Công dân..."
                value={citizenNameSearch}
                onChange={(e) => setCitizenNameSearch(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <input
                type="text"
                placeholder="Tra cứu theo Số Giấy chứng nhận..."
                value={certNumberSearch}
                onChange={(e) => setCertNumberSearch(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="overflow-x-auto">
              {filteredDocuments.length > 0 ? (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">STT</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Thời gian tạo</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Loại văn bản</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tên Bên A</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CCCD Bên A</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tên Bên B</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CCCD Bên B</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Số GCN</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredDocuments.map((doc, index) => {
                      let partyAName: string;
                      let partyAId: string;
                      
                      if (doc.data.partyA && doc.data.partyA.length > 0) {
                          partyAName = doc.data.partyA[0].fullName || '---';
                          partyAId = doc.data.partyA[0].idNumber || '---';
                      } else if (doc.data.heirs && doc.data.heirs.length > 0) {
                          partyAName = `Các thừa kế của ${doc.data.deceasedPersons?.[0]?.fullName || '...'}`;
                          partyAId = '---';
                      } else {
                          partyAName = '---';
                          partyAId = '---';
                      }
                      
                      const partyB = doc.data.partyB?.[0];
                      const landCert = doc.data.landInfo?.[0];

                      return (
                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{index + 1}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(doc.createdAt).toLocaleString('vi-VN')}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{doc.templateTitle}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{partyAName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{partyAId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{partyB?.fullName || '---'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{partyB?.idNumber || '---'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{landCert?.certificateNumber || '---'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                            <button
                              onClick={() => onEdit(doc)}
                              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              Xem/Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id, doc.templateTitle)}
                              className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-slate-800">Không tìm thấy văn bản nào</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {documents.length > 0 ? "Thử thay đổi bộ lọc tìm kiếm của bạn." : "Hãy bắt đầu tạo văn bản mới, chúng sẽ được lưu tại đây."}
                  </p>
                </div>
              )}
            </div>
          </div>
       )}

      {activeTab === 'prices' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Tra cứu Nhanh Giá đất</h3>
            <p className="text-slate-600 text-sm mb-4">Tra cứu đơn giá đất theo tên đường/phố. Dữ liệu tham khảo Bảng giá đất tỉnh Quảng Ninh 2020-2024.</p>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={landPriceSearchQuery}
                    onChange={(e) => setLandPriceSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLandPriceSearch()}
                    placeholder="Nhập tên đường, phố, xã..."
                    className="flex-grow p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                    aria-label="Nhập tên đường để tra cứu"
                />
                <button
                    onClick={handleLandPriceSearch}
                    disabled={isLandPriceSearching || !landPriceSearchQuery.trim()}
                    className="inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLandPriceSearching ? 'Đang tìm...' : 'Tra cứu'}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                  <label htmlFor="price-update-upload" className="text-sm font-medium text-slate-700">Hoặc cập nhật bảng giá đất mới:</label>
                  <input
                        id="price-update-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/webp, application/pdf"
                        onChange={handleFileForPriceUpdate}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                    />
                    {isUpdatingPrices && <p className="text-sm text-slate-500 animate-pulse">Đang xử lý tệp...</p>}
                    {priceUpdateError && <p className="text-sm text-red-600">{priceUpdateError}</p>}
              </div>
                <div className="w-full flex-grow bg-slate-50 border border-slate-200 rounded-md overflow-y-auto min-h-[220px]">
                  {landPriceSearchError ? (
                    <p className="p-3 text-red-600">{landPriceSearchError}</p>
                  ) : landPriceSearchResults.length > 0 ? (
                    <table className="w-full text-sm text-left text-slate-800">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                          <th scope="col" className="px-4 py-2">Xã/Phường/Đặc khu</th>
                          <th scope="col" className="px-4 py-2 text-center">HS Điều chỉnh</th>
                          <th scope="col" className="px-4 py-2 text-center">HS VHM</th>
                          <th scope="col" className="px-4 py-2 text-right">Đơn giá (đồng/m²)</th>
                          <th scope="col" className="px-4 py-2">Ghi chú</th>
                          <th scope="col" className="px-4 py-2 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landPriceSearchResults.map((item, index) => (
                          <tr key={item.id || index} className="bg-white border-b border-slate-200">
                            <td className="px-4 py-2 font-medium">
                              {item.commune}
                              <span className="block text-xs text-slate-500 font-normal">{item.streetName} - {item.section}</span>
                            </td>
                            <td className="px-4 py-2 text-center">{item.adjustmentFactor}</td>
                            <td className="px-4 py-2 text-center">{item.vhmFactor}</td>
                            <td className="px-4 py-2 text-right font-semibold">{formatPrice(item.price)}</td>
                            <td className="px-4 py-2">{item.notes}</td>
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => handleOpenEditPricePopup(item)}
                                className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                              >
                                Sửa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-3 text-slate-400 text-center mt-4">Nhập tên đường và nhấn "Tra cứu" để xem kết quả.</p>
                  )}
                </div>
            </div>
          </div>
      )}

      {activeTab === 'templates' && (
        <TemplateManager />
      )}
    </div>
  );
};