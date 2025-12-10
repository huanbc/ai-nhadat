import React, { useState, useRef, useEffect } from 'react';
import { restoreBackup } from '../utils/backupUtils';
import { ActiveModule } from '../App';

interface HeaderProps {
  onGoHome: () => void;
  onSwitchModule: (module: ActiveModule) => void;
}

const BackupPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [backupJson, setBackupJson] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const STORAGE_KEYS = {
        DOCUMENTS: 'AI_CONTRACT_DRAFTER_DOCUMENTS',
        ANALYZED_DOCS: 'AI_ANALYZED_DOCUMENTS',
        LAND_PRICES: 'AI_CONTRACT_DRAFTER_CUSTOM_LAND_PRICES',
        LEGAL_LIBRARY: 'AI_LEGAL_DOCUMENTS_LIBRARY',
        OFFICIAL_DOCS: 'AI_OFFICIAL_DOCUMENTS',
        DRAFT_PROGRESS: 'documentDraftProgress'
    };

    const handleGenerateData = () => {
        setIsGenerating(true);
        setBackupJson('');
        setCopySuccess(false);
        try {
            const backupData: Record<string, any> = {
                version: 1,
                timestamp: new Date().toISOString(),
                data: {}
            };

            let hasData = false;

            Object.values(STORAGE_KEYS).forEach(key => {
                const rawData = localStorage.getItem(key);
                if (rawData) {
                    hasData = true;
                    try {
                        backupData.data[key] = JSON.parse(rawData);
                    } catch (e) {
                        backupData.data[key] = rawData; // Store as raw string if not valid JSON
                    }
                }
            });

            if (!hasData) {
                setBackupJson("Không có dữ liệu nào để sao lưu.");
                return;
            }

            const jsonString = JSON.stringify(backupData, null, 2);
            setBackupJson(jsonString);

        } catch (error) {
            console.error("Lỗi khi tạo dữ liệu sao lưu:", error);
            setBackupJson(`Lỗi: Không thể tạo dữ liệu sao lưu. ${error instanceof Error ? error.message : ''}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (textareaRef.current && backupJson) {
            navigator.clipboard.writeText(backupJson).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-xl font-semibold text-slate-900">Hướng dẫn Sao lưu Dữ liệu</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
                </div>
                
                <div className="text-sm text-slate-700 space-y-3 mb-4 flex-shrink-0">
                   <p>Do chính sách bảo mật của trình duyệt, tính năng tải file tự động có thể không hoạt động. Vui lòng làm theo các bước sau để sao lưu thủ công:</p>
                   <ol className="list-decimal list-inside space-y-1 pl-2">
                       <li>Nhấn vào nút <span className="font-semibold text-blue-600">"Tạo dữ liệu sao lưu"</span> bên dưới.</li>
                       <li>Toàn bộ dữ liệu của bạn sẽ được hiển thị trong ô văn bản.</li>
                       <li>Nhấn nút <span className="font-semibold text-green-600">"Sao chép tất cả"</span> để sao chép nội dung.</li>
                       <li>Mở một trình soạn thảo văn bản (như Notepad, Ghi chú) trên máy tính của bạn, dán nội dung vào và lưu lại với tên file là <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-xs">backup.json</code>.</li>
                   </ol>
                </div>

                <div className="flex-grow flex flex-col min-h-0">
                    <div className="flex items-center gap-4 mb-2 flex-shrink-0">
                        <button 
                            onClick={handleGenerateData} 
                            disabled={isGenerating}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-400"
                        >
                            {isGenerating ? 'Đang tạo...' : 'Tạo dữ liệu sao lưu'}
                        </button>
                         {backupJson && (
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                            >
                                {copySuccess ? 'Đã sao chép!' : 'Sao chép tất cả'}
                            </button>
                        )}
                    </div>
                    <textarea
                        ref={textareaRef}
                        readOnly
                        value={backupJson}
                        placeholder="Dữ liệu sao lưu sẽ xuất hiện ở đây sau khi bạn nhấn nút 'Tạo dữ liệu sao lưu'."
                        className="w-full flex-grow p-3 border border-slate-300 rounded-md font-mono text-xs shadow-inner bg-slate-50 resize-none"
                    />
                </div>

                <div className="mt-6 text-right flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ onGoHome, onSwitchModule }) => {
  const [showIntro, setShowIntro] = useState(false);
  const [isBackupPopupOpen, setIsBackupPopupOpen] = useState(false);
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
      setIsBackupPopupOpen(true);
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
    <>
      {isBackupPopupOpen && <BackupPopup onClose={() => setIsBackupPopupOpen(false)} />}
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
    </>
  );
};
