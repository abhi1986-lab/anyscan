import React, { createContext, useContext, useState } from 'react';

export interface StructuredField {
  key: string;
  value: string;
}

interface AppContextType {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  extractedFields: StructuredField[];
  setExtractedFields: (fields: StructuredField[]) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  rawText: string | null;
  setRawText: (text: string | null) => void;
  updateField: (index: number, key: string, value: string) => void;
  addField: () => void;
  removeField: (index: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedFields, setExtractedFields] = useState<StructuredField[]>([]);
  const [documentType, setDocumentType] = useState<string>('Unknown');
  const [rawText, setRawText] = useState<string | null>(null);

  const updateField = (index: number, key: string, value: string) => {
    setExtractedFields(prev => {
      const newFields = [...prev];
      if (newFields[index]) {
        newFields[index] = { key, value };
      }
      return newFields;
    });
  };

  const addField = () => {
    setExtractedFields(prev => [...prev, { key: '', value: '' }]);
  };

  const removeField = (index: number) => {
    setExtractedFields(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <AppContext.Provider
      value={{
        imageUri,
        setImageUri,
        extractedFields,
        setExtractedFields,
        documentType,
        setDocumentType,
        rawText,
        setRawText,
        updateField,
        addField,
        removeField,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
