
import React, { useState, useMemo, useEffect } from 'react';
import { BANDO2CAP_DATA } from '../data/bando2cap';
import { MapRecord } from '../types';

export const ManagerMap: React.FC = () => {
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchResults, setMapSearchResults] = useState<MapRecord[]>([]);
  const [selectedMapNewUnit, setSelectedMapNewUnit] = useState<string>('');
  const [selectedMapOldUnit, setSelectedMapOldUnit] = useState<string>('');

  const mapData = BANDO2CAP_DATA;

  useEffect(() => {
    setMapSearchResults(mapData);
  }, [mapData]);

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
  }, [mapSearchQuery, mapData, selectedMapNewUnit, selectedMapOldUnit]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Bản đồ 2 cấp</h3>
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
  );
};
