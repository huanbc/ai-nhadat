import { useState, useEffect, useCallback } from 'react';
import { StoredOfficialDocument } from '../types';

const STORAGE_KEY = 'AI_OFFICIAL_DOCUMENTS';

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
      console.error("Failed to save official documents to storage:", error);
    }
  };

  const addOfficialDocument = useCallback((docToAdd: Omit<StoredOfficialDocument, 'id' | 'createdAt'>) => {
    setOfficialDocuments(prevDocs => {
      const newDoc: StoredOfficialDocument = {
        ...docToAdd,
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
