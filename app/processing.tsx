import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../src/store/AppContext';
import { uploadFile } from '../src/services/uploadService';
import { createJob, getJobStatus, getJobResult } from '../src/services/jobService';

export default function ProcessingScreen() {
  const router = useRouter();
  const {
    imageUri,
    setExtractedFields,
    setRawText,
    setDocumentType,
    setJobId,
    setJobStatus,
    setProgress,
    setStageMessage,
    setProcessingError,
  } = useAppContext();

  const [localStage, setLocalStage] = useState('Uploading document...');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function startProcessing() {
      if (!imageUri) {
        router.replace('/');
        return;
      }

      try {
        setProcessingError(null);
        setLocalStage('Uploading document...');
        setStageMessage('Uploading document...');
        setProgress(5);

        const upload = await uploadFile(imageUri);
        if (!isMounted) return;

        setLocalStage('Creating job...');
        setStageMessage('Creating job...');
        setProgress(10);

        const job = await createJob(upload.uploadId);
        if (!isMounted) return;

        setJobId(job.jobId);
        setJobStatus(job.status);

        pollingRef.current = setInterval(async () => {
          try {
            const status = await getJobStatus(job.jobId);
            if (!isMounted) return;

            setJobStatus(status.status);
            setProgress(status.progress ?? 0);
            setStageMessage(status.stageMessage ?? null);
            setLocalStage(status.stageMessage || 'Processing...');

            if (status.status === 'completed') {
              if (pollingRef.current) clearInterval(pollingRef.current);

              const result = await getJobResult(job.jobId);
              if (!isMounted) return;

              setRawText(result.rawText || null);
              setDocumentType(result.documentType || 'Unknown');
              setExtractedFields(result.fields || []);

              router.replace('/review');
            }

            if (status.status === 'failed') {
              if (pollingRef.current) clearInterval(pollingRef.current);

              const message = status.errorMessage || 'Document processing failed.';
              setProcessingError(message);
              Alert.alert('Processing Failed', message, [
                { text: 'Back', onPress: () => router.replace('/preview') },
              ]);
            }
          } catch {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setProcessingError('Could not fetch processing status.');
            Alert.alert('Error', 'Could not fetch processing status.', [
              { text: 'Back', onPress: () => router.replace('/preview') },
            ]);
          }
        }, 2000);
      } catch {
        setProcessingError('Could not start processing.');
        Alert.alert('Error', 'Could not start processing.', [
          { text: 'Back', onPress: () => router.replace('/preview') },
        ]);
      }
    }

    startProcessing();

    return () => {
      isMounted = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [imageUri, router, setDocumentType, setExtractedFields, setJobId, setJobStatus, setProcessingError, setProgress, setRawText, setStageMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>{localStage}</Text>
        <Text style={styles.subtext}>Your document is being processed securely.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  subtext: {
    marginTop: 8,
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
