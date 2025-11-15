import { useState, useEffect, useCallback } from 'react';
import { StoredAnalyzedDocument } from '../types';

const STORAGE_KEY = 'AI_ANALYZED_DOCUMENTS';

export const useAnalyzedDocumentStore = () => {
  const [analyzedDocuments, setAnalyzedDocuments] = useState<StoredAnalyzedDocument[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setAnalyzedDocuments(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load analyzed documents from storage:", error);
      setAnalyzedDocuments([]);
    }
  }, []);

  const saveToStorage = (docs: StoredAnalyzedDocument[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (error) {
      console.error("Failed to save analyzed documents to storage:", error);
    }
  };

  const addAnalyzedDocument = useCallback((fileName: string, analysisContent: string) => {
    setAnalyzedDocuments(prevDocs => {
      const newDoc: StoredAnalyzedDocument = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        fileName,
        analysisContent,
      };
      // Add to the top of the list
      const newDocs = [newDoc, ...prevDocs];
      saveToStorage(newDocs);
      return newDocs;
    });
  }, []);

  const deleteAnalyzedDocument = useCallback((id: string) => {
    setAnalyzedDocuments(prevDocs => {
      const newDocs = prevDocs.filter(doc => doc.id !== id);
      saveToStorage(newDocs);
      return newDocs;
    });
  }, []);

  return { analyzedDocuments, addAnalyzedDocument, deleteAnalyzedDocument };
};
