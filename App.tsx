
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { store, persistor } from './src/store/store';
import AppStatusBar from './src/components/AppStatusBar';
import { ActivityIndicator, View } from 'react-native';
import { clearVehicleNumber } from './src/store/slices/vehicleSlice';
import { useNotifications, NotificationBanner, DebugPanel } from './src/features/notifications';

// Set to true to clear vehicle data on every app start (for development/testing)
const CLEAR_VEHICLE_ON_START = true;

// Inner component that has access to dispatch
function AppContent() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Initialize notifications (follows big tech pattern - doesn't auto-request)
  const {
    token,
    permissionStatus,
    lastNotification,
  } = useNotifications({
    userId: undefined, // Set this to actual userId when user logs in
    autoRegister: false, // Don't auto-register - wait for contextual moment
    onNotificationReceived: (notification) => {
      console.log('📬 Notification received:', notification);
    },
    onNotificationTapped: (response) => {
      console.log('👆 Notification tapped:', response);
      // Handle navigation based on notification data
      const data = response.notification.request.content.data;
      if (data?.screen) {
        // Navigate to specific screen
        console.log('Navigate to:', data.screen, data.params);
      }
    },
  });

  useEffect(() => {
    if (CLEAR_VEHICLE_ON_START && __DEV__) {
      // Dispatch action to clear vehicle state for testing
      dispatch(clearVehicleNumber());
      setIsReady(true);
    } else {
      setIsReady(true);
    }
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

      {/* In-App Notification Banner (shows when notification received in foreground) */}
      <NotificationBanner
        notification={lastNotification}
        onPress={(notification) => {
          console.log('Banner tapped:', notification);
          const data = notification.request.content.data;
          if (data?.screen) {
            // Handle navigation
            console.log('Navigate to:', data.screen);
          }
        }}
        onDismiss={() => {
          // Clear notification
        }}
      />

      {/* Debug Panel (only in development) */}
      {__DEV__ && (
        <DebugPanel
          pushToken={token}
          permissionStatus={permissionStatus}
          visible={showDebugPanel}
          onClose={() => setShowDebugPanel(false)}
        />
      )}
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
