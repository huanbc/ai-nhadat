
import React, { useState, useMemo, useEffect } from 'react';
import { useDocumentStore } from '../hooks/useDocumentStore';
import { useLandPriceStore } from '../hooks/useLandPriceStore';
import { StoredDocument, Procedure, UploadedFile, LandPrice, StoredOfficialDocument, MapRecord } from '../types';
import { extractPriceDataFromDocument } from '../services/geminiService';
import { useOfficialDocumentStore } from '../hooks/useOfficialDocumentStore';
import { QUANG_NINH_ADDRESS_MAPPING } from '../utils/addressNormalizer';
import { PROCEDURES_DATA } from '../data/proceduresData';
import { LAND_PRICES_DATA } from '../data/landPricesData';
import { MAP_DATA } from '../data/mapData';


interface DocumentManagerProps {
  onEdit: (doc: StoredDocument) => void;
  onGoHome: () => void;
  activeTab: 'documents' | 'procedures' | 'prices' | 'officialDocs' | 'adminUnits' | 'mapLookup';
  onTabChange: (tab: 'documents' | 'procedures' | 'prices' | 'officialDocs' | 'adminUnits' | 'mapLookup') => void;
  onBack?: () => void;
}

type AuthorityLevel = 'all' | 'cấp tỉnh' | 'cấp xã';

export const DocumentManager: React.FC<DocumentManagerProps> = ({ onEdit, onGoHome, activeTab, onTabChange, onBack }) => {
  const { documents, deleteDocument } = useDocumentStore();
  const { customLandPrices, addCustomLandPrices, upsertCustomLandPrice } = useLandPriceStore();
  const { officialDocuments, deleteOfficialDocument } = useOfficialDocumentStore();

  // State for Document Lookup
  const [citizenNameSearch, setCitizenNameSearch] = useState('');
  const [certNumberSearch, setCertNumberSearch] = useState('');
  const [parcelNumberSearch, setParcelNumberSearch] = useState('');
  const [mapSheetNumberSearch, setMapSheetNumberSearch] = useState('');

  // State for Land Price Lookup
  const [landPriceSearchQuery, setLandPriceSearchQuery] = useState('');
  const [landPriceSearchResults, setLandPriceSearchResults] = useState<LandPrice[]>([]);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [priceUpdateError, setPriceUpdateError] = useState('');
  const [previewPrices, setPreviewPrices] = useState<LandPrice[] | null>(null);
  const [isPricePreviewOpen, setIsPricePreviewOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<LandPrice | null>(null);
  const [isEditPricePopupOpen, setIsEditPricePopupOpen] = useState(false);
  
  // Filters for Land Price
  const [selectedPriceCommune, setSelectedPriceCommune] = useState('');
  const [selectedPriceStreet, setSelectedPriceStreet] = useState('');
  const [selectedPriceFactor, setSelectedPriceFactor] = useState('');
  const [selectedLandType, setSelectedLandType] = useState('');


  // State for Procedure Lookup
  const [procedureSearchQuery, setProcedureSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [activeProcedureId, setActiveProcedureId] = useState<string | null>(null);
  const [selectedAuthority, setSelectedAuthority] = useState<AuthorityLevel>('all');

  // State for Analyzed Document Library
  const [viewingOfficialDoc, setViewingOfficialDoc] = useState<StoredOfficialDocument | null>(null);

  // State for Admin Unit Lookup
  const [adminUnitSearch, setAdminUnitSearch] = useState('');
  const [adminUnitResults, setAdminUnitResults] = useState<{ oldName: string; newName: string }[]>([]);
  const [selectedAdminNewUnit, setSelectedAdminNewUnit] = useState<string>('');
  const [selectedAdminOldUnit, setSelectedAdminOldUnit] = useState<string>('');
  
  // State for Map Lookup
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchResults, setMapSearchResults] = useState<MapRecord[]>([]);
  const [selectedMapNewUnit, setSelectedMapNewUnit] = useState<string>('');
  const [selectedMapOldUnit, setSelectedMapOldUnit] = useState<string>('');

  // --- DATA LOADING & PREPARATION ---
  const procedures = PROCEDURES_DATA;
  const mapData = MAP_DATA;

  const allLandPrices = useMemo(() => {
    const initialPrices: LandPrice[] = LAND_PRICES_DATA.map((price, index) => ({
        ...price,
        id: `initial-${index}`
    }));
    const priceMap = new Map<string, LandPrice>();
    initialPrices.forEach(p => priceMap.set(p.id!, p));
    customLandPrices.forEach(p => priceMap.set(p.id!, p));
    return Array.from(priceMap.values());
  }, [customLandPrices]);

  const adminUnitSearchData = useMemo(() => {
    const data: { oldName: string; newName: string }[] = [];
    for (const newName in QUANG_NINH_ADDRESS_MAPPING) {
        QUANG_NINH_ADDRESS_MAPPING[newName].forEach(oldName => {
            data.push({ oldName, newName });
        });
    }
    return data;
  }, []);

  // Initialize search results on first render
  useEffect(() => {
    setLandPriceSearchResults(allLandPrices);
    setMapSearchResults(mapData);
  }, [allLandPrices, mapData]);
  
  // Derive unique lists for filters (Admin Units) - Cascading Logic
  const uniqueAdminNewUnits = useMemo(() => {
    let data = adminUnitSearchData;
    if (selectedAdminOldUnit) {
        data = data.filter(item => item.oldName === selectedAdminOldUnit);
    }
    return Array.from(new Set(data.map(item => item.newName))).sort();
  }, [adminUnitSearchData, selectedAdminOldUnit]);

  const uniqueAdminOldUnits = useMemo(() => {
    let data = adminUnitSearchData;
    if (selectedAdminNewUnit) {
        data = data.filter(item => item.newName === selectedAdminNewUnit);
    }
    return Array.from(new Set(data.map(item => item.oldName))).sort();
  }, [adminUnitSearchData, selectedAdminNewUnit]);


  useEffect(() => {
    if (activeTab === 'adminUnits') {
        let results = adminUnitSearchData;

        // Filter by New Unit
        if (selectedAdminNewUnit) {
            results = results.filter(item => item.newName === selectedAdminNewUnit);
        }

        // Filter by Old Unit
        if (selectedAdminOldUnit) {
            results = results.filter(item => item.oldName === selectedAdminOldUnit);
        }

        // Filter by Text Search
        if (adminUnitSearch.trim()) {
            const searchLower = adminUnitSearch.toLowerCase().trim();
            results = results.filter(item => 
                item.oldName.toLowerCase().includes(searchLower) || 
                item.newName.toLowerCase().includes(searchLower)
            );
        }
        
        setAdminUnitResults(results);
    }
  }, [adminUnitSearch, activeTab, adminUnitSearchData, selectedAdminNewUnit, selectedAdminOldUnit]);

  
  // Derive unique lists for filters (Map Data) - Cascading Logic
  const uniqueNewUnits = useMemo(() => {
    let data = mapData;
    if (selectedMapOldUnit) {
        data = data.filter(item => item.oldUnit === selectedMapOldUnit);
    }
    return Array.from(new Set(data.map(item => item.newUnit))).sort();
  }, [mapData, selectedMapOldUnit]);

  const uniqueOldUnits = useMemo(() => {
    let data = mapData;
    if (selectedMapNewUnit) {
        data = data.filter(item => item.newUnit === selectedMapNewUnit);
    }
    return Array.from(new Set(data.map(item => item.oldUnit))).sort();
  }, [mapData, selectedMapNewUnit]);

  useEffect(() => {
      if (activeTab === 'mapLookup') {
          let results = mapData;

          // Filter by New Unit
          if (selectedMapNewUnit) {
              results = results.filter(item => item.newUnit === selectedMapNewUnit);
          }

          // Filter by Old Unit
          if (selectedMapOldUnit) {
              results = results.filter(item => item.oldUnit === selectedMapOldUnit);
          }

          // Filter by Text Search (Fuzzy)
          if (mapSearchQuery.trim()) {
              const normalizedQuery = mapSearchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
              const keywords = normalizedQuery.split(' ');
              
              results = results.filter(item => {
                  const itemText = `${item.newUnit} ${item.oldUnit} ${item.oldSheet} ${item.newSheet} ${item.notes || ''}`.toLowerCase();
                  return keywords.every(keyword => itemText.includes(keyword));
              });
          }
          
          setMapSearchResults(results);
      }
  }, [mapSearchQuery, mapData, activeTab, selectedMapNewUnit, selectedMapOldUnit]);

  // Derive unique lists for filters (Land Price) - Cascading Logic
  const uniquePriceCommunes = useMemo(() => {
      return Array.from(new Set(allLandPrices.map(item => item.commune).filter(Boolean) as string[])).sort();
  }, [allLandPrices]);

  const uniqueLandTypes = useMemo(() => {
    let filtered = allLandPrices;
    if (selectedPriceCommune) {
        filtered = filtered.filter(item => item.commune === selectedPriceCommune);
    }
    return Array.from(new Set(filtered.map(item => item.landType || '').filter(Boolean))).sort();
  }, [allLandPrices, selectedPriceCommune]);

  const uniquePriceStreets = useMemo(() => {
      let filtered = allLandPrices;
      if (selectedPriceCommune) {
          filtered = filtered.filter(item => item.commune === selectedPriceCommune);
      }
      if (selectedLandType) {
          filtered = filtered.filter(item => item.landType === selectedLandType);
      }
      return Array.from(new Set(filtered.map(item => item.streetName).filter(Boolean))).sort();
  }, [allLandPrices, selectedPriceCommune, selectedLandType]);

  const uniquePriceFactors = useMemo(() => {
      let filtered = allLandPrices;
       if (selectedPriceCommune) {
          filtered = filtered.filter(item => item.commune === selectedPriceCommune);
      }
      if (selectedLandType) {
          filtered = filtered.filter(item => item.landType === selectedLandType);
      }
       if (selectedPriceStreet) {
          filtered = filtered.filter(item => item.streetName === selectedPriceStreet);
      }
      const factors = filtered.map(item => item.adjustmentFactor).filter(f => f !== undefined && f !== null) as number[];
      return Array.from(new Set(factors)).sort((a, b) => a - b);
  }, [allLandPrices, selectedPriceCommune, selectedLandType, selectedPriceStreet]);

   useEffect(() => {
      if (activeTab === 'prices') {
          let results = allLandPrices;

          // Filter by Commune
          if (selectedPriceCommune) {
              results = results.filter(item => item.commune === selectedPriceCommune);
          }

          // Filter by Land Type
          if (selectedLandType) {
              results = results.filter(item => item.landType === selectedLandType);
          }

          // Filter by Street Name
          if (selectedPriceStreet) {
              results = results.filter(item => item.streetName === selectedPriceStreet);
          }

          // Filter by Factor
          if (selectedPriceFactor) {
              results = results.filter(item => item.adjustmentFactor?.toString() === selectedPriceFactor);
          }

          // Filter by Search Query (Section, Notes, etc.)
          if (landPriceSearchQuery.trim()) {
              const lowerCaseQuery = landPriceSearchQuery.toLowerCase();
              results = results.filter(
                (item) => 
                  item.streetName.toLowerCase().includes(lowerCaseQuery) || 
                  item.section.toLowerCase().includes(lowerCaseQuery) ||
                  item.commune?.toLowerCase().includes(lowerCaseQuery) ||
                  item.landType?.toLowerCase().includes(lowerCaseQuery) ||
                  item.notes?.toLowerCase().includes(lowerCaseQuery)
              );
          }
          
          setLandPriceSearchResults(results);
      }
  }, [landPriceSearchQuery, allLandPrices, activeTab, selectedPriceCommune, selectedLandType, selectedPriceStreet, selectedPriceFactor]);


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
      .filter(doc => {
        if (!parcelNumberSearch) return true;
        const searchLower = parcelNumberSearch.toLowerCase();
        return doc.data.landInfo?.some(l => l.parcelNumber?.toLowerCase().includes(searchLower));
      })
      .filter(doc => {
        if (!mapSheetNumberSearch) return true;
        const searchLower = mapSheetNumberSearch.toLowerCase();
        return doc.data.landInfo?.some(l => l.mapSheetNumber?.toLowerCase().includes(searchLower));
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [documents, citizenNameSearch, certNumberSearch, parcelNumberSearch, mapSheetNumberSearch]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa văn bản "${title}" không? Thao tác này không thể hoàn tác.`)) {
      deleteDocument(id);
    }
  };
  
  const handleDeleteOfficialDocument = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa văn bản trình ký "${title}" không?`)) {
      deleteOfficialDocument(id);
    }
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
                <th scope="col" className="px-4 py-2">Loại đất</th>
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
                  <td className="px-4 py-2">{item.landType}</td>
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
              <label className="block text-sm font-medium text-slate-500">Loại đất</label>
              <p className="mt-1 p-2 bg-slate-100 rounded-md text-slate-800">{editingPrice?.landType}</p>
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
  
  const renderOfficialDocViewer = () => {
    if (!viewingOfficialDoc) return null;
    const { directiveFiles, responseContent, title, directiveAnalysis } = viewingOfficialDoc;

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 truncate pr-4">{title}</h3>
                    <button onClick={() => setViewingOfficialDoc(null)} className="text-slate-500 hover:text-slate-800 text-3xl leading-none flex-shrink-0">&times;</button>
                </div>
                <div className="flex-grow overflow-auto grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50">
                    <div>
                        <h4 className="font-semibold text-center mb-2">Phân tích VB Chỉ đạo</h4>
                        <div className="w-full h-full min-h-[75vh] border rounded-md bg-white p-4 overflow-y-auto">
                            {directiveAnalysis ? (
                                <pre className="whitespace-pre-wrap text-slate-800 text-sm font-sans">{directiveAnalysis}</pre>
                            ) : (
                                <p className="text-slate-500 text-center">Không có bản phân tích nào được lưu cho văn bản này.</p>
                            )}
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <h5 className="font-semibold text-xs text-slate-600 uppercase mb-2">Tệp chỉ đạo gốc</h5>
                                <ul className="list-disc list-inside text-sm text-slate-700">
                                    {directiveFiles.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-center mb-2">Văn bản phản hồi</h4>
                        <div
                            dangerouslySetInnerHTML={{ __html: responseContent }}
                            className="w-full h-full min-h-[75vh] border rounded-md p-4 bg-white overflow-y-auto"
                            style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '12pt', lineHeight: 1.6 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  const TabButton: React.FC<{ tabId: DocumentManagerProps['activeTab'], label: string }> = ({ tabId, label }) => (
     <button
        onClick={() => onTabChange(tabId)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
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
      {viewingOfficialDoc && renderOfficialDocViewer()}
      
      {onBack && (
         <div className="-mb-4">
            <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Quay lại Văn bản đã Soạn thảo
            </button>
        </div>
      )}

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
          Module
        </button>
      </div>

       <div className="border-b border-slate-200 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 min-w-max" aria-label="Tabs">
            <TabButton tabId="procedures" label="Thủ tục Hành chính" />
            <TabButton tabId="mapLookup" label="Tra cứu Bản đồ 2 cấp" />
            <TabButton tabId="adminUnits" label="ĐV Hành chính" />
            <TabButton tabId="officialDocs" label="VB Trình ký" />
            <TabButton tabId="documents" label="Tra cứu Hồ sơ" />
            <TabButton tabId="prices" label="Giá đất" />
          </nav>
       </div>
      
       {activeTab === 'procedures' && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Tra cứu Thủ tục Hành chính (Luật Đất đai 2024)</h3>
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
            <div className="space-y-4">
                {filteredProcedures.map(proc => (
                    <div key={proc.id} className="border border-slate-200 rounded-md shadow-sm bg-white">
                        <button onClick={() => toggleProcedure(proc.id)} className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center rounded-t-md focus:outline-none">
                            <span className="font-semibold text-blue-800 text-lg">{proc.title}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-500 transition-transform ${activeProcedureId === proc.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {activeProcedureId === proc.id && (
                            <div className="p-6 bg-white text-sm border-t border-slate-200">
                                <div className="mb-6">
                                  <h4 className="text-base font-bold text-slate-800 mb-2 uppercase border-b pb-1">1. Thông tin chung</h4>
                                  <p className="text-slate-700 mb-2"><span className="font-semibold">Mô tả:</span> {proc.description}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <p><span className="font-semibold">Đối tượng thực hiện:</span> {proc.applicableTo}</p>
                                      <p><span className="font-semibold">Thời gian giải quyết:</span> <span className="text-red-600 font-bold">{proc.duration}</span></p>
                                  </div>
                                </div>

                                {proc.documents && proc.documents.length > 0 && (
                                  <div className="mb-6">
                                      <h4 className="text-base font-bold text-slate-800 mb-2 uppercase border-b pb-1">2. Thành phần hồ sơ</h4>
                                      <ul className="list-disc list-inside space-y-1 text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                                          {proc.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                                      </ul>
                                  </div>
                                )}

                                {proc.internalSteps && proc.internalSteps.length > 0 ? (
                                    <div className="mb-6">
                                        <h4 className="text-base font-bold text-slate-800 mb-2 uppercase border-b pb-1">3. Quy trình giải quyết nội bộ</h4>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm text-left text-slate-700 border border-slate-200 rounded-md">
                                                <thead className="text-xs text-slate-700 uppercase bg-blue-50 border-b border-slate-200">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3 border-r">Bước</th>
                                                        <th scope="col" className="px-4 py-3 border-r">Tên công việc / Trình tự</th>
                                                        <th scope="col" className="px-4 py-3 border-r">Đơn vị / Người thực hiện</th>
                                                        <th scope="col" className="px-4 py-3">Thời gian</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {proc.internalSteps.map((step, idx) => (
                                                        <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                                            <td className="px-4 py-3 border-r font-medium text-slate-900 whitespace-nowrap">{step.step}</td>
                                                            <td className="px-4 py-3 border-r">{step.task}</td>
                                                            <td className="px-4 py-3 border-r">{step.unit}</td>
                                                            <td className="px-4 py-3 font-semibold text-blue-700 whitespace-nowrap">{step.time}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                   <div className="mb-6">
                                      <h4 className="text-base font-bold text-slate-800 mb-2 uppercase border-b pb-1">3. Các bước thực hiện</h4>
                                      <ol className="list-decimal list-inside space-y-2 text-slate-700">
                                          {proc.steps.map((step, i) => <li key={i}>{step}</li>)}
                                      </ol>
                                  </div>
                                )}

                                {proc.legalBasis && proc.legalBasis.length > 0 && (
                                   <div>
                                      <h4 className="text-base font-bold text-slate-800 mb-2 uppercase border-b pb-1">4. Căn cứ pháp lý</h4>
                                      <div className="flex flex-wrap gap-2">
                                          {proc.legalBasis.map((law, i) => (
                                              <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                  {law}
                                              </span>
                                          ))}
                                      </div>
                                  </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {filteredProcedures.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-md border border-slate-200">
                         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mt-2 text-slate-500">Không tìm thấy thủ tục phù hợp với từ khóa.</p>
                    </div>
                )}
            </div>
          </div>
       )}
        
       {activeTab === 'adminUnits' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Tra cứu Đơn vị Hành chính mới (Tỉnh Quảng Ninh)</h3>
          <p className="text-slate-600 text-sm mb-4">Tra cứu thông tin quy đổi giữa đơn vị hành chính cũ và mới. Sử dụng bộ lọc hoặc nhập tên vào ô tìm kiếm.</p>
          <div className="flex flex-col space-y-4">
             <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="admin-new-unit-filter" className="block text-xs font-medium text-slate-700 mb-1">Lọc theo Đơn vị HC Mới:</label>
                    <select
                        id="admin-new-unit-filter"
                        value={selectedAdminNewUnit}
                        onChange={(e) => setSelectedAdminNewUnit(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">-- Tất cả --</option>
                        {uniqueAdminNewUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="admin-old-unit-filter" className="block text-xs font-medium text-slate-700 mb-1">Lọc theo Đơn vị HC Cũ:</label>
                    <select
                        id="admin-old-unit-filter"
                        value={selectedAdminOldUnit}
                        onChange={(e) => setSelectedAdminOldUnit(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">-- Tất cả --</option>
                        {uniqueAdminOldUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => {
                            setSelectedAdminNewUnit('');
                            setSelectedAdminOldUnit('');
                            setAdminUnitSearch('');
                        }}
                        className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors whitespace-nowrap"
                    >
                        Xóa lọc
                    </button>
                </div>
            </div>
            <input
              type="text"
              value={adminUnitSearch}
              onChange={(e) => setAdminUnitSearch(e.target.value)}
              placeholder="Nhập tên đơn vị hành chính cũ hoặc mới..."
              className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              aria-label="Tra cứu đơn vị hành chính"
            />
            <div className="w-full flex-grow bg-slate-50 border border-slate-200 rounded-md overflow-y-auto min-h-[220px]">
              {adminUnitResults.length > 0 ? (
                 <table className="w-full text-sm text-left text-slate-800">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                    <tr>
                      <th scope="col" className="px-4 py-2">Đơn vị cũ</th>
                      <th scope="col" className="px-4 py-2">Đơn vị mới</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUnitResults.map((item, index) => (
                      <tr key={index} className="bg-white border-b border-slate-200">
                        <td className="px-4 py-2">{item.oldName}</td>
                        <td className="px-4 py-2 font-semibold text-blue-800">{item.newName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (adminUnitSearch.trim() || selectedAdminNewUnit || selectedAdminOldUnit) ? (
                <p className="p-4 text-slate-500 text-center mt-4">Không tìm thấy kết quả phù hợp.</p>
              ) : (
                <p className="p-4 text-slate-400 text-center mt-4">Nhập thông tin để bắt đầu tra cứu.</p>
              )}
            </div>
          </div>
        </div>
      )}
      
       {activeTab === 'mapLookup' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Tra cứu Bản đồ 2 cấp</h3>
          <p className="text-slate-600 text-sm mb-4">Tìm kiếm nhanh thông tin quy đổi giữa bản đồ cũ và bản đồ mới. Sử dụng bộ lọc hoặc nhập từ khóa vào ô tìm kiếm.</p>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="new-unit-filter" className="block text-xs font-medium text-slate-700 mb-1">Lọc theo Đơn vị HC Mới:</label>
                    <select
                        id="new-unit-filter"
                        value={selectedMapNewUnit}
                        onChange={(e) => setSelectedMapNewUnit(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">-- Tất cả --</option>
                        {uniqueNewUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="old-unit-filter" className="block text-xs font-medium text-slate-700 mb-1">Lọc theo Đơn vị HC Cũ:</label>
                    <select
                        id="old-unit-filter"
                        value={selectedMapOldUnit}
                        onChange={(e) => setSelectedMapOldUnit(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">-- Tất cả --</option>
                        {uniqueOldUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => {
                            setSelectedMapNewUnit('');
                            setSelectedMapOldUnit('');
                            setMapSearchQuery('');
                        }}
                        className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors whitespace-nowrap"
                    >
                        Xóa lọc
                    </button>
                </div>
            </div>
            <input
              type="text"
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              placeholder="Nhập số tờ bản đồ, ghi chú (VD: dc 01)..."
              className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              aria-label="Tra cứu bản đồ"
            />
            <div className="w-full flex-grow bg-slate-50 border border-slate-200 rounded-md overflow-y-auto min-h-[300px]">
              {mapSearchResults.length > 0 ? (
                 <table className="w-full text-sm text-left text-slate-800">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                    <tr>
                      <th scope="col" className="px-4 py-2">Đơn vị HC Mới</th>
                      <th scope="col" className="px-4 py-2">Đơn vị HC Cũ</th>
                      <th scope="col" className="px-4 py-2 text-center">Tờ BĐ Cũ</th>
                      <th scope="col" className="px-4 py-2 text-center">Tờ BĐ Mới</th>
                      <th scope="col" className="px-4 py-2 text-center">Tỷ lệ</th>
                      <th scope="col" className="px-4 py-2">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mapSearchResults.map((item) => (
                      <tr key={item.id} className="bg-white border-b border-slate-200 hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-2 font-medium text-blue-800">{item.newUnit}</td>
                        <td className="px-4 py-2">{item.oldUnit}</td>
                        <td className="px-4 py-2 text-center font-semibold">{item.oldSheet}</td>
                        <td className="px-4 py-2 text-center font-semibold text-green-700">{item.newSheet}</td>
                        <td className="px-4 py-2 text-center text-slate-500">{item.scale}</td>
                         <td className="px-4 py-2 text-xs text-slate-500 italic">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (mapSearchQuery.trim() || selectedMapNewUnit || selectedMapOldUnit) ? (
                <p className="p-4 text-slate-500 text-center mt-4">Không tìm thấy kết quả phù hợp.</p>
              ) : (
                <p className="p-4 text-slate-400 text-center mt-4">Nhập thông tin để bắt đầu tra cứu.</p>
              )}
            </div>
          </div>
        </div>
      )}

       {activeTab === 'officialDocs' && (
         <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Văn bản Trình ký đã lưu</h3>
             {officialDocuments.length > 0 ? (
              <div className="space-y-3">
                {officialDocuments.map(doc => (
                  <div key={doc.id} className="border border-slate-200 rounded-md p-4 bg-slate-50 flex justify-between items-center gap-2">
                      <div className="flex-grow">
                          <p className="font-semibold text-slate-800">{doc.title}</p>
                          <p className="text-xs text-slate-500">Lưu lúc: {new Date(doc.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => setViewingOfficialDoc(doc)} className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">Xem</button>
                          <button onClick={() => handleDeleteOfficialDocument(doc.id, doc.title)} className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">Xóa</button>
                      </div>
                  </div>
                ))}
              </div>
             ) : (
                <p className="text-center text-slate-500 py-8">Chưa có văn bản trình ký nào được lưu.</p>
             )}
         </div>
       )}
      
       {activeTab === 'documents' && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Tra cứu Hồ sơ</h3>
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
               <input
                type="text"
                placeholder="Tra cứu theo Số thửa đất..."
                value={parcelNumberSearch}
                onChange={(e) => setParcelNumberSearch(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              />
               <input
                type="text"
                placeholder="Tra cứu theo Tờ bản đồ..."
                value={mapSheetNumberSearch}
                onChange={(e) => setMapSheetNumberSearch(e.target.value)}
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
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="price-commune-filter" className="block text-xs font-medium text-slate-700 mb-1">Đơn vị Hành chính (Xã/Phường):</label>
                    <select
                        id="price-commune-filter"
                        value={selectedPriceCommune}
                        onChange={(e) => setSelectedPriceCommune(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">-- Tất cả --</option>
                        {uniquePriceCommunes.map(commune => (
                            <option key={commune} value={commune}>{commune}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="price-land-type-filter" className="block text-xs font-medium text-slate-700 mb-1">Loại đất:</label>
                    <select
                        id="price-land-type-filter"
                        value={selectedLandType}
                        onChange={(e) => setSelectedLandType(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">-- Tất cả --</option>
                        {uniqueLandTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                 <div className="flex-1">
                    <label htmlFor="price-street-filter" className="block text-xs font-medium text-slate-700 mb-1">Tên đường/Khu vực:</label>
                    <select
                        id="price-street-filter"
                        value={selectedPriceStreet}
                        onChange={(e) => setSelectedPriceStreet(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">-- Tất cả --</option>
                         {uniquePriceStreets.map(street => (
                            <option key={street} value={street}>{street}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 max-w-[100px]">
                    <label htmlFor="price-factor-filter" className="block text-xs font-medium text-slate-700 mb-1">Hệ số ĐC:</label>
                    <select
                        id="price-factor-filter"
                        value={selectedPriceFactor}
                        onChange={(e) => setSelectedPriceFactor(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">-- Tất cả --</option>
                        {uniquePriceFactors.map(factor => (
                            <option key={factor} value={factor}>{factor}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => {
                            setSelectedPriceCommune('');
                            setSelectedLandType('');
                            setSelectedPriceStreet('');
                            setSelectedPriceFactor('');
                            setLandPriceSearchQuery('');
                        }}
                        className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors whitespace-nowrap"
                    >
                        Xóa lọc
                    </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={landPriceSearchQuery}
                    onChange={(e) => setLandPriceSearchQuery(e.target.value)}
                    placeholder="Nhập từ khóa tìm kiếm (đoạn đường, ghi chú...)..."
                    className="flex-grow p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                    aria-label="Nhập tên đường để tra cứu"
                />
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
                  {landPriceSearchResults.length > 0 ? (
                    <table className="w-full text-sm text-left text-slate-800">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                        <tr>
                          <th scope="col" className="px-4 py-2">Xã/Phường/Đặc khu</th>
                          <th scope="col" className="px-4 py-2">Loại đất</th>
                          <th scope="col" className="px-4 py-2">Mã/Tên đường</th>
                          <th scope="col" className="px-4 py-2">Đoạn đường</th>
                          <th scope="col" className="px-4 py-2 text-center">HSĐC</th>
                          <th scope="col" className="px-4 py-2 text-right">Đơn giá (đồng/m²)</th>
                          <th scope="col" className="px-4 py-2">Ghi chú</th>
                          <th scope="col" className="px-4 py-2 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landPriceSearchResults.map((item, index) => (
                          <tr key={item.id || index} className="bg-white border-b border-slate-200">
                            <td className="px-4 py-2 font-medium">{item.commune}</td>
                            <td className="px-4 py-2">{item.landType}</td>
                             <td className="px-4 py-2">{item.streetName}</td>
                            <td className="px-4 py-2">
                                {item.section}
                                {item.sectionCode && <span className="block text-xs text-slate-500">Mã đoạn: {item.sectionCode}</span>}
                            </td>
                            <td className="px-4 py-2 text-center">{item.adjustmentFactor}</td>
                            <td className="px-4 py-2 text-right font-semibold">{formatPrice(item.price)}</td>
                            <td className="px-4 py-2 text-xs italic">{item.notes}</td>
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
                  ) : (landPriceSearchQuery.trim() || selectedPriceCommune || selectedLandType || selectedPriceStreet || selectedPriceFactor) ? (
                    <p className="p-3 text-slate-500 text-center mt-4">Không tìm thấy kết quả phù hợp.</p>
                  ) : (
                     <p className="p-3 text-slate-400 text-center mt-4">Sử dụng bộ lọc hoặc nhập từ khóa để tìm kiếm.</p>
                  )}
                </div>
            </div>
          </div>
      )}
    </div>
  );
};
