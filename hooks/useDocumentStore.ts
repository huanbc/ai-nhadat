
import { useState, useEffect, useCallback } from 'react';
import { StoredDocument } from '../types';

const STORAGE_KEY = 'AI_CONTRACT_DRAFTER_DOCUMENTS';

export const useDocumentStore = () => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setDocuments(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load documents from storage:", error);
      setDocuments([]);
    }
  }, []);

  const saveToStorage = (docs: StoredDocument[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (error) {
      console.error("Failed to save documents to storage:", error);
    }
  };

  const saveDocument = useCallback((docToSave: StoredDocument) => {
    setDocuments(prevDocs => {
      const existingIndex = prevDocs.findIndex(doc => doc.id === docToSave.id);
      let newDocs;
      if (existingIndex > -1) {
        // Update existing document
        newDocs = [...prevDocs];
        newDocs[existingIndex] = { ...docToSave, updatedAt: new Date().toISOString() };
      } else {
        // Add new document
        const newDoc = { 
            ...docToSave, 
            createdAt: new Date().toISOString(), 
            updatedAt: new Date().toISOString() 
        };
        newDocs = [...prevDocs, newDoc];
      }
      saveToStorage(newDocs);
      return newDocs;
    });
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prevDocs => {
      const newDocs = prevDocs.filter(doc => doc.id !== id);
      saveToStorage(newDocs);
      return newDocs;
    });
  }, []);

  return { documents, saveDocument, deleteDocument };
};
