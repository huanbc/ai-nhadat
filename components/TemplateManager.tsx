import React, { useState, useEffect, useCallback } from 'react';
import { useTemplateStore } from '../hooks/useTemplateStore';
import { DOCUMENT_TEMPLATES, PLACEHOLDER_GUIDE } from '../constants';
import { DocumentTemplate, DocumentTemplateKey, SubTemplateKey } from '../types';
import { analyzeTemplateContent, fixTemplateContent } from '../services/geminiService';


const subTemplateOptions: { key: SubTemplateKey, title: string }[] = [
    { key: 'vpcc', title: 'Mẫu Văn phòng Công chứng (VPCC)' },
    { key: 'ubnd', title: 'Mẫu UBND' },
    { key: 'simplified', title: 'Mẫu Rút gọn' },
];

interface TemplateEditorProps {
    templateKey: DocumentTemplateKey;
    subTemplateKey: SubTemplateKey;
    templateTitle: string;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ templateKey, subTemplateKey, templateTitle }) => {
    const { customTemplates, saveTemplate } = useTemplateStore();
    
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [analysisError, setAnalysisError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isFixing, setIsFixing] = useState(false);
    const [originalContentForFix, setOriginalContentForFix] = useState('');


    useEffect(() => {
        setContent(customTemplates[templateKey]?.[subTemplateKey] || '');
        setAnalysisResult('');
        setAnalysisError('');
        setSaveSuccess(false);
        setFileName('');
        setOriginalContentForFix('');
    }, [templateKey, subTemplateKey, customTemplates]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileContent = e.target?.result as string;
                setContent(fileContent);
                setFileName(file.name);
                setAnalysisResult('');
                setAnalysisError('');
            };
            reader.readAsText(file);
        }
        event.target.value = '';
    };
    
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if (saveSuccess) setSaveSuccess(false);
    }

    const handleAnalyze = async () => {
        if (!content) return;
        setOriginalContentForFix(content); // Save content before analysis
        setIsAnalyzing(true);
        setAnalysisResult('');
        setAnalysisError('');
        try {
            const result = await analyzeTemplateContent(content, templateTitle);
            setAnalysisResult(result);
        } catch (err) {
            setAnalysisError(err instanceof Error ? err.message : 'Lỗi không xác định.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFix = async () => {
        if (!analysisResult || !originalContentForFix) return;
        setIsFixing(true);
        setAnalysisError('');
        try {
            const fixedContent = await fixTemplateContent(originalContentForFix, analysisResult, templateTitle);
            setContent(fixedContent);
            setAnalysisResult(''); // Clear analysis result after applying fix
            setOriginalContentForFix('');
        } catch (err) {
             setAnalysisError(err instanceof Error ? err.message : 'Lỗi khi sửa mẫu.');
        } finally {
            setIsFixing(false);
        }
    };

    const handleSave = () => {
        saveTemplate(templateKey, subTemplateKey, content);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const inputId = `template-upload-${templateKey}-${subTemplateKey}`;

    return (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
            <textarea
                value={content}
                onChange={handleTextChange}
                placeholder="Nội dung mẫu sẽ hiển thị ở đây. Bạn có thể dán trực tiếp hoặc tải lên từ file."
                className="w-full h-64 p-2 border border-slate-300 rounded-md font-mono text-xs shadow-inner focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex items-center gap-2">
                    <label htmlFor={inputId} className="cursor-pointer text-sm font-medium px-4 py-2 bg-white text-slate-700 rounded-md border border-slate-300 hover:bg-slate-50 transition-colors">
                        Tải lên file
                    </label>
                    <button onClick={handleAnalyze} disabled={isAnalyzing || !content || isFixing} className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 disabled:bg-slate-100 disabled:text-slate-400">
                        {isAnalyzing ? 'Đang phân tích...' : 'Phân tích Mẫu bằng AI'}
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                        Lưu Mẫu
                    </button>
                </div>
                 {fileName && <span className="text-xs text-slate-500">Đã tải: {fileName}</span>}
                 {saveSuccess && <span className="text-xs text-green-600 font-semibold">Đã lưu thành công!</span>}
            </div>
             <input type="file" id={inputId} accept=".html,.txt" className="hidden" onChange={handleFileChange} />
             
            {(analysisResult || analysisError || isAnalyzing || isFixing) && (
                 <div className="w-full bg-white border border-slate-200 rounded-md p-3 text-sm">
                    {isAnalyzing && <p className="text-slate-500 animate-pulse">AI đang phân tích...</p>}
                    {isFixing && <p className="text-orange-500 animate-pulse">AI đang sửa mẫu...</p>}
                    {analysisError && <p className="text-red-600">{analysisError}</p>}
                    {analysisResult && !isAnalyzing && (
                        <>
                            <pre className="whitespace-pre-wrap text-slate-800 font-sans">{analysisResult}</pre>
                            <div className="mt-3 border-t border-slate-200 pt-3 text-center">
                                <button 
                                    onClick={handleFix} 
                                    disabled={isFixing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 disabled:bg-slate-300 transition-colors"
                                >
                                    {isFixing ? 'Đang áp dụng...' : 'Để AI sửa mẫu'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};


export const TemplateManager: React.FC = () => {
    const templatesWithSubTemplates = DOCUMENT_TEMPLATES.filter(t => t.hasSubTemplates);
    const [selectedTemplateKey, setSelectedTemplateKey] = useState<DocumentTemplateKey>(templatesWithSubTemplates[0]?.key);

    const selectedTemplate = templatesWithSubTemplates.find(t => t.key === selectedTemplateKey);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                 <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Quản lý Mẫu Soạn thảo Tùy chỉnh</h3>
                    <p className="text-slate-600 text-sm mb-4">
                        Tải lên các tệp mẫu văn bản (.html hoặc .txt) của riêng bạn. Hệ thống sẽ sử dụng các mẫu này để tự động điền thông tin.
                        Sử dụng các "placeholder" trong bảng hướng dẫn bên cạnh để đánh dấu vị trí cần chèn dữ liệu.
                    </p>

                    <label htmlFor="template-selector" className="block text-sm font-medium text-slate-700 mb-1">Chọn loại văn bản để chỉnh sửa:</label>
                    <select
                        id="template-selector"
                        value={selectedTemplateKey}
                        onChange={(e) => setSelectedTemplateKey(e.target.value as DocumentTemplateKey)}
                        className="w-full max-w-md p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {templatesWithSubTemplates.map(template => (
                             <option key={template.key} value={template.key}>{template.title}</option>
                        ))}
                    </select>
                 </div>

                {selectedTemplate && (
                     <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                        <h4 className="text-lg font-bold text-slate-800 mb-4">{selectedTemplate.title}</h4>
                        <div className="space-y-4">
                            {subTemplateOptions.map(sub => (
                                <div key={sub.key}>
                                    <h5 className="font-semibold text-slate-700 mb-2">{sub.title}</h5>
                                    <TemplateEditor 
                                        templateKey={selectedTemplate.key} 
                                        subTemplateKey={sub.key} 
                                        templateTitle={selectedTemplate.title}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="lg:col-span-1">
                 <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 sticky top-8">
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Hướng dẫn Placeholder</h4>
                    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                        {PLACEHOLDER_GUIDE.map(category => (
                            <div key={category.category}>
                                <h5 className="font-semibold text-slate-700 text-sm mb-2">{category.category}</h5>
                                <ul className="space-y-1 text-xs text-slate-600">
                                    {category.placeholders.map(p => (
                                        <li key={p.key} className="p-2 bg-slate-50 rounded">
                                            <code className="font-mono text-blue-700 bg-blue-100 px-1 py-0.5 rounded">{p.key}</code>
                                            <p className="mt-1">{p.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    );
};
