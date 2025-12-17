
import React, { useState, useMemo, useEffect } from 'react';
import { QUANG_NINH_ADDRESS_MAPPING } from '../utils/addressNormalizer';

export const ManagerAdminUnits: React.FC = () => {
  const [adminUnitSearch, setAdminUnitSearch] = useState('');
  const [adminUnitResults, setAdminUnitResults] = useState<{ oldName: string; newName: string }[]>([]);
  const [selectedAdminNewUnit, setSelectedAdminNewUnit] = useState<string>('');
  const [selectedAdminOldUnit, setSelectedAdminOldUnit] = useState<string>('');

  const adminUnitSearchData = useMemo(() => {
    const data: { oldName: string; newName: string }[] = [];
    for (const newName in QUANG_NINH_ADDRESS_MAPPING) {
        QUANG_NINH_ADDRESS_MAPPING[newName].forEach(oldName => {
            data.push({ oldName, newName });
        });
    }
    return data;
  }, []);

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
    let results = adminUnitSearchData;

    if (selectedAdminNewUnit) {
        results = results.filter(item => item.newName === selectedAdminNewUnit);
    }

    if (selectedAdminOldUnit) {
        results = results.filter(item => item.oldName === selectedAdminOldUnit);
    }

    if (adminUnitSearch.trim()) {
        const searchLower = adminUnitSearch.toLowerCase().trim();
        results = results.filter(item => 
            item.oldName.toLowerCase().includes(searchLower) || 
            item.newName.toLowerCase().includes(searchLower)
        );
    }
    
    setAdminUnitResults(results);
  }, [adminUnitSearch, adminUnitSearchData, selectedAdminNewUnit, selectedAdminOldUnit]);

  return (
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
  );
};
