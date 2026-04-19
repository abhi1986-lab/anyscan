import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { useAppContext } from '../src/store/AppContext';

export default function ReviewScreen() {
  const router = useRouter();
  const { imageUri, extractedFields, documentType, rawText, updateField, addField, removeField } = useAppContext();
  const [showRaw, setShowRaw] = useState(false);
  const [exportFormat, setExportFormat] = useState('JSON');

  const handleExport = () => {
    // Basic format handling via routing / state could be passed to export screen, but for now we just push.
    router.push({ pathname: '/export', params: { format: exportFormat } });
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
            <Text style={styles.sectionTitle}>Document Structure</Text>
            <Text style={styles.docType}>Type: {documentType}</Text>
            
            {extractedFields.map((field, index) => (
              <View key={`field-${index}`} style={styles.inputGroup}>
                <View style={styles.fieldHeader}>
                  <TextInput
                    style={styles.keyInput}
                    value={field.key}
                    placeholder="Field Name"
                    onChangeText={(text) => updateField(index, text, field.value)}
                  />
                  <TouchableOpacity onPress={() => removeField(index)} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.valueInput}
                  value={field.value}
                  placeholder="Value"
                  multiline={true}
                  onChangeText={(text) => updateField(index, field.key, text)}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addField}>
              <Text style={styles.addButtonText}>+ Add Field</Text>
            </TouchableOpacity>

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

          <View style={styles.exportControls}>
            <Text style={styles.exportLabel}>Export Format:</Text>
            <View style={styles.formatSelectorRow}>
              {['JSON', 'CSV', 'TXT'].map((fmt) => (
                <TouchableOpacity 
                  key={fmt} 
                  style={[styles.formatBtn, exportFormat === fmt && styles.formatBtnActive]}
                  onPress={() => setExportFormat(fmt)}
                >
                  <Text style={[styles.formatBtnText, exportFormat === fmt && styles.formatBtnTextActive]}>{fmt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button title={`Export as ${exportFormat}`} onPress={handleExport} variant="primary" />
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
    marginBottom: 4,
    color: '#000',
  },
  docType: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#007AFF',
    paddingLeft: 12,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  keyInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 4,
  },
  removeBtn: {
    padding: 4,
  },
  removeBtnText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  valueInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 44,
  },
  addButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  collapsible: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  collapsibleText: {
    color: '#007AFF',
    fontSize: 14,
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
  exportControls: {
    marginBottom: 24,
  },
  exportLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  formatSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  formatBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
  },
  formatBtnActive: {
    backgroundColor: '#007AFF',
  },
  formatBtnText: {
    color: '#333',
    fontWeight: '500',
  },
  formatBtnTextActive: {
    color: '#FFF',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 40,
  },
});
