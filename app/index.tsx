import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { useAppContext } from '../src/store/AppContext';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const router = useRouter();
  const { setImageUri } = useAppContext();

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera was denied");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        router.push('/preview');
      }
    } catch (e) {
      console.warn(e);
      setImageUri('https://dummyimage.com/600x800/ccc/000.png&text=Mock+Receipt');
      router.push('/preview');
    }
  };

  const handleUploadImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission to access files was denied");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        router.push('/preview');
      }
    } catch (e) {
      console.warn(e);
      setImageUri('https://dummyimage.com/600x800/ccc/000.png&text=Mock+Receipt');
      router.push('/preview');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Snap2Sheet</Text>
        <Text style={styles.subtitle}>Digitize your receipts and documents instantly</Text>
        
        <View style={styles.buttonContainer}>
          <Button title="Take Photo" onPress={handleTakePhoto} variant="primary" />
          <Button title="Upload Image" onPress={handleUploadImage} variant="secondary" />
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
});
