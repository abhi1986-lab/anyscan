import React, { createContext, useContext, useState } from 'react';

export interface ExtractionFields {
  vendor: string;
  date: string;
  totalAmount: string;
  tax: string;
}

interface AppContextType {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  extractedFields: ExtractionFields | null;
  setExtractedFields: (fields: ExtractionFields | null) => void;
  rawText: string | null;
  setRawText: (text: string | null) => void;
  updateField: (key: keyof ExtractionFields, value: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedFields, setExtractedFields] = useState<ExtractionFields | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);

  const updateField = (key: keyof ExtractionFields, value: string) => {
    if (extractedFields) {
      setExtractedFields({ ...extractedFields, [key]: value });
    }
  };

  return (
    <AppContext.Provider
      value={{
        imageUri,
        setImageUri,
        extractedFields,
        setExtractedFields,
        rawText,
        setRawText,
        updateField,
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
