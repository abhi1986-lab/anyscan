import React, { createContext, useContext, useState } from 'react';
import { JobStatus } from '../types/api';

export interface StructuredField {
  key: string;
  value: string;
  confidence?: number;
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
  jobId: string | null;
  setJobId: (id: string | null) => void;
  jobStatus: JobStatus | null;
  setJobStatus: (status: JobStatus | null) => void;
  progress: number;
  setProgress: (value: number) => void;
  stageMessage: string | null;
  setStageMessage: (value: string | null) => void;
  processingError: string | null;
  setProcessingError: (value: string | null) => void;
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
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [stageMessage, setStageMessage] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const updateField = (index: number, key: string, value: string) => {
    setExtractedFields((prev) => {
      const newFields = [...prev];
      if (newFields[index]) {
        newFields[index] = { ...newFields[index], key, value };
      }
      return newFields;
    });
  };

  const addField = () => {
    setExtractedFields((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeField = (index: number) => {
    setExtractedFields((prev) => prev.filter((_, i) => i !== index));
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
        jobId,
        setJobId,
        jobStatus,
        setJobStatus,
        progress,
        setProgress,
        stageMessage,
        setStageMessage,
        processingError,
        setProcessingError,
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
