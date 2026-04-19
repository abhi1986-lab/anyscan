import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { useAppContext } from '../src/store/AppContext';

export default function ExportScreen() {
  const router = useRouter();
  const { setImageUri, setExtractedFields, setRawText } = useAppContext();

  const handleDownload = () => {
    Alert.alert('Download Started', 'Your CSV file is being saved.');
  };

  const handleShare = () => {
    Alert.alert('Share Sheet', 'Mocking native share sheet...');
  };

  const handleScanAnother = () => {
    setImageUri(null);
    setExtractedFields(null);
    setRawText(null);
    router.dismissAll();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✅</Text>
        </View>
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.subtitle}>Your data is ready to be exported.</Text>
        
        <View style={styles.buttonContainer}>
          <Button title="Download CSV" onPress={handleDownload} variant="primary" />
          <Button title="Share" onPress={handleShare} variant="outline" />
        </View>
        
        <View style={styles.bottomContainer}>
           <Button title="Scan Another Document" onPress={handleScanAnother} variant="secondary" />
        </View>
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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E4F8EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 48,
  },
  bottomContainer: {
    width: '100%',
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
  }
});
