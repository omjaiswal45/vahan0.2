# Notification System - Usage Examples

Real-world examples for common scenarios in your app.

## 📱 Example 1: Request Permission After Booking

```tsx
// In your booking confirmation screen
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import {
  useNotifications,
  PermissionPrimerModal,
  useLocalNotifications
} from '@/features/notifications';

function BookingConfirmationScreen({ route }) {
  const { bookingId, bookingTime } = route.params;
  const [showPrimer, setShowPrimer] = useState(false);

  const {
    registerForNotifications,
    permissionStatus,
    shouldAskForPermission
  } = useNotifications();

  const { scheduleReminder } = useLocalNotifications();

  // After booking is confirmed, ask for notifications
  useEffect(() => {
    const checkPermission = async () => {
      if (permissionStatus === 'undetermined') {
        const shouldAsk = await shouldAskForPermission();
        if (shouldAsk) {
          // Show primer after 2 seconds (user sees confirmation first)
          setTimeout(() => setShowPrimer(true), 2000);
        }
      } else if (permissionStatus === 'granted') {
        // Already has permission, schedule reminder
        scheduleBookingReminder();
      }
    };

    checkPermission();
  }, []);

  const scheduleBookingReminder = async () => {
    // Schedule reminder 1 hour before booking
    const reminderTime = new Date(bookingTime);
    reminderTime.setHours(reminderTime.getHours() - 1);

    const secondsUntil = (reminderTime.getTime() - Date.now()) / 1000;

    if (secondsUntil > 0) {
      await scheduleReminder(
        'Upcoming Booking',
        'Your booking starts in 1 hour!',
        secondsUntil,
        {
          bookingId,
          screen: 'BookingDetails',
          params: { bookingId }
        }
      );
    }
  };

  const handleEnableNotifications = async () => {
    setShowPrimer(false);
    const token = await registerForNotifications();

    if (token) {
      // Permission granted! Schedule reminder
      await scheduleBookingReminder();
    }
  };

  return (
    <View>
      <Text>Booking Confirmed! ✅</Text>
      <Text>Booking ID: {bookingId}</Text>

      {/* Permission Primer Modal */}
      <PermissionPrimerModal
        visible={showPrimer}
        context="AFTER_BOOKING"
        onEnable={handleEnableNotifications}
        onSkip={() => setShowPrimer(false)}
      />
    </View>
  );
}

export default BookingConfirmationScreen;
```

## 🛒 Example 2: Request Permission After First Order

```tsx
// In your order success screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNotifications,
  PermissionPrimerModal
} from '@/features/notifications';

function OrderSuccessScreen({ route }) {
  const { orderId } = route.params;
  const [showPrimer, setShowPrimer] = useState(false);

  const { registerForNotifications, permissionStatus } = useNotifications();

  useEffect(() => {
    checkFirstOrder();
  }, []);

  const checkFirstOrder = async () => {
    // Check if this is user's first order
    const hasOrdered = await AsyncStorage.getItem('@has_ordered_before');

    if (!hasOrdered && permissionStatus === 'undetermined') {
      // First order! Perfect time to ask for notifications
      await AsyncStorage.setItem('@has_ordered_before', 'true');
      setTimeout(() => setShowPrimer(true), 1500);
    }
  };

  const handleEnableNotifications = async () => {
    setShowPrimer(false);
    await registerForNotifications();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Placed! 🎉</Text>
      <Text>Order #{orderId}</Text>
      <Text>You'll receive updates via email</Text>

      <PermissionPrimerModal
        visible={showPrimer}
        context="AFTER_ORDER"
        onEnable={handleEnableNotifications}
        onSkip={() => setShowPrimer(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default OrderSuccessScreen;
```

## 👤 Example 3: Settings Screen with Manual Toggle

```tsx
// In your settings screen
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { useNotifications } from '@/features/notifications';
import { Linking } from 'react-native';

function NotificationSettingsScreen() {
  const {
    permissionStatus,
    registerForNotifications,
    token,
  } = useNotifications();

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(permissionStatus === 'granted');
  }, [permissionStatus]);

  const handleToggle = async (value: boolean) => {
    if (value) {
      // User wants to enable
      if (permissionStatus === 'denied') {
        // Already denied - must go to settings
        Alert.alert(
          'Notifications Disabled',
          'Please enable notifications in your device settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        // Request permission
        const result = await registerForNotifications();
        if (result) {
          setIsEnabled(true);
          Alert.alert('Success', 'Notifications enabled!');
        }
      }
    } else {
      // User wants to disable
      Alert.alert(
        'Disable Notifications',
        'You can disable notifications in your device settings',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>

      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Push Notifications</Text>
          <Text style={styles.sublabel}>
            {permissionStatus === 'granted'
              ? 'Enabled - You\'ll receive updates'
              : permissionStatus === 'denied'
              ? 'Denied - Enable in device settings'
              : 'Tap to enable'}
          </Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: '#767577', true: '#4ECDC4' }}
          thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
        />
      </View>

      {token && (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>Device Token:</Text>
          <Text style={styles.tokenText} numberOfLines={1}>
            {token.substring(0, 30)}...
          </Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ️ Notifications help you stay updated on orders, bookings, and important alerts.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  sublabel: {
    fontSize: 13,
    color: '#666',
  },
  tokenContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  tokenLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});

export default NotificationSettingsScreen;
```

## 🔔 Example 4: Handling Notification Tap Navigation

```tsx
// In App.tsx or root navigation component
import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNotifications } from '@/features/notifications';

function AppWithNotifications() {
  const navigationRef = useRef<any>();

  const { registerForNotifications } = useNotifications({
    onNotificationTapped: (response) => {
      const data = response.notification.request.content.data;

      // Wait for navigation to be ready
      if (navigationRef.current?.isReady()) {
        handleNotificationNavigation(data);
      }
    },
  });

  const handleNotificationNavigation = (data: any) => {
    if (!data?.screen) return;

    switch (data.screen) {
      case 'OrderDetails':
        navigationRef.current?.navigate('Orders', {
          screen: 'OrderDetails',
          params: { orderId: data.params?.orderId },
        });
        break;

      case 'BookingDetails':
        navigationRef.current?.navigate('Bookings', {
          screen: 'BookingDetails',
          params: { bookingId: data.params?.bookingId },
        });
        break;

      case 'Messages':
        navigationRef.current?.navigate('Messages', {
          params: { messageId: data.params?.messageId },
        });
        break;

      case 'Profile':
        navigationRef.current?.navigate('Profile');
        break;

      default:
        navigationRef.current?.navigate('Home');
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      {/* Your navigation */}
    </NavigationContainer>
  );
}
```

## ⏰ Example 5: Schedule Daily Reminder

```tsx
// In a reminder/alarm feature
import React, { useState } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalNotifications } from '@/features/notifications';

function DailyReminderScreen() {
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { scheduleDailyNotification, cancelAllNotifications } = useLocalNotifications();

  const handleSetReminder = async () => {
    const hour = reminderTime.getHours();
    const minute = reminderTime.getMinutes();

    const notificationId = await scheduleDailyNotification(
      'Daily Reminder',
      'Time for your daily check-in!',
      hour,
      minute,
      { type: 'daily_reminder' }
    );

    if (notificationId) {
      alert('Daily reminder set! ✅');
    } else {
      alert('Failed to set reminder');
    }
  };

  const handleCancelAll = async () => {
    await cancelAllNotifications();
    alert('All reminders cancelled');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Set Daily Reminder
      </Text>

      <Button
        title={`Selected Time: ${reminderTime.toLocaleTimeString()}`}
        onPress={() => setShowPicker(true)}
      />

      {showPicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          is24Hour={false}
          onChange={(event, selectedDate) => {
            setShowPicker(Platform.OS === 'ios');
            if (selectedDate) {
              setReminderTime(selectedDate);
            }
          }}
        />
      )}

      <Button title="Set Reminder" onPress={handleSetReminder} />
      <Button title="Cancel All Reminders" onPress={handleCancelAll} />
    </View>
  );
}

export default DailyReminderScreen;
```

## 🧪 Example 6: Testing with Debug Button

```tsx
// Add this to any screen during development
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { DebugPanel, useNotifications, sendTestNotification } from '@/features/notifications';

function DevTestScreen() {
  const [showDebug, setShowDebug] = useState(false);
  const { token, permissionStatus } = useNotifications();

  const sendQuickTest = async () => {
    if (token) {
      const result = await sendTestNotification(
        token,
        'Test from App',
        'This is a quick test notification'
      );
      alert(result.success ? 'Sent!' : 'Failed');
    } else {
      alert('No token available');
    }
  };

  if (!__DEV__) return null; // Only in development

  return (
    <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
      <Button title="🔧 Debug Panel" onPress={() => setShowDebug(true)} />
      <Button title="📤 Send Test" onPress={sendQuickTest} />

      <DebugPanel
        pushToken={token}
        permissionStatus={permissionStatus}
        visible={showDebug}
        onClose={() => setShowDebug(false)}
      />
    </View>
  );
}

export default DevTestScreen;
```

## 🎯 Example 7: Register Token After Login

```tsx
// In your login screen
import React from 'react';
import { useNotifications, registerPushToken } from '@/features/notifications';

function LoginScreen() {
  const { token, registerForNotifications } = useNotifications();

  const handleLoginSuccess = async (userId: string) => {
    // ... your login logic

    // If user already has permission, register token
    if (token) {
      const result = await registerPushToken(userId, token);
      if (result.success) {
        console.log('Token registered with backend');
      }
    } else {
      // Request permission if not granted yet
      const newToken = await registerForNotifications();
      if (newToken) {
        await registerPushToken(userId, newToken);
      }
    }

    // Navigate to home
  };

  return (
    // Your login UI
    <></>
  );
}
```

## 📊 Example 8: Track Notification Analytics

```tsx
// Track notification events
import { notificationLogger } from '@/features/notifications';
import analytics from '@/services/analytics'; // Your analytics service

function setupNotificationAnalytics() {
  // Track in your notification handlers
  const { registerForNotifications } = useNotifications({
    onNotificationReceived: (notification) => {
      notificationLogger.logNotificationReceived(notification, true);

      // Track in your analytics
      analytics.track('notification_received', {
        title: notification.request.content.title,
        type: notification.request.content.data?.type,
      });
    },

    onNotificationTapped: (response) => {
      const data = response.notification.request.content.data;

      // Track tap event
      analytics.track('notification_tapped', {
        screen: data?.screen,
        type: data?.type,
      });
    },
  });
}
```

---

## 💡 Quick Tips

1. **Always test on physical devices** - Simulators don't support push notifications
2. **Use PermissionPrimerModal** - Never show system dialog directly
3. **Be contextual** - Ask after meaningful actions
4. **Respect denials** - Don't ask repeatedly
5. **Test both foreground and background** - Different user experiences
6. **Handle navigation properly** - Use refs for deep linking
7. **Log everything** - Use notificationLogger for debugging

## 🐛 Common Mistakes to Avoid

❌ Asking on app launch
❌ Not explaining value to user
❌ Ignoring permission status
❌ Not testing on real devices
❌ Forgetting to handle navigation
❌ Not setting up backend properly
❌ Not handling errors

✅ Follow the examples above for success!
