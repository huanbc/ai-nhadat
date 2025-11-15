import React from 'react';

interface HeaderProps {
  onStartNew: () => void;
  onManageDocuments: () => void;
  showBackButton: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onStartNew, onManageDocuments, showBackButton }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600">
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
              <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm14.055 3.596a.75.75 0 0 1 .9 1.06l-4.5 4.25a.75.75 0 0 1-1.01.044l-2.25-2a.75.75 0 0 1 .97-1.144l1.71 1.522 4.13-3.886a.75.75 0 0 1 1.06-.1Z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Trợ lý Soạn thảo Hợp đồng Nhà đất AI</h1>
        </div>
        <div className="flex items-center space-x-4">
            {showBackButton && (
                <button onClick={onStartNew} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    Làm lại từ đầu
                </button>
            )}
            <button onClick={onManageDocuments} className="text-sm font-medium px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors">
                Tra cứu
            </button>
        </div>
      </div>
    </header>
  );
};
