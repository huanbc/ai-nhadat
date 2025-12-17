
import React, { useState, useMemo } from 'react';
import { LEGAL_DOCS_DATA } from '../data/legalDocsData';
import { LegalDocumentReference } from '../types';

export const ManagerLegalDocs: React.FC = () => {
  const [legalDocSearch, setLegalDocSearch] = useState('');
  const [selectedLegalType, setSelectedLegalType] = useState('');

  const filteredLegalDocs = useMemo(() => {
      return LEGAL_DOCS_DATA.filter(doc => {
          const matchSearch = legalDocSearch.toLowerCase().trim() === '' || 
                              doc.number.toLowerCase().includes(legalDocSearch.toLowerCase()) ||
                              doc.title.toLowerCase().includes(legalDocSearch.toLowerCase());
          const matchType = selectedLegalType === '' || doc.type === selectedLegalType;
          return matchSearch && matchType;
      });
  }, [legalDocSearch, selectedLegalType]);

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Tra cứu Văn bản pháp luật liên quan Bất động sản</h3>
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
                                            onClick={() => handleLegalDocDownload(doc)}
                                            className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 px-3 py-1 rounded border border-green-200 hover:bg-green-100 transition-colors"
                                            title="Tải về / Xem"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                            <span className="text-xs">Tải về</span>
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
  );
};
