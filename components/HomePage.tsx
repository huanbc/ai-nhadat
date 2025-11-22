
import React, { useRef } from 'react';
import { restoreBackup } from '../utils/backupUtils';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRestoreClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          if(confirm("Bạn có chắc chắn muốn khôi phục dữ liệu từ file này? Dữ liệu hiện tại sẽ bị ghi đè.")) {
              restoreBackup(file, () => {
                  // On success, page reloads automatically in utils
              });
          }
          event.target.value = '';
      }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                    AI Trợ lý Nhà đất
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                    Ứng dụng giúp soạn thảo văn bản và hợp đồng nhà đất một cách nhanh chóng. Tự động trích xuất thông tin từ các tài liệu như CCCD, Giấy chứng nhận quyền sử dụng đất và điền vào mẫu có sẵn, sau đó cho phép người dùng xem lại, chỉnh sửa và sao chép nội dung hoàn chỉnh.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={onStart}
                        className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                    >
                        Truy cập Ứng dụng
                    </button>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".json" 
                    />
                    
                    <button
                        onClick={handleRestoreClick}
                        className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        Khôi phục Dữ liệu
                    </button>
                </div>
            </div>
        </main>
        <footer className="text-center py-4 text-slate-500 text-sm">
            <p>Lưu ý: Luôn kiểm tra kỹ thông tin do AI trích xuất. Ứng dụng này chỉ mang tính chất tham khảo.</p>
            <p>&copy; 2024. Phát triển bởi Lê Minh Huấn - 0912041201. Powered by Gemini.</p>
        </footer>
    </div>
  );
};
