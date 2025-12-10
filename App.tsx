import React, { useState, useCallback, useEffect } from 'react';
import { DocumentTemplate, ExtractedData, UploadedFiles, Step, StoredDocument, SubTemplateKey, UploadedFile, Procedure, LandPrice } from './types';
import { DOCUMENT_TEMPLATES } from './constants';
import { extractDataForStage } from './services/geminiService';
import { normalizeAllAddressesInExtractedData } from './utils/addressNormalizer';
import { useDocumentStore } from './hooks/useDocumentStore';

import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { DraftingModule } from './components/DraftingModule';
import { ConsultationModule } from './components/ConsultationModule';
import { LookupModule } from './components/LookupModule';


const SAVE_KEY = 'documentDraftProgress';

export type ActiveModule = 'home' | 'drafting' | 'consultation' | 'lookup';


const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [currentStep, setCurrentStep] = useState<Step>(Step.SELECT_TEMPLATE);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedSubTemplateKey, setSelectedSubTemplateKey] = useState<SubTemplateKey | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [finalData, setFinalData] = useState<ExtractedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [customTemplateContent, setCustomTemplateContent] = useState<string | null>(null);

  const [uploadSequence, setUploadSequence] = useState<string[]>([]);
  const [currentUploadIndex, setCurrentUploadIndex] = useState<number>(0);

  const { saveDocument } = useDocumentStore();

  const [isInitializing, setIsInitializing] = useState(true);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [storageWarningShown, setStorageWarningShown] = useState(false);

  useEffect(() => {
    // Only check for saved state if we are on the home screen
    if (activeModule !== 'home') {
        setIsInitializing(false);
        return;
    };
    try {
      const savedStateJSON = localStorage.getItem(SAVE_KEY);
      if (savedStateJSON) {
        setShowResumePrompt(true);
      } else {
        setIsInitializing(false);
      }
    } catch (e) {
      console.error("Could not read from local storage", e);
      setIsInitializing(false);
    }
  }, [activeModule]);

  // Centralized Save Logic
  const saveToLocalStorage = useCallback(() => {
    if (activeModule !== 'drafting' || (currentStep === Step.SELECT_TEMPLATE && !selectedTemplate)) return;

    try {
        const uploadedFilesMetadata: UploadedFiles = {};
        for (const key in uploadedFiles) {
          if (Object.prototype.hasOwnProperty.call(uploadedFiles, key)) {
            const typedKey = key as keyof UploadedFiles;
            const fileOrFiles = uploadedFiles[typedKey];
            if (Array.isArray(fileOrFiles)) {
              (uploadedFilesMetadata[typedKey] as UploadedFile[]) = fileOrFiles.map(f => ({
                name: f.name,
                mimeType: f.mimeType,
                base64: '', // Strip content to save space
              }));
            } else if (fileOrFiles) {
              (uploadedFilesMetadata[typedKey] as UploadedFile) = {
                name: (fileOrFiles as UploadedFile).name,
                mimeType: (fileOrFiles as UploadedFile).mimeType,
                base64: '',
              };
            }
          }
        }

        const stateToSave = {
          currentStep,
          selectedTemplate,
          selectedSubTemplateKey,
          uploadedFiles: uploadedFilesMetadata,
          extractedData,
          finalData,
          editingDocumentId,
          uploadSequence,
          currentUploadIndex,
          customTemplateContent,
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
        setStorageWarningShown(false); // Reset warning if save succeeds
    } catch(e: any) {
       console.error("Could not save to local storage", e);
       if ((e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && !storageWarningShown) {
           alert("CẢNH BÁO: Bộ nhớ trình duyệt đã đầy! Ứng dụng không thể tự động lưu tiến trình soạn thảo. Vui lòng xóa bớt các tài liệu đã lưu trong thư viện để giải phóng dung lượng.");
           setStorageWarningShown(true);
       }
    }
  }, [activeModule, currentStep, selectedTemplate, selectedSubTemplateKey, uploadedFiles, extractedData, finalData, editingDocumentId, uploadSequence, currentUploadIndex, customTemplateContent, storageWarningShown]);

  // Auto-save effect
  useEffect(() => {
    if (isInitializing || showResumePrompt) return;
    saveToLocalStorage();
  }, [saveToLocalStorage, isInitializing, showResumePrompt]);


  const handleResume = () => {
     try {
        const savedStateJSON = localStorage.getItem(SAVE_KEY);
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            setCurrentStep(savedState.currentStep);
            setSelectedTemplate(savedState.selectedTemplate);
            setSelectedSubTemplateKey(savedState.selectedSubTemplateKey);
            setUploadedFiles(savedState.uploadedFiles); // This will be metadata only
            setExtractedData(savedState.extractedData);
            setFinalData(savedState.finalData);
            setEditingDocumentId(savedState.editingDocumentId);
            setUploadSequence(savedState.uploadSequence || []);
            setCurrentUploadIndex(savedState.currentUploadIndex || 0);
            setCustomTemplateContent(savedState.customTemplateContent);
            setActiveModule('drafting'); // Go directly to drafting module
        }
    } catch (e) {
        console.error("Failed to parse saved state, starting fresh.", e);
        handleStartNewDraft();
        return;
    }
    setShowResumePrompt(false);
    setIsInitializing(false);
  };

  const resetDraftingState = () => {
    localStorage.removeItem(SAVE_KEY);
    setCurrentStep(Step.SELECT_TEMPLATE);
    setSelectedTemplate(null);
    setSelectedSubTemplateKey(null);
    setUploadedFiles({});
    setExtractedData(null);
    setFinalData(null);
    setIsLoading(false);
    setError(null);
    setEditingDocumentId(null);
    setUploadSequence([]);
    setCurrentUploadIndex(0);
    setCustomTemplateContent(null);
  }

  const handleStartNewDraft = () => {
    resetDraftingState();
    setShowResumePrompt(false);
    setIsInitializing(false);
    setActiveModule('drafting');
  };
  
  const handleEditDocument = (doc: StoredDocument) => {
      const template = DOCUMENT_TEMPLATES.find(t => t.key === doc.templateKey) || null;
      setSelectedTemplate(template);
      setSelectedSubTemplateKey(doc.data.subTemplateKey || null);
      setExtractedData(doc.data);
      setFinalData(doc.data);
      setEditingDocumentId(doc.id);
      setCurrentStep(Step.REVIEW_EXTRACTED_DATA);
      setActiveModule('drafting');
  }

  const handleGoHome = () => {
    resetDraftingState();
    setActiveModule('home');
  }

  const renderResumePrompt = () => (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
        <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-800 my-3">Tiếp tục phiên làm việc?</h2>
            <p className="text-slate-600 mb-6">Chúng tôi tìm thấy một phiên soạn thảo chưa hoàn tất. Bạn có muốn tiếp tục không?</p>
            <div className="flex justify-center gap-4">
                <button 
                    onClick={() => {
                      resetDraftingState();
                      setShowResumePrompt(false);
                      setIsInitializing(false);
                    }} 
                    className="px-6 py-2 font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
                >
                    Bỏ qua
                </button>
                <button 
                    onClick={handleResume} 
                    className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    </div>
  );
  
  const renderContent = () => {
    if (isInitializing) {
       return (
            <div className="text-center py-20">
                <p className="text-slate-500">Đang tải ứng dụng...</p>
            </div>
        );
    }
    
    if (showResumePrompt) {
        return <HomePage onSelectModule={setActiveModule} showResumePrompt={renderResumePrompt} />;
    }

    switch (activeModule) {
      case 'drafting':
        return <DraftingModule 
                  onEditDocument={handleEditDocument}
                  onGoHome={handleGoHome}
               />;
      case 'consultation':
        return <ConsultationModule onGoHome={handleGoHome} />;
      case 'lookup':
        return <LookupModule onEdit={handleEditDocument} onStartDrafting={handleStartNewDraft} onGoHome={handleGoHome} />;
      case 'home':
      default:
        return <HomePage onSelectModule={setActiveModule} />;
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header onGoHome={handleGoHome} onSwitchModule={setActiveModule} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Lưu ý: Luôn kiểm tra kỹ thông tin do AI trích xuất. Ứng dụng này chỉ mang tính chất tham khảo.</p>
        <p>&copy; 2024. Phát triển bởi Lê Minh Huấn - 0912041201. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
