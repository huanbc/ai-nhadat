import { useState, useEffect, useCallback } from 'react';
import { DocumentTemplateKey, SubTemplateKey } from '../types';

const STORAGE_KEY = 'AI_CONTRACT_DRAFTER_CUSTOM_TEMPLATES';

export type CustomTemplates = {
    [key in DocumentTemplateKey]?: {
        [key in SubTemplateKey]?: string;
    };
};


export const useTemplateStore = () => {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplates>({});

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setCustomTemplates(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load custom templates from storage:", error);
      setCustomTemplates({});
    }
  }, []);

  const saveToStorage = (templates: CustomTemplates) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error("Failed to save custom templates to storage:", error);
    }
  };

  const saveTemplate = useCallback((templateKey: DocumentTemplateKey, subTemplateKey: SubTemplateKey, content: string) => {
    setCustomTemplates(prevTemplates => {
        const newTemplates = JSON.parse(JSON.stringify(prevTemplates)); // Deep copy
        if (!newTemplates[templateKey]) {
            newTemplates[templateKey] = {};
        }
        newTemplates[templateKey][subTemplateKey] = content;
        saveToStorage(newTemplates);
        return newTemplates;
    });
  }, []);


  return { customTemplates, saveTemplate };
};
