
import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onStartNew: () => void;
  onManageDocuments: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartNew, onManageDocuments }) => {
  const [showIntro, setShowIntro] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);

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


  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600">
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
              <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm14.055 3.596a.75.75 0 0 1 .9 1.06l-4.5 4.25a.75.75 0 0 1-1.01.044l-2.25-2a.75.75 0 0 1 .97-1.144l1.71 1.522 4.13-3.886a.75.75 0 0 1 1.06-.1Z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">AI Trợ lý Nhà đất</h1>
        </div>
        <div className="flex items-center space-x-2 relative" ref={introRef}>
            <button onClick={onStartNew} className="text-sm font-medium px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors">
                Trang chủ
            </button>
            <button onClick={onManageDocuments} className="text-sm font-medium px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors">
                Tra cứu
            </button>
            <button 
              onClick={() => setShowIntro(!showIntro)} 
              className="text-sm font-medium px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1"
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
