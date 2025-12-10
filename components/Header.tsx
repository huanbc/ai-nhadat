import React, { useState, useRef, useEffect } from 'react';
import { createBackup, restoreBackup } from '../utils/backupUtils';
import { ActiveModule } from '../App';

interface HeaderProps {
  onGoHome: () => void;
  onSwitchModule: (module: ActiveModule) => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome, onSwitchModule }) => {
  const [showIntro, setShowIntro] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (introRef.current && !introRef.current.contains(event.target as Node)) {
        setShowIntro(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBackup = () => {
      if(confirm("Bạn có muốn tải xuống file sao lưu toàn bộ dữ liệu không?")) {
          createBackup();
      }
  };

  const handleRestoreClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          if(confirm("CẢNH BÁO: Việc khôi phục sẽ ghi đè dữ liệu hiện tại bằng dữ liệu trong file sao lưu. Bạn có chắc chắn muốn tiếp tục?")) {
              restoreBackup(file, () => {
                  // Callback after success (reload happens in utils)
              });
          }
          // Reset input
          event.target.value = '';
      }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoHome}>
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600">
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
              <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm14.055 3.596a.75.75 0 0 1 .9 1.06l-4.5 4.25a.75.75 0 0 1-1.01.044l-2.25-2a.75.75 0 0 1 .97-1.144l1.71 1.522 4.13-3.886a.75.75 0 0 1 1.06-.1Z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 hidden sm:block">AI Trợ lý Nhà đất</h1>
          <h1 className="text-xl font-bold text-slate-900 sm:hidden">AI Nhà đất</h1>
        </div>
        
        {/* Hidden Input for Restore */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".json" 
        />

        <div className="flex items-center space-x-2 relative" ref={introRef}>
            <button 
                onClick={handleBackup} 
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors" 
                title="Sao lưu dữ liệu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </button>
            <button 
                onClick={handleRestoreClick} 
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors" 
                title="Khôi phục dữ liệu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
            </button>

            <div className="h-6 w-px bg-slate-300 mx-1"></div>

            <button onClick={onGoHome} className="text-sm font-medium px-3 py-2 text-slate-700 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors">
                Trang chủ
            </button>
            <button 
              onClick={() => setShowIntro(!showIntro)} 
              className="text-sm font-medium px-3 py-2 text-slate-700 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              Giới thiệu
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform ${showIntro ? 'rotate-180' : ''}`}>
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
             {showIntro && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-slate-200 z-10 p-4">
                <p className="font-semibold text-slate-800">Thông tin Tác giả</p>
                <p className="text-sm text-slate-600 mt-2">
                  Ứng dụng được phát triển bởi <strong>Lê Minh Huấn</strong>.
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Mọi chi tiết xin liên hệ: <strong className="text-slate-800">0912041201</strong>
                </p>
                 <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-200">
                  Powered by Google Gemini.
                </p>
              </div>
            )}
        </div>
      </div>
    </header>
  );
};