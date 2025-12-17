
import React, { useState, useMemo } from 'react';
import { PROCEDURES_DATA } from '../data/proceduresData';
import { Procedure } from '../types';

type AuthorityLevel = 'all' | 'cấp tỉnh' | 'cấp xã';

export const ManagerProcedures: React.FC = () => {
  const [procedureSearchQuery, setProcedureSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [activeProcedureId, setActiveProcedureId] = useState<string | null>(null);
  const [selectedAuthority, setSelectedAuthority] = useState<AuthorityLevel>('all');

  const procedures = PROCEDURES_DATA;

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

  const toggleProcedure = (id: string) => {
    setActiveProcedureId(prevId => prevId === id ? null : id);
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

  return (
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
  );
};
