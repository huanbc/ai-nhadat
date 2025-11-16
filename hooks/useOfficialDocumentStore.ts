import { useState, useEffect, useCallback } from 'react';
import { StoredOfficialDocument, UploadedFile } from '../types';

const STORAGE_KEY = 'AI_OFFICIAL_DOCUMENTS';

interface OfficialDocumentPayload {
    title: string;
    directiveFiles: UploadedFile[];
    responseContent: string;
    userNotes: string;
    directiveAnalysis: string;
}

export const useOfficialDocumentStore = () => {
  const [officialDocuments, setOfficialDocuments] = useState<StoredOfficialDocument[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setOfficialDocuments(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load official documents from storage:", error);
      setOfficialDocuments([]);
    }
  }, []);

  const saveToStorage = (docs: StoredOfficialDocument[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (error) {
       if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Lỗi: Dung lượng lưu trữ của trình duyệt đã đầy. Không thể lưu thêm văn bản. Vui lòng xóa bớt các văn bản cũ.');
      }
      console.error("Failed to save official documents to storage:", error);
    }
  };

  const addOfficialDocument = useCallback((docToAdd: OfficialDocumentPayload) => {
    setOfficialDocuments(prevDocs => {
      const newDoc: StoredOfficialDocument = {
        title: docToAdd.title,
        responseContent: docToAdd.responseContent,
        userNotes: docToAdd.userNotes,
        directiveFiles: docToAdd.directiveFiles.map(({ name, mimeType }) => ({ name, mimeType })), // Strip base64 data
        directiveAnalysis: docToAdd.directiveAnalysis,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const newDocs = [newDoc, ...prevDocs];
      saveToStorage(newDocs);
      return newDocs;
    });
  }, []);

  const deleteOfficialDocument = useCallback((id: string) => {
    setOfficialDocuments(prevDocs => {
      const newDocs = prevDocs.filter(doc => doc.id !== id);
      saveToStorage(newDocs);
      return newDocs;
    });
  }, []);

  return { officialDocuments, addOfficialDocument, deleteOfficialDocument };
};