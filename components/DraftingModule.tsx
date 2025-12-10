import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { DOCUMENT_TEMPLATES } from '../constants';
import { DocumentTemplate, DocumentTemplateKey, UploadedFile, Procedure, LandPrice, Step, ExtractedData, UploadedFiles, SubTemplateKey, StoredDocument } from '../types';
import { SubTemplateSelector } from './SubTemplateSelector';
import { DocumentUploader } from './DocumentUploader';
import { DocumentEditor } from './DocumentEditor';
import { CustomTemplateUploader } from './CustomTemplateUploader';
import { GeneratedDocument } from './GeneratedDocument';
import { useDocumentStore } from '../hooks/useDocumentStore';
import { extractDataForStage } from '../services/geminiService';
import { normalizeAllAddressesInExtractedData } from '../utils/addressNormalizer';

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


interface DraftingModuleProps {
  onGoHome: () => void;
  onEditDocument: (doc: StoredDocument) => void;
}

export const DraftingModule: React.FC<DraftingModuleProps> = ({ onGoHome, onEditDocument }) => {
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

  const handleManualSaveDraft = () => {
    // This functionality is now handled by the auto-save in App.tsx
    // We can show a confirmation message if needed.
    alert("Bản nháp của bạn đang được tự động lưu. Bạn có thể đóng trình duyệt và tiếp tục sau.");
  };

  const resetState = () => {
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
  };
  
  const handleStartNew = () => {
    resetState();
    onGoHome();
  }

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
        
        // Manual merge to handle arrays correctly
        const mergedData = { ...(extractedData || {}) };
        for (const key in newData) {
            const typedKey = key as keyof ExtractedData;
            if (Array.isArray(newData[typedKey])) {
                // @ts-ignore
                mergedData[typedKey] = [...(mergedData[typedKey] || []), ...newData[typedKey]];
            } else if (typeof newData[typedKey] === 'object' && newData[typedKey] !== null) {
                // @ts-ignore
                mergedData[typedKey] = { ...(mergedData[typedKey] || {}), ...newData[typedKey] };
            } else {
                // @ts-ignore
                mergedData[typedKey] = newData[typedKey];
            }
        }
        
        setExtractedData(mergedData); // Set merged data for next step's context

        const nextIndex = currentUploadIndex + 1;
        if (nextIndex < uploadSequence.length) {
            setCurrentUploadIndex(nextIndex);
        } else {
            // Last stage completed, normalize and move to review
            const today = new Date();
            const finalDataWithDate = {
                ...mergedData,
                documentDate: mergedData.documentDate || `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`,
                subTemplateKey: selectedSubTemplateKey,
            };

            const normalizedData = await normalizeAllAddressesInExtractedData(finalDataWithDate);
            setExtractedData(normalizedData);
            setCurrentStep(Step.REVIEW_EXTRACTED_DATA);
        }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageSkip = async () => {
    const nextIndex = currentUploadIndex + 1;
    if (nextIndex < uploadSequence.length) {
        setCurrentUploadIndex(nextIndex);
    } else {
        // Last stage was skipped, move to review with existing data
        const dataToFinalize = extractedData || {};
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        
        const finalDataWithDate = {
            ...dataToFinalize,
            documentDate: dataToFinalize.documentDate || `${day}/${month}/${year}`,
            subTemplateKey: selectedSubTemplateKey,
        };

        const normalizedData = await normalizeAllAddressesInExtractedData(finalDataWithDate);
        setExtractedData(normalizedData);
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


  const handleBack = () => {
     switch (currentStep) {
        case Step.SELECT_SUB_TEMPLATE:
            setCurrentStep(Step.SELECT_TEMPLATE);
            break;
        case Step.UPLOAD_DOCUMENTS:
            if (currentUploadIndex > 0) {
                setCurrentUploadIndex(prev => prev - 1);
                const stageToClear = uploadSequence[currentUploadIndex] as keyof ExtractedData;
                setExtractedData(prev => {
                    if (!prev) return null;
                    const newData = {...prev};
                    delete newData[stageToClear];
                    return newData;
                });
            } else {
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
  
  const TemplateSelection: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState<DocumentTemplateKey | ''>('');
    const selectedTpl = useMemo(() => DOCUMENT_TEMPLATES.find(t => t.key === selectedKey), [selectedKey]);
    
    return (
     <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">Soạn thảo Văn bản Tự động</h3>
           <p className="text-slate-600 text-sm mb-4 text-center">Chọn loại văn bản, tải lên giấy tờ, và để AI tự động điền mẫu cho bạn.</p>
           <div className="flex-grow space-y-4">
            <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value as DocumentTemplateKey | '')}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                aria-label="Chọn loại văn bản"
            >
                <option value="" disabled>-- Chọn loại văn bản --</option>
                {DOCUMENT_TEMPLATES.map(template => (
                    <option key={template.key} value={template.key}>{template.title}</option>
                ))}
            </select>
            <div className="bg-slate-50 p-4 rounded-md min-h-[100px] border border-slate-200">
                <h4 className="font-semibold text-slate-800">Mô tả</h4>
                <p className="text-sm text-slate-600 mt-1">
                    {selectedTpl ? selectedTpl.description : "Vui lòng chọn một loại văn bản để xem mô tả chi tiết."}
                </p>
            </div>
           </div>
           <button
              onClick={() => selectedTpl && handleTemplateSelect(selectedTpl)}
              disabled={!selectedTpl}
              className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Bắt đầu Soạn thảo
            </button>
    </div>
    )
  };


  switch (currentStep) {
    case Step.SELECT_TEMPLATE:
      return <TemplateSelection />;
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
              onRestart={resetState}
              onBackToManager={onGoHome}
              isEditing={!!editingDocumentId}
              onBack={handleBack}
              onSaveDraft={handleManualSaveDraft}
          />
      );
    default:
      return <TemplateSelection />;
  }
};