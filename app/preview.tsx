import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { useAppContext } from '../src/store/AppContext';

export default function PreviewScreen() {
  const router = useRouter();
  const { imageUri } = useAppContext();

  const handleExtractData = () => {
    router.push('/processing');
  };

  const handleRetake = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No Image Selected</Text>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Extract Data" onPress={handleExtractData} variant="primary" />
          <Button title="Choose Another" onPress={handleRetake} variant="secondary" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dar background for preview
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  placeholderText: {
    color: '#8E8E93',
  },
  buttonContainer: {
    gap: 16,
  },
});
