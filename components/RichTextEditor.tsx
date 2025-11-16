
import React, { useRef, useEffect } from 'react';

// Define SunEditor type for global scope
declare global {
    interface Window {
        suneditor: any;
    }
}

interface RichTextEditorProps {
    initialContent: string;
    onChange: (content: string) => void;
    height?: string;
    minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onChange, height = 'auto', minHeight = '500px' }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editorInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (textareaRef.current) {
            const editor = window.suneditor.create(textareaRef.current, {
                buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['paragraphStyle', 'blockquote'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link', 'image'],
                    ['fullScreen', 'showBlocks', 'codeView'],
                    ['preview', 'print'],
                ],
                height: height,
                minHeight: minHeight,
                placeholder: 'Nhập nội dung ở đây...',
                defaultStyle: "font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.8;",
                resizingBar: true,
                imageResizing: true,
                imageWidth: 'auto',
            });

            editor.onChange = (contents: string) => {
                onChange(contents);
            };
            
            editorInstanceRef.current = editor;
            
            // Set initial content after initialization
            if (initialContent) {
                editor.setContents(initialContent);
            }
        }

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        // Update content editor when initialContent prop changes,
        // but only if it's different from the current editor content to avoid loops.
        if (editorInstanceRef.current && initialContent !== editorInstanceRef.current.getContents()) {
             editorInstanceRef.current.setContents(initialContent);
        }
    }, [initialContent]);


    return (
        <textarea ref={textareaRef} style={{ display: 'none' }} />
    );
};

export default RichTextEditor;
