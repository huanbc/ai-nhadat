import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

interface RichTextEditorProps {
    initialContent: string;
    onChange: (content: string) => void;
    height?: string;
    minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onChange, minHeight = '70vh' }) => {
    const editor = useRef(null);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Soạn thảo nội dung ở đây...',
        minHeight: minHeight,
        iframe: true, // QUAN TRỌNG: Dùng iframe để cách ly style
        iframeStyle: `
            body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 14pt;
                line-height: 1.8;
                color: #000;
                margin: 2cm 2cm 2cm 3cm;
            }
        `,
        language: 'vi',
        toolbarAdaptive: false,
        buttons: [
            'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'superscript', 'subscript', '|',
            'ul', 'ol', '|',
            'outdent', 'indent',  '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'table', 'link', '|',
            'align', 'hr', '|',
            'copyformat', 'fullsize', 'print', 'source'
        ],
    }), [minHeight]);

    // Sử dụng onBlur để cập nhật state thay vì onChange để tối ưu hiệu năng
    const handleBlur = (newContent: string) => {
        onChange(newContent);
    };

    return (
        <JoditEditor
            ref={editor}
            value={initialContent}
            config={config}
            onBlur={handleBlur}
            onChange={() => {}} // Có thể để trống nếu đã dùng onBlur
        />
    );
};

export default RichTextEditor;
