
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLandPriceStore } from '../hooks/useLandPriceStore';
import { LAND_PRICES_DATA } from '../data/landPricesData';
import { LandPrice, UploadedFile } from '../types';
import { extractPriceDataFromDocument } from '../services/geminiService';

export const ManagerLandPrices: React.FC = () => {
  const { customLandPrices, addCustomLandPrices, upsertCustomLandPrice } = useLandPriceStore();

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

  useEffect(() => {
    setLandPriceSearchResults(allLandPrices);
  }, [allLandPrices]);

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
  }, [landPriceSearchQuery, allLandPrices, selectedPriceCommune, selectedLandType, selectedPriceStreet, selectedPriceFactor]);

  // Reset dependent filters
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
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

  return (
    <>
    {isPricePreviewOpen && previewPrices && renderPricePreviewPopup()}
    {isEditPricePopupOpen && editingPrice && renderEditPricePopup()}
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
    </>
  );
};
