import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { useAppContext } from '../src/store/AppContext';

export default function ReviewScreen() {
  const router = useRouter();
  const { imageUri, extractedFields, rawText, updateField } = useAppContext();
  const [showRaw, setShowRaw] = useState(false);

  const handleExport = () => {
    router.push('/export');
  };

  const fields = extractedFields || {
    vendor: '',
    date: '',
    totalAmount: '',
    tax: '',
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.imageContainer}>
             {imageUri ? (
               <Image source={{ uri: imageUri }} style={styles.thumbnail} resizeMode="cover" />
             ) : (
               <View style={[styles.thumbnail, { backgroundColor: '#ccc' }]} />
             )}
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Extracted Fields</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vendor</Text>
              <TextInput
                style={styles.input}
                value={fields.vendor}
                onChangeText={(text) => updateField('vendor', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                value={fields.date}
                onChangeText={(text) => updateField('date', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Amount</Text>
              <TextInput
                style={styles.input}
                value={fields.totalAmount}
                keyboardType="numeric"
                onChangeText={(text) => updateField('totalAmount', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tax</Text>
              <TextInput
                style={styles.input}
                value={fields.tax}
                onChangeText={(text) => updateField('tax', text)}
              />
            </View>
          </View>

          {rawText ? (
            <>
              <TouchableOpacity style={styles.collapsible} onPress={() => setShowRaw(!showRaw)}>
                <Text style={styles.collapsibleText}>
                  {showRaw ? 'Hide Raw Text' : 'Show Raw Text'}
                </Text>
              </TouchableOpacity>

              {showRaw && (
                <View style={styles.rawTextContainer}>
                  <Text style={styles.rawText}>{rawText}</Text>
                </View>
              )}
            </>
          ) : null}

          <View style={styles.buttonContainer}>
            <Button title="Export CSV" onPress={handleExport} variant="primary" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  thumbnail: {
    width: 120,
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  collapsible: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  collapsibleText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  rawTextContainer: {
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  rawText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 8,
  },
});
