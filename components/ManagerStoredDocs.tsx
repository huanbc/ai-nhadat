
import React, { useState, useMemo } from 'react';
import { useDocumentStore } from '../hooks/useDocumentStore';
import { StoredDocument } from '../types';

interface ManagerStoredDocsProps {
    onEdit: (doc: StoredDocument) => void;
}

export const ManagerStoredDocs: React.FC<ManagerStoredDocsProps> = ({ onEdit }) => {
  const { documents, deleteDocument } = useDocumentStore();
  
  const [citizenNameSearch, setCitizenNameSearch] = useState('');
  const [certNumberSearch, setCertNumberSearch] = useState('');
  const [parcelNumberSearch, setParcelNumberSearch] = useState('');
  const [mapSheetNumberSearch, setMapSheetNumberSearch] = useState('');

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

  return (
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
  );
};
