
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { store, persistor } from './src/store/store';
import AppStatusBar from './src/components/AppStatusBar';
import { ActivityIndicator, View, Platform, LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';
import { clearVehicleNumber } from './src/store/slices/vehicleSlice';
import { clearInsuranceData, clearBadgeState as clearInsuranceBadge } from './src/store/slices/carInsuranceSlice';
import { clearChallanData, clearBadgeState as clearChallanBadge } from './src/store/slices/challanCheckSlice';
import { useNotifications, NotificationBanner } from './src/features/notifications';

// Suppress Expo Go notification warnings (only affects development)
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
]);

// Suppress console errors for Expo Go push notification limitations (development only)
if (__DEV__) {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('expo-notifications: Android Push notifications') ||
       args[0].includes('expo-notifications` functionality is not fully supported'))
    ) {
      // Suppress this specific error in development
      return;
    }
    originalError(...args);
  };
}

// Set to true to clear vehicle data on every app start (for development/testing)
const CLEAR_VEHICLE_ON_START = true;
// Set to true to clear notification badges on every app start (for testing)
const CLEAR_BADGES_ON_START = true;

// Inner component that has access to dispatch
function AppContent() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  // Initialize notifications
  const { lastNotification } = useNotifications({
    userId: undefined,
    autoRegister: false,
    onNotificationReceived: (notification) => {
      console.log('📬 Notification received:', notification);
    },
    onNotificationTapped: (response) => {
      console.log('👆 Notification tapped:', response);
      const data = response.notification.request.content.data;
      if (data?.screen) {
        console.log('Navigate to:', data.screen, data.params);
      }
    },
  });

  useEffect(() => {
    const setupNotificationChannels = async () => {
      if (Platform.OS === 'android') {
        try {
          // Create default notification channel for Android
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Default Notifications',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#ff1ea5',
            sound: 'default',
            enableVibrate: true,
            enableLights: true,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            showBadge: true,
          });

          // Create wishlist channel
          await Notifications.setNotificationChannelAsync('wishlist', {
            name: 'Wishlist Notifications',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#ff1ea5',
            sound: 'default',
            enableVibrate: true,
            enableLights: true,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            showBadge: true,
          });

          console.log('✅ Android notification channels configured');
        } catch (error) {
          console.error('Failed to setup Android channels:', error);
        }
      }
    };

    setupNotificationChannels();

    if (__DEV__) {
      // Clear states for testing in development mode
      if (CLEAR_VEHICLE_ON_START) {
        dispatch(clearVehicleNumber());
      }
      if (CLEAR_BADGES_ON_START) {
        // Clear both the data and badge states
        dispatch(clearInsuranceData());
        dispatch(clearInsuranceBadge());
        dispatch(clearChallanData());
        dispatch(clearChallanBadge());
        console.log('🧪 Testing Mode: Insurance and Challan data cleared');
      }
    }
    setIsReady(true);
  }, [dispatch]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff1ea5" />
      </View>
    );
  }

  return (
    <>
      <AppStatusBar />

      {/* Main Navigation */}
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>

      {/* In-App Notification Banner */}
      <NotificationBanner
        notification={lastNotification}
        onPress={(notification) => {
          console.log('Banner tapped:', notification);
          const data = notification.request.content.data;
          if (data?.screen) {
            console.log('Navigate to:', data.screen);
          }
        }}
        onDismiss={() => {
          // Clear notification
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#ff1ea5" />
            </View>
          }
          persistor={persistor}
        >
          <AppContent />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
