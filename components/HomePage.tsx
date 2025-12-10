import React from 'react';
import { ActiveModule } from '../App';

interface HomePageProps {
  onSelectModule: (module: ActiveModule) => void;
  showResumePrompt?: React.ReactNode;
}

const modules = [
    {
        id: 'consultation' as ActiveModule,
        title: 'Tham vấn & Phân tích AI',
        description: 'Hỏi đáp pháp lý, thẩm định hồ sơ, soạn công văn theo Luật Đất đai 2024.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
        ),
    },
    {
        id: 'drafting' as ActiveModule,
        title: 'Soạn thảo Văn bản Tự động',
        description: 'Chọn loại văn bản, tải lên giấy tờ, và để AI tự động điền thông tin vào mẫu cho bạn.',
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
        )
    },
    {
        id: 'lookup' as ActiveModule,
        title: 'Tra cứu & Quản lý Thông tin',
        description: 'Tra cứu giá đất, thủ tục hành chính, bản đồ, và quản lý các tài liệu đã lưu.',
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
             </svg>
        )
    }
]

export const HomePage: React.FC<HomePageProps> = ({ onSelectModule, showResumePrompt }) => {

  return (
    <div className="max-w-7xl mx-auto">
      {showResumePrompt}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          AI Trợ lý Nhà đất
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Chọn một chức năng để bắt đầu.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {modules.map(module => (
            <div 
                key={module.id} 
                onClick={() => onSelectModule(module.id)} 
                className="group cursor-pointer bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center text-center"
            >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
                    {module.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-800">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-600 flex-grow">{module.description}</p>
                 <span className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-800">Bắt đầu &rarr;</span>
            </div>
        ))}
      </div>
    </div>
  );
};
