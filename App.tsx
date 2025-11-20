

import React, { useState, useCallback, useEffect } from 'react';
import { TemplateSelector } from './components/TemplateSelector';
import { SubTemplateSelector } from './components/SubTemplateSelector';
import { DocumentUploader } from './components/DocumentUploader';
import { DocumentEditor } from './components/DocumentEditor';
import { GeneratedDocument } from './components/GeneratedDocument';
import { DocumentManager } from './components/DocumentManager';
import { Header } from './components/Header';
import { useDocumentStore } from './hooks/useDocumentStore';
import { extractDataForStage } from './services/geminiService';
import { normalizeAllAddressesInExtractedData } from './utils/addressNormalizer';
import { DocumentTemplate, ExtractedData, UploadedFiles, Step, StoredDocument, SubTemplateKey, UploadedFile } from './types';
import { DOCUMENT_TEMPLATES } from './constants';
import { CustomTemplateUploader } from './components/CustomTemplateUploader';
import { HomePage } from './components/HomePage';

const SAVE_KEY = 'documentDraftProgress';

type ViewMode = 'creating' | 'managing';
type ManagerTab = 'documents' | 'procedures' | 'prices' | 'analysis' | 'officialDocs' | 'adminUnits' | 'mapLookup';

const generateUploadSequence = (template: DocumentTemplate): string[] => {
    const sequence: string[] = [];
    if (template.requiredParties.includes('partyA')) sequence.push('partyA_id');
    if (template.requiredParties.includes('partyB')) sequence.push('partyB_id');
    if (template.requiredParties.includes('heir')) sequence.push('heir_ids');
    if (template.requiresDeathCertificate) sequence.push('deathCertificates');
    if (template.acceptsHeirsConfirmation) sequence.push('heirsConfirmation');
    if (template.requiresLandCertificate) sequence.push('landCertificate');
    if (template.requiresVehicleRegistration) sequence.push('vehicleRegistration');
    if (template.acceptsContract) sequence.push('contract');
    return sequence;
};


const App: React.FC = () => {
  const [appStarted, setAppStarted] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<Step>(Step.SELECT_TEMPLATE);
  const [viewMode, setViewMode] = useState<ViewMode>('creating');
  const [managerTab, setManagerTab] = useState<ManagerTab>('analysis');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedSubTemplateKey, setSelectedSubTemplateKey] = useState<SubTemplateKey | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [finalData, setFinalData] = useState<ExtractedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [customTemplateContent, setCustomTemplateContent] = useState<string | null>(null);

  // State for sequential upload
  const [uploadSequence, setUploadSequence] = useState<string[]>([]);
  const [currentUploadIndex, setCurrentUploadIndex] = useState<number>(0);

  const { saveDocument } = useDocumentStore();

  const [isInitializing, setIsInitializing] = useState(true);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  useEffect(() => {
    if (!appStarted) return; // Don't check for saved state until app is started
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
  }, [appStarted]);

  // Centralized Save Logic
  const saveToLocalStorage = useCallback(() => {
    if (currentStep === Step.SELECT_TEMPLATE && !selectedTemplate) return;

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
    } catch(e) {
       console.error("Could not save to local storage", e);
    }
  }, [currentStep, selectedTemplate, selectedSubTemplateKey, uploadedFiles, extractedData, finalData, editingDocumentId, uploadSequence, currentUploadIndex, customTemplateContent]);

  // Auto-save effect
  useEffect(() => {
    if (isInitializing || !appStarted || showResumePrompt) return;
    saveToLocalStorage();
  }, [saveToLocalStorage, isInitializing, appStarted, showResumePrompt]);

  const handleManualSaveDraft = () => {
      saveToLocalStorage();
      alert("Đã lưu bản nháp thành công! Bạn có thể đóng trình duyệt và tiếp tục sau.");
  };

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
            setViewMode('creating');
        }
    } catch (e) {
        console.error("Failed to parse saved state, starting fresh.", e);
        handleStartNew();
        return;
    }
    setShowResumePrompt(false);
    setIsInitializing(false);
  };

  const resetState = () => {
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

  const handleStartNew = () => {
    resetState();
    setViewMode('creating');
    setShowResumePrompt(false);
    setIsInitializing(false);
  };

  const handleGoToHomePage = () => {
    resetState();
    setAppStarted(false);
  };

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setUploadedFiles({});
    setExtractedData(null);
    setError(null);
    const sequence = generateUploadSequence(template);
    setUploadSequence(sequence);
    setCurrentUploadIndex(0);

    if (template.hasSubTemplates) {
      setCurrentStep(Step.SELECT_SUB_TEMPLATE);
    } else {
      setSelectedSubTemplateKey(null);
      setCurrentStep(Step.UPLOAD_DOCUMENTS);
    }
  };

  const handleSubTemplateSelect = (subKey: SubTemplateKey) => {
    setSelectedSubTemplateKey(subKey);
    setCurrentStep(Step.UPLOAD_DOCUMENTS);
  };

  const handleStageUpload = async (filesForStage: UploadedFiles) => {
    const currentStage = uploadSequence[currentUploadIndex];
    if (!currentStage) return;

    setUploadedFiles(prev => ({...prev, ...filesForStage}));
    setIsLoading(true);
    setError(null);

    try {
        if (!selectedTemplate) throw new Error("Chưa chọn mẫu văn bản.");
        
        const newData = await extractDataForStage(currentStage, filesForStage, selectedTemplate.key);
        
        // Merge new data with existing data
        setExtractedData(prevData => {
            const merged = { ...(prevData || {}) };
            for (const key in newData) {
                const typedKey = key as keyof ExtractedData;
                if (Array.isArray(newData[typedKey])) {
                    // @ts-ignore
                    merged[typedKey] = [...(merged[typedKey] || []), ...newData[typedKey]];
                } else if (typeof newData[typedKey] === 'object' && newData[typedKey] !== null) {
                    // @ts-ignore
                    merged[typedKey] = { ...(merged[typedKey] || {}), ...newData[typedKey] };
                } else {
                    // @ts-ignore
                    merged[typedKey] = newData[typedKey];
                }
            }
            return merged;
        });

        const nextIndex = currentUploadIndex + 1;
        if (nextIndex < uploadSequence.length) {
            setCurrentUploadIndex(nextIndex);
        } else {
            // Last stage completed, move to review
            setExtractedData(currentExtractedData => {
                if (!currentExtractedData) return null;
                const today = new Date();
                const day = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();
                
                const finalDataWithDate = {
                    ...currentExtractedData,
                    documentDate: `${day}/${month}/${year}`,
                    subTemplateKey: selectedSubTemplateKey,
                };

                const normalizedData = normalizeAllAddressesInExtractedData(finalDataWithDate);
                return normalizedData;
            });
            setCurrentStep(Step.REVIEW_EXTRACTED_DATA);
        }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageSkip = () => {
    const nextIndex = currentUploadIndex + 1;
    if (nextIndex < uploadSequence.length) {
        setCurrentUploadIndex(nextIndex);
    } else {
        // Last stage was skipped, move to review with existing data
        setExtractedData(currentExtractedData => {
            const dataToFinalize = currentExtractedData || {};
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            
            const finalDataWithDate = {
                ...dataToFinalize,
                documentDate: dataToFinalize.documentDate || `${day}/${month}/${year}`,
                subTemplateKey: selectedSubTemplateKey,
            };

            const normalizedData = normalizeAllAddressesInExtractedData(finalDataWithDate);
            return normalizedData;
        });
        setCurrentStep(Step.REVIEW_EXTRACTED_DATA);
    }
  };


  const handleReviewComplete = (editedData: ExtractedData) => {
    setFinalData(editedData); // Save the edited data
    if(selectedTemplate?.hasSubTemplates) {
        setCurrentStep(Step.UPLOAD_CUSTOM_TEMPLATE);
    } else {
        // For templates without sub-types (like tax forms), skip custom template step
        handleCustomTemplateUpload(null);
    }
  };

  const handleCustomTemplateUpload = (content: string | null) => {
    setCustomTemplateContent(content); // Can be null to use default

    if (!finalData || !selectedTemplate) return;

    const documentToSave: StoredDocument = {
      id: editingDocumentId || Date.now().toString(),
      createdAt: editingDocumentId ? new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templateKey: selectedTemplate.key,
      templateTitle: selectedTemplate.title,
      data: {
        ...finalData,
        subTemplateKey: selectedSubTemplateKey,
      },
    };

    saveDocument(documentToSave);
    setCurrentStep(Step.GENERATE_DOCUMENT);
  };


  const handleEditDocument = (doc: StoredDocument) => {
      const template = DOCUMENT_TEMPLATES.find(t => t.key === doc.templateKey) || null;
      setSelectedTemplate(template);
      setSelectedSubTemplateKey(doc.data.subTemplateKey || null);
      setExtractedData(doc.data);
      setFinalData(doc.data);
      setEditingDocumentId(doc.id);
      setCurrentStep(Step.REVIEW_EXTRACTED_DATA);
      setViewMode('creating');
  }

  const handleBackToManager = () => {
      resetState();
      setViewMode('managing');
  }

  const handleNavigateToManager = () => {
    setViewMode('managing');
  };
  
  const handleBack = () => {
     switch (currentStep) {
        case Step.SELECT_SUB_TEMPLATE:
            setCurrentStep(Step.SELECT_TEMPLATE);
            break;
        case Step.UPLOAD_DOCUMENTS:
            if (currentUploadIndex > 0) {
                // Go back to the previous upload stage
                setCurrentUploadIndex(prev => prev - 1);
                
                // Clear the data from the stage we are leaving
                const stageToClear = uploadSequence[currentUploadIndex] as keyof ExtractedData;
                setExtractedData(prev => {
                    if (!prev) return null;
                    const newData = {...prev};
                    delete newData[stageToClear];
                    return newData;
                });
            } else {
                 // Go back to the previous main step
                if (selectedTemplate?.hasSubTemplates) {
                    setCurrentStep(Step.SELECT_SUB_TEMPLATE);
                } else {
                    setCurrentStep(Step.SELECT_TEMPLATE);
                }
            }
            break;
        case Step.REVIEW_EXTRACTED_DATA:
            setCurrentStep(Step.UPLOAD_DOCUMENTS);
            break;
        case Step.UPLOAD_CUSTOM_TEMPLATE:
            setCurrentStep(Step.REVIEW_EXTRACTED_DATA);
            break;
        case Step.GENERATE_DOCUMENT:
             if(selectedTemplate?.hasSubTemplates) {
                setCurrentStep(Step.UPLOAD_CUSTOM_TEMPLATE);
             } else {
                setCurrentStep(Step.REVIEW_EXTRACTED_DATA);
             }
             break;
        default:
             setCurrentStep(Step.SELECT_TEMPLATE);
     }
  }


  const renderCreationSteps = () => {
    switch (currentStep) {
      case Step.SELECT_TEMPLATE:
        return <TemplateSelector onSelect={handleTemplateSelect} onGoHome={handleStartNew} />;
      case Step.SELECT_SUB_TEMPLATE:
        return (
            <SubTemplateSelector 
                onSelect={handleSubTemplateSelect}
                onBack={handleBack}
                templateTitle={selectedTemplate?.title || ''}
            />
        );
      case Step.UPLOAD_DOCUMENTS:
        return (
          <DocumentUploader
            template={selectedTemplate!}
            onUpload={handleStageUpload}
            isLoading={isLoading}
            error={error}
            onBack={handleBack}
            uploadStage={uploadSequence[currentUploadIndex]}
            stageIndex={currentUploadIndex}
            totalStages={uploadSequence.length}
            onSkip={handleStageSkip}
            onSaveDraft={handleManualSaveDraft}
          />
        );
      case Step.REVIEW_EXTRACTED_DATA:
        return (
            <DocumentEditor 
                template={selectedTemplate!} 
                initialData={extractedData!}
                onComplete={handleReviewComplete}
                onBack={handleBack}
                onSaveDraft={handleManualSaveDraft}
            />
        );
      case Step.UPLOAD_CUSTOM_TEMPLATE:
        return (
            <CustomTemplateUploader
                template={selectedTemplate!}
                subTemplateKey={selectedSubTemplateKey!}
                onComplete={handleCustomTemplateUpload}
                onBack={handleBack}
                onSaveDraft={handleManualSaveDraft}
            />
        );
      case Step.GENERATE_DOCUMENT:
        return (
            <GeneratedDocument 
                template={selectedTemplate!}
                data={finalData!}
                customTemplateContent={customTemplateContent}
                onRestart={handleStartNew}
                onBackToManager={handleBackToManager}
                isEditing={!!editingDocumentId}
                onBack={handleBack}
                onSaveDraft={handleManualSaveDraft}
            />
        );
      default:
        return <TemplateSelector onSelect={handleTemplateSelect} onGoHome={handleStartNew} />;
    }
  };
  
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
                    onClick={handleStartNew} 
                    className="px-6 py-2 font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
                >
                    Bắt đầu mới
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

  if (!appStarted) {
    return <HomePage onStart={() => setAppStarted(true)} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {showResumePrompt && renderResumePrompt()}
      <Header
        onGoHome={handleGoToHomePage}
        onManageDocuments={handleNavigateToManager}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isInitializing && !showResumePrompt && (
          viewMode === 'creating' 
            ? renderCreationSteps() 
            : <DocumentManager 
                onEdit={handleEditDocument} 
                onGoHome={handleStartNew}
                activeTab={managerTab}
                onTabChange={setManagerTab}
              />
        )}
         {isInitializing && !showResumePrompt && (
            <div className="text-center py-20">
                <p className="text-slate-500">Đang tải ứng dụng...</p>
            </div>
        )}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Lưu ý: Luôn kiểm tra kỹ thông tin do AI trích xuất. Ứng dụng này chỉ mang tính chất tham khảo.</p>
        <p>&copy; 2024. Phát triển bởi Lê Minh Huấn - 0912041201. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
