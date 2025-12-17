
import React, { useState, useMemo } from 'react';
import { LEGAL_DOCS_DATA } from '../data/legalDocsData';
import { LegalDocumentReference } from '../types';

export const ManagerLegalDocs: React.FC = () => {
  const [legalDocSearch, setLegalDocSearch] = useState('');
  const [selectedLegalType, setSelectedLegalType] = useState('');
  const [viewingLegalDoc, setViewingLegalDoc] = useState<LegalDocumentReference | null>(null);

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
                                  {viewingLegalDoc.content || "Nội dung văn bản đang cập nhật..."}
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <>
    {renderLegalDocViewer()}
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
    </>
  );
};
