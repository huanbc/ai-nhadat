
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useDocumentStore } from '../hooks/useDocumentStore';
import { useLandPriceStore } from '../hooks/useLandPriceStore';
import { StoredDocument, Procedure, UploadedFile, LandPrice, StoredOfficialDocument, MapRecord, LegalDocumentReference } from '../types';
import { extractPriceDataFromDocument } from '../services/geminiService';
import { useOfficialDocumentStore } from '../hooks/useOfficialDocumentStore';
import { QUANG_NINH_ADDRESS_MAPPING } from '../utils/addressNormalizer';
import { PROCEDURES_DATA } from '../data/proceduresData';
import { LAND_PRICES_DATA } from '../data/landPricesData';
import { BANDO2CAP_DATA } from '../data/bando2cap';
import { LEGAL_DOCS_DATA } from '../data/legalDocsData';


interface DocumentManagerProps {
  onEdit: (doc: StoredDocument) => void;
  onGoHome: () => void;
  activeTab: 'documents' | 'procedures' | 'prices' | 'officialDocs' | 'adminUnits' | 'mapLookup' | 'legalRef';
  onTabChange: (tab: 'documents' | 'procedures' | 'prices' | 'officialDocs' | 'adminUnits' | 'mapLookup' | 'legalRef') => void;
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

  // State for Legal Docs
  const [legalDocSearch, setLegalDocSearch] = useState('');
  const [selectedLegalType, setSelectedLegalType] = useState('');
  const [viewingLegalDoc, setViewingLegalDoc] = useState<LegalDocumentReference | null>(null);

  // --- DATA LOADING & PREPARATION ---
  const procedures = PROCEDURES_DATA;
  const mapData = BANDO2CAP_DATA;
  const legalDocsData = LEGAL_DOCS_DATA;

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

  const getFilteredLandPricesForDropdowns = useCallback(() => {
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
      return filtered;
  }, [allLandPrices, selectedPriceCommune, selectedLandType, selectedPriceStreet]);


  const uniqueLandTypes = useMemo(() => {
    let filtered = allLandPrices;
    if (selectedPriceCommune) {
        filtered = filtered.filter(item => item.commune === selectedPriceCommune);
    }
    return Array.from(new Set(filtered.map(item => item.landType || '').filter(Boolean))).sort();
  }, [allLandPrices, selectedPriceCommune]);

  const uniquePriceStreets = useMemo(() => {
      const filtered = getFilteredLandPricesForDropdowns();
      return Array.from(new Set(filtered.map(item => item.streetName).filter(Boolean))).sort();
  }, [getFilteredLandPricesForDropdowns]);

  const uniquePriceFactors = useMemo(() => {
      const filtered = getFilteredLandPricesForDropdowns();
      const factors = filtered.map(item => item.adjustmentFactor).filter(f => f !== undefined && f !== null) as number[];
      return Array.from(new Set(factors)).sort((a, b) => a - b);
  }, [getFilteredLandPricesForDropdowns]);

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

  // Cascading Filter Resets for Land Prices
  // This useEffect will reset all dependent filters whenever the 'prices' tab becomes active
  // or when the selected commune changes.
  useEffect(() => {
      if (activeTab === 'prices') {
          setSelectedPriceCommune('');
          setSelectedLandType('');
          setSelectedPriceStreet('');
          setSelectedPriceFactor('');
          setLandPriceSearchQuery('');
      }
  }, [activeTab]);

  useEffect(() => {
      if (selectedPriceCommune) {
          setSelectedLandType('');
          setSelectedPriceStreet('');
          setSelectedPriceFactor('');
      }
  }, [selectedPriceCommune]);

  useEffect(() => {
      if (selectedLandType) {
          setSelectedPriceStreet('');
          setSelectedPriceFactor('');
      }
  }, [selectedLandType]);

  useEffect(() => {
      if (selectedPriceStreet) {
          setSelectedPriceFactor('');
      }
  }, [selectedPriceStreet]);


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

  const filteredLegalDocs = useMemo(() => {
      return legalDocsData.filter(doc => {
          const matchSearch = legalDocSearch.toLowerCase().trim() === '' || 
                              doc.number.toLowerCase().includes(legalDocSearch.toLowerCase()) ||
                              doc.title.toLowerCase().includes(legalDocSearch.toLowerCase());
          const matchType = selectedLegalType === '' || doc.type === selectedLegalType;
          return matchSearch && matchType;
      });
  }, [legalDocsData, legalDocSearch, selectedLegalType]);

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
  
  const handleLegalDocDownload = (doc: LegalDocumentReference) => {
      if (doc.link && doc.link.toLowerCase().endsWith('.pdf')) {
          const link = document.createElement('a');
          link.href = doc.link;
          link.target = "_blank";
          link.download = doc.number.replace(/\//g, '-') + '.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else {
          alert('Không tìm thấy link tải xuống trực tiếp cho văn bản này. Đang mở trang nguồn...');
          window.open(doc.link || 'https://vanban.chinhphu.vn', '_blank');
      }
  }

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

  const renderLegalDocViewer = () => {
      if (!viewingLegalDoc) return null;
      
      const isPdf = viewingLegalDoc.link && viewingLegalDoc.link.toLowerCase().endsWith('.pdf');
      
      return (
          <div className="fixed inset-0 z-[100] bg-slate-900 bg-opacity-95 flex flex-col h-screen" aria-modal="true" role="dialog">
              <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 flex-shrink-0">
                  <div className="flex-grow pr-4">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{viewingLegalDoc.title}</h3>
                      <p className="text-sm text-slate-500">{viewingLegalDoc.number} | {viewingLegalDoc.date}</p>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                      <a 
                          href={viewingLegalDoc.link} 
                          target="_blank"
                          download={isPdf}
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 flex items-center gap-2 transition-colors"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Tải về / Mở ngoài
                      </a>
                      <button onClick={() => setViewingLegalDoc(null)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>
              </div>
              
              <div className="flex-grow bg-gray-200 relative overflow-hidden">
                  {viewingLegalDoc.link ? (
                      <iframe 
                          src={viewingLegalDoc.link} 
                          title="Nội dung văn bản"
                          className="w-full h-full border-none"
                      >
                          <p className="p-8 text-center">Trình duyệt của bạn không hỗ trợ xem trước PDF. <a href={viewingLegalDoc.link} target="_blank" className="text-blue-600 underline">Nhấn vào đây để tải về.</a></p>
                      </iframe>
                  ) : (
                      <div className="max-w-5xl mx-auto bg-white shadow-lg min-h-screen p-8 md:p-12 overflow-y-auto h-full">
                          <div className="mb-8 border-b border-slate-100 pb-6">
                              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                  <div className="bg-slate-50 px-3 py-1 rounded border border-slate-200">
                                      <span className="font-semibold">Loại văn bản:</span> {viewingLegalDoc.type}
                                  </div>
                                  <div className="bg-slate-50 px-3 py-1 rounded border border-slate-200">
                                      <span className="font-semibold">Cơ quan ban hành:</span> {viewingLegalDoc.agency}
                                  </div>
                                  <div className="bg-slate-50 px-3 py-1 rounded border border-slate-200">
                                      <span className="font-semibold">Ngày hiệu lực:</span> {viewingLegalDoc.effectiveDate}
                                  </div>
                              </div>
                              <div className="mt-4">
                                  <h4 className="font-bold text-slate-800 mb-1">Mô tả:</h4>
                                  <p className="text-slate-700 italic">{viewingLegalDoc.description}</p>
                              </div>
                          </div>
                          
                          <div>
                              <h4 className="font-bold text-slate-900 text-lg mb-4 uppercase text-center border-b pb-2">Nội dung văn bản</h4>
                              <div className="prose prose-slate max-w-none font-serif text-lg leading-relaxed text-justify text-slate-800 whitespace-pre-wrap">
                                  {viewingLegalDoc.content}
                              </div>
                          </div>
                      </div>
                  )}
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
      {viewingLegalDoc && renderLegalDocViewer()}
      
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
            <TabButton tabId="legalRef" label="Văn bản Pháp luật" />
            <TabButton tabId="mapLookup" label="Bản đồ 2 cấp" />
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

       {activeTab === 'legalRef' && (
           <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
               <h3 className="text-xl font-semibold text-slate-900 mb-4">Tra cứu Văn bản Pháp luật (Cập nhật 2024)</h3>
               <p className="text-slate-600 text-sm mb-4">
                   Tra cứu nhanh các Luật, Nghị định, Thông tư mới nhất về đất đai, nhà ở, kinh doanh bất động sản.
               </p>
               
               <div className="flex flex-col md:flex-row gap-4 mb-6">
                   <div className="flex-1">
                       <input
                           type="text"
                           value={legalDocSearch}
                           onChange={(e) => setLegalDocSearch(e.target.value)}
                           placeholder="Nhập số hiệu, tên văn bản..."
                           className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                       />
                   </div>
                   <div className="w-full md:w-48">
                       <select
                           value={selectedLegalType}
                           onChange={(e) => setSelectedLegalType(e.target.value)}
                           className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                       >
                           <option value="">-- Tất cả loại --</option>
                           <option value="Luật">Luật</option>
                           <option value="Nghị định">Nghị định</option>
                           <option value="Thông tư">Thông tư</option>
                       </select>
                   </div>
               </div>

               <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-md">
                       <thead className="bg-slate-50">
                           <tr>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Số hiệu</th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Loại</th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trích yếu</th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ngày ban hành</th>
                               <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Thao tác</th>
                           </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-slate-200">
                           {filteredLegalDocs.length > 0 ? (
                               filteredLegalDocs.map((doc) => (
                                   <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{doc.number}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                               doc.type === 'Luật' ? 'bg-red-100 text-red-800' :
                                               doc.type === 'Nghị định' ? 'bg-yellow-100 text-yellow-800' :
                                               'bg-green-100 text-green-800'
                                           }`}>
                                               {doc.type}
                                           </span>
                                       </td>
                                       <td className="px-6 py-4 text-sm text-slate-700 line-clamp-2 max-w-md" title={doc.title}>{doc.title}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.date}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                           <div className="flex justify-center space-x-3">
                                               <button 
                                                   onClick={() => setViewingLegalDoc(doc)}
                                                   className="text-blue-600 hover:text-blue-900"
                                                   title="Xem nhanh"
                                               >
                                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                   </svg>
                                               </button>
                                               <button 
                                                   onClick={() => handleLegalDocDownload(doc)}
                                                   className="text-green-600 hover:text-green-900"
                                                   title="Tải về (Tóm tắt)"
                                               >
                                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                       <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                   </svg>
                                               </button>
                                           </div>
                                       </td>
                                   </tr>
                               ))
                           ) : (
                               <tr>
                                   <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                       Không tìm thấy văn bản phù hợp.
                                   </td>
                               </tr>
                           )}
                       </tbody>
                   </table>
               </div>
           </div>
       )}
    </div>
  );
};
