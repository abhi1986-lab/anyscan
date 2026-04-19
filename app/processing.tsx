import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../src/store/AppContext';

export default function ProcessingScreen() {
  const router = useRouter();
  const { imageUri, setExtractedFields, setRawText, setDocumentType } = useAppContext();
  const [stage, setStage] = useState('Extracting text...');

  useEffect(() => {
    const processImage = async () => {
      if (!imageUri) {
        router.replace('/');
        return;
      }

      try {
        setStage('Extracting text...');
        // Fetch blob from local URI (works for web and RN)
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('image', blob, 'document.jpg');

        setStage('Understanding document...');
        const apiRes = await fetch('http://localhost:3000/extract', {
          method: 'POST',
          body: formData,
        });

        if (!apiRes.ok) {
          throw new Error('Failed to extract data');
        }

        const data = await apiRes.json();
        
        setRawText(data.rawText || null);
        setDocumentType(data.documentType || 'Unknown Document');
        
        // Transform fields to structured fields if needed, or directly assign
        if (Array.isArray(data.fields)) {
          setExtractedFields(data.fields);
        } else {
          setExtractedFields([]);
        }

        router.replace('/review');
      } catch (error) {
        console.error('Extraction error:', error);
        Alert.alert('Processing Failed', 'Could not process the image.');
        router.replace('/preview');
      }
    };

    processImage();
  }, [imageUri]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>{stage}</Text>
        <Text style={styles.subtext}>Our Backend API is processing your document.</Text>
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
  },
  text: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  subtext: {
    marginTop: 8,
    fontSize: 16,
    color: '#8E8E93',
  },
});
