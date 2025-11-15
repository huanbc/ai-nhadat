import React, { useState, useCallback, useEffect } from 'react';
import { DocumentTemplate, UploadedFiles, UploadedFile } from '../types';

interface DocumentUploaderProps {
  template: DocumentTemplate;
  onUpload: (files: UploadedFiles) => void;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  uploadStage: string;
  stageIndex: number;
  totalStages: number;
}

const FileInput: React.FC<{ label: string; file: UploadedFile | null; onChange: (file: UploadedFile) => void; id: string }> = ({ label, file, onChange, id }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = (event.target?.result as string).split(',')[1];
                onChange({
                    name: selectedFile.name,
                    base64,
                    mimeType: selectedFile.type,
                });
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center transition-colors hover:border-blue-500 bg-white">
            <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                <span className="font-semibold text-blue-600">{label}</span>
                <span className="text-sm text-slate-500 mt-1">Kéo và thả hoặc nhấn để chọn file (Ảnh hoặc PDF)</span>
                <input id={id} type="file" className="hidden" accept="image/png, image/jpeg, image/webp, application/pdf" onChange={handleFileChange} />
            </label>
            {file && (
                <div className="mt-4 text-sm text-green-700 font-medium bg-green-50 p-2 rounded-md">
                   {file.name}
                </div>
            )}
        </div>
    );
};

const MultiFileInput: React.FC<{ label: string; files: UploadedFile[]; onChange: (files: UploadedFile[]) => void; id: string }> = ({ label, files, onChange, id }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const newFiles: UploadedFile[] = []; // Start with an empty array for the current batch
            let filesToProcess = selectedFiles.length;

            Array.from(selectedFiles).forEach((file: File) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = (event.target?.result as string).split(',')[1];
                    newFiles.push({
                        name: file.name,
                        base64,
                        mimeType: file.type,
                    });
                    filesToProcess--;
                    if (filesToProcess === 0) {
                        onChange(newFiles); // Only call onChange when all files are processed
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        onChange(newFiles);
    };

    return (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center transition-colors hover:border-blue-500 bg-white md:col-span-2">
            <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                <span className="font-semibold text-blue-600">{label}</span>
                <span className="text-sm text-slate-500 mt-1">Chọn một hoặc nhiều file (Ảnh hoặc PDF)</span>
                <input id={id} type="file" multiple className="hidden" accept="image/png, image/jpeg, image/webp, application/pdf" onChange={handleFileChange} />
            </label>
            {files.length > 0 && (
                <div className="mt-4 space-y-2 text-left">
                    {files.map((file, index) => (
                         <div key={index} className="text-sm text-green-700 font-medium bg-green-50 p-2 rounded-md flex justify-between items-center">
                           <span>{file.name}</span>
                           <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700">&times;</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const getStageLabel = (stage: string): string => {
    switch (stage) {
        case 'partyA_id': return "CCCD Bên A (Bên bán/tặng cho/làm đơn)";
        case 'partyB_id': return "CCCD Bên B (Bên mua/nhận tặng cho)";
        case 'heir_ids': return "CCCD của (các) Người thừa kế";
        case 'deathCertificates': return "Giấy Chứng tử";
        case 'heirsConfirmation': return "Giấy Xác nhận Hàng thừa kế (Tùy chọn)";
        case 'landCertificate': return "Giấy Chứng nhận QSDĐ";
        case 'contract': return "Hợp đồng chuyển quyền";
        default: return "Tài liệu không xác định";
    }
}


export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ template, onUpload, isLoading, error, onBack, uploadStage, stageIndex, totalStages }) => {
    const [files, setFiles] = useState<UploadedFiles>({});
    
    // Clear local files state when the stage changes
    useEffect(() => {
        setFiles({});
    }, [uploadStage]);

    const handleFileChange = (key: keyof UploadedFiles, value: UploadedFile | UploadedFile[]) => {
        setFiles({ [key]: value });
    };

    const handleSubmit = () => {
        onUpload(files);
    };

    const isUploadButtonDisabled = () => {
        if (isLoading) return true;
        const fileOrFiles = files[uploadStage as keyof UploadedFiles];
        if (Array.isArray(fileOrFiles)) {
            return fileOrFiles.length === 0;
        }
        return !fileOrFiles;
    };
    
    const renderFileInputForStage = () => {
        const label = getStageLabel(uploadStage);
        const stageKey = uploadStage as keyof UploadedFiles;

        switch (uploadStage) {
            case 'partyA_id':
            case 'partyB_id':
            case 'heir_ids':
            case 'deathCertificates':
            case 'landCertificate':
            case 'contract':
                return <MultiFileInput 
                            id={stageKey} 
                            label={label} 
                            files={ (files[stageKey] as UploadedFile[] || []) } 
                            onChange={(newFiles) => handleFileChange(stageKey, newFiles)} 
                        />;
            case 'heirsConfirmation':
                return <FileInput 
                            id={stageKey} 
                            label={label} 
                            file={ (files[stageKey] as UploadedFile | null) } 
                            onChange={(file) => handleFileChange(stageKey, file)} 
                        />
            default:
                return <p>Giai đoạn tải lên không hợp lệ.</p>
        }
    }


    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-left mb-8">
                <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    Quay lại
                </button>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tải lên Tài liệu (Bước {stageIndex + 1}/{totalStages})</h2>
                <p className="mt-2 text-lg text-slate-600">
                    Cung cấp hình ảnh hoặc file PDF rõ nét cho: <span className="font-semibold text-blue-700">{getStageLabel(uploadStage)}</span>.
                </p>
            </div>
            
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {renderFileInputForStage()}
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}

                <div className="pt-6 text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isUploadButtonDisabled()}
                        className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {isLoading ? (
                            <>
                               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                               </svg>
                                Đang trích xuất dữ liệu...
                            </>
                        ) : `Trích xuất & Tiếp tục`}
                    </button>
                </div>
            </div>
        </div>
    );
};
