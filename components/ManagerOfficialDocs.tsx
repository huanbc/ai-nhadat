
import React, { useState } from 'react';
import { useOfficialDocumentStore } from '../hooks/useOfficialDocumentStore';
import { StoredOfficialDocument } from '../types';

export const ManagerOfficialDocs: React.FC = () => {
  const { officialDocuments, deleteOfficialDocument } = useOfficialDocumentStore();
  const [viewingOfficialDoc, setViewingOfficialDoc] = useState<StoredOfficialDocument | null>(null);

  const handleDeleteOfficialDocument = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa văn bản trình ký "${title}" không?`)) {
      deleteOfficialDocument(id);
    }
  };

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

  return (
    <>
    {renderOfficialDocViewer()}
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
    </>
  );
};
