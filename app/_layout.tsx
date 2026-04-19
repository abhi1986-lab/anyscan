import { Stack } from 'expo-router';
import { AppProvider } from '../src/store/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: true, headerBackTitle: '', headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ title: 'Snap2Sheet' }} />
        <Stack.Screen name="preview" options={{ title: 'Preview' }} />
        <Stack.Screen name="processing" options={{ title: 'Processing', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="review" options={{ title: 'Review Data' }} />
        <Stack.Screen name="export" options={{ title: 'Success', headerShown: false, animation: 'slide_from_bottom' }} />
      </Stack>
    </AppProvider>
  );
}
