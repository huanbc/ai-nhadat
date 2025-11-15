import React from 'react';
import { SubTemplateKey } from '../types';

interface SubTemplateSelectorProps {
  onSelect: (key: SubTemplateKey) => void;
  onBack: () => void;
  templateTitle: string;
}

const subTemplates = [
  {
    key: 'vpcc' as SubTemplateKey,
    title: 'Mẫu Văn phòng Công chứng (VPCC)',
    description: 'Mẫu đầy đủ, chi tiết và chặt chẽ về pháp lý, thường được sử dụng tại các tổ chức hành nghề công chứng.',
    icon: 'M13.5 10.5V21H3V10.5L8.25 6l5.25 4.5ZM8.25 3v1.518l-4.025 3.45L1.5 6.75 8.25 1.5l6.75 5.25-2.725 2.218V3H8.25Z'
  },
  {
    key: 'ubnd' as SubTemplateKey,
    title: 'Mẫu UBND',
    description: 'Mẫu chuẩn, đơn giản hơn, phù hợp để sử dụng khi làm thủ tục tại Ủy ban Nhân dân cấp xã/phường.',
    icon: 'm12.75 21 6.1-6.104M12.75 21V3M4.5 9.452l4.819 4.13m3.431-4.13L18.75 3'
  },
  {
    key: 'simplified' as SubTemplateKey,
    title: 'Mẫu Rút gọn',
    description: 'Mẫu cơ bản nhất, chỉ chứa các điều khoản cốt lõi, phù hợp cho các giao dịch đơn giản, nhanh chóng.',
    icon: 'M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.5A1.125 1.125 0 0 1 5.25 6.375H10.5'
  },
];

export const SubTemplateSelector: React.FC<SubTemplateSelectorProps> = ({ onSelect, onBack, templateTitle }) => {
  return (
    <div className="max-w-4xl mx-auto">
       <div className="text-left mb-8">
            <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Quay lại
            </button>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Chọn Kiểu Mẫu Văn bản</h2>
            <p className="mt-2 text-lg text-slate-600">
                Bạn đang soạn thảo: <span className="font-semibold text-blue-700">{templateTitle}</span>.
            </p>
            <p className="mt-1 text-slate-600">Vui lòng chọn một kiểu mẫu phù hợp với nhu cầu của bạn.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subTemplates.map(st => (
                 <div key={st.key} onClick={() => onSelect(st.key)} className="group cursor-pointer bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
                     <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d={st.icon} />
                        </svg>
                     </div>
                     <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-800">{st.title}</h3>
                     <p className="mt-2 text-sm text-slate-600">{st.description}</p>
                 </div>
            ))}
        </div>
    </div>
  );
};
