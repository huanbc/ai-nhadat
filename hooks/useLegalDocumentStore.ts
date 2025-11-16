import { useState, useEffect, useCallback } from 'react';
import { StoredLegalDocument } from '../types';

const STORAGE_KEY = 'AI_LEGAL_DOCUMENTS_LIBRARY';

export const useLegalDocumentStore = () => {
  const [legalDocuments, setLegalDocuments] = useState<StoredLegalDocument[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setLegalDocuments(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load legal documents from storage:", error);
      setLegalDocuments([]);
    }
  }, []);

  const saveToStorage = (docs: StoredLegalDocument[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (error) {
      console.error("Failed to save legal documents to storage:", error);
    }
  };

  const addLegalDocument = useCallback((fileName: string, base64: string, mimeType: string, contentHash: string) => {
    let newDoc: StoredLegalDocument | null = null;
    setLegalDocuments(prevDocs => {
      // Double check for hash existence before adding
      if (prevDocs.some(doc => doc.contentHash === contentHash)) {
        return prevDocs;
      }
      
      newDoc = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        fileName,
        base64,
        mimeType,
        contentHash,
      };
      const newDocs = [newDoc, ...prevDocs];
      saveToStorage(newDocs);
      return newDocs;
    });
    return newDoc;
  }, []);

  const deleteLegalDocument = useCallback((id: string) => {
    setLegalDocuments(prevDocs => {
      const newDocs = prevDocs.filter(doc => doc.id !== id);
      saveToStorage(newDocs);
      return newDocs;
    });
  }, []);

  return { legalDocuments, addLegalDocument, deleteLegalDocument };
};
