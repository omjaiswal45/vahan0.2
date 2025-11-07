# Notification System - Complete Guide

A production-ready notification system following **Big Tech UX patterns** for React Native with Expo.

## 🎯 Key Features

- ✅ **Contextual Permission Requests** - Never asks on first app open
- ✅ **Remote Push Notifications** - Full Expo push notification support
- ✅ **Local Notifications** - Schedule reminders and alerts
- ✅ **In-App Banner** - Shows notifications while app is open
- ✅ **Debug Panel** - Development tools for testing
- ✅ **TypeScript** - Fully typed for safety
- ✅ **Centralized Logging** - Track all notification events
- ✅ **Android Channels** - Proper channel management

## 📁 Project Structure

```
src/features/notifications/
├── hooks/
│   ├── useNotifications.ts          # Main remote push hook
│   └── useLocalNotifications.ts     # Local notification management
├── services/
│   └── notificationAPI.ts           # Backend API communication
├── components/
│   ├── NotificationBanner.tsx       # Foreground notification UI
│   ├── DebugPanel.tsx              # Development testing tool
│   └── PermissionPrimerModal.tsx   # Pre-permission dialog
├── utils/
│   ├── notificationLogger.ts        # Centralized logging
│   └── notificationHelpers.ts       # Utility functions
├── constants.ts                     # Configuration & constants
├── types.ts                         # TypeScript interfaces
└── index.ts                         # Module exports
```

## 🚀 Quick Start

### 1. Basic Integration (Already Done in App.tsx)

```tsx
import { useNotifications, NotificationBanner } from './src/features/notifications';

function App() {
  const {
    token,
    permissionStatus,
    lastNotification,
    registerForNotifications
  } = useNotifications({
    userId: 'user123', // Set after login
    autoRegister: false, // Don't auto-request
    onNotificationReceived: (notification) => {
      console.log('Received:', notification);
    },
    onNotificationTapped: (response) => {
      // Handle navigation
      console.log('Tapped:', response);
    },
  });

  return (
    <>
      <YourApp />
      <NotificationBanner notification={lastNotification} />
    </>
  );
}
```

## 📱 Big Tech Permission Pattern

### ❌ DON'T DO THIS (Bad UX):
```tsx
// Never ask on first app open!
useEffect(() => {
  registerForNotifications(); // ❌ BAD
}, []);
```

### ✅ DO THIS (Good UX):
```tsx
import { PermissionPrimerModal } from './src/features/notifications';

function YourScreen() {
  const [showPrimer, setShowPrimer] = useState(false);
  const { registerForNotifications, shouldAskForPermission } = useNotifications();

  // Show after meaningful user action
  const handleOrderComplete = async () => {
    // Order completed successfully

    // Check if we should ask for permission
    const shouldAsk = await shouldAskForPermission();
    if (shouldAsk) {
      setShowPrimer(true); // Show primer first
    }
  };

  return (
    <>
      <YourContent />

      <PermissionPrimerModal
        visible={showPrimer}
        context="AFTER_ORDER" // Contextual message
        onEnable={async () => {
          setShowPrimer(false);
          await registerForNotifications(); // Now ask system permission
        }}
        onSkip={() => setShowPrimer(false)}
      />
    </>
  );
}
```

## 🎯 When to Request Permission

Based on big tech patterns (Instagram, Twitter, Uber, etc.):

### ✅ Good Times to Ask:
1. **After first order/booking** - "Get delivery updates"
2. **After completing profile** - "Stay connected with updates"
3. **When user enables a feature** - "Get notified about new messages"
4. **After 2-3 app sessions** - Once user sees value
5. **In settings page** - User explicitly wants notifications

### ❌ Bad Times to Ask:
1. ❌ First app open (no context)
2. ❌ Before login
3. ❌ During critical user flows
4. ❌ Repeatedly after denial

## 🛠️ Common Use Cases

### 1. Request Permission After Login

```tsx
// In your login screen
const handleLoginSuccess = async (userId: string) => {
  // Save user session...

  // Check if we should ask for notifications
  const { shouldAskForPermission, registerForNotifications } = useNotifications();
  const shouldAsk = await shouldAskForPermission();

  if (shouldAsk) {
    // Show primer modal first
    setShowPermissionPrimer(true);
  }
};
```

### 2. Local Notifications (Reminders)

```tsx
import { useLocalNotifications } from './src/features/notifications';

function BookingScreen() {
  const { scheduleNotification, scheduleReminder } = useLocalNotifications();

  const handleBookingConfirmed = async (bookingTime: Date) => {
    // Schedule reminder 1 hour before
    const reminderTime = new Date(bookingTime.getTime() - 60 * 60 * 1000);
    const secondsUntilReminder = (reminderTime.getTime() - Date.now()) / 1000;

    await scheduleReminder(
      'Booking Reminder',
      'Your booking starts in 1 hour',
      secondsUntilReminder,
      { bookingId: '123', screen: 'BookingDetails' }
    );
  };

  return <YourBookingUI />;
}
```

### 3. Handle Notification Tap (Navigation)

```tsx
// In App.tsx
const { registerForNotifications } = useNotifications({
  onNotificationTapped: (response) => {
    const data = response.notification.request.content.data;

    // Navigate based on notification data
    if (data?.screen) {
      navigation.navigate(data.screen, data.params);
    }
  },
});
```

### 4. Update Token When User Logs In

```tsx
import { registerPushToken } from './src/features/notifications';

const handleLogin = async (userId: string) => {
  // ... login logic

  // Register push token with your backend
  const { token } = useNotifications();
  if (token) {
    await registerPushToken(userId, token);
  }
};
```

## 🧪 Testing & Debugging

### 1. Enable Debug Panel (Development Only)

Already integrated in App.tsx. To open it:

```tsx
// Add a debug button in your dev menu
<TouchableOpacity onPress={() => setShowDebugPanel(true)}>
  <Text>Open Notification Debug</Text>
</TouchableOpacity>
```

### 2. Send Test Notification

From Debug Panel:
1. Open debug panel
2. Copy your Expo Push Token
3. Enter title & body
4. Tap "Send Test Notification"

### 3. Check Logs

```tsx
import { notificationLogger } from './src/features/notifications';

// View all logs
const logs = notificationLogger.getLogs();
console.log(logs);

// View only errors
const errors = notificationLogger.getLogsByLevel('error');
console.log(errors);
```

## 🔧 Configuration

### Update Backend API URL

Edit `src/features/notifications/services/notificationAPI.ts`:

```tsx
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.com';
```

### Customize Permission Messages

Edit `src/features/notifications/constants.ts`:

```tsx
export const PERMISSION_PRIMER_MESSAGES = {
  AFTER_ORDER: {
    title: 'Track Your Order',
    message: 'Get real-time updates...',
    confirmText: 'Enable Notifications',
    cancelText: 'Skip',
  },
  // Add your custom contexts
};
```

### Android Notification Channels

Channels are auto-configured. To customize, edit `constants.ts`:

```tsx
export const CHANNEL_CONFIGS = {
  ALERT: {
    name: 'Important Alerts',
    importance: 5, // MAX
    sound: 'default',
    vibrationPattern: [0, 300, 300, 300],
  },
};
```

## 📤 Backend Integration

### 1. Register Device Token

When user enables notifications, send token to your backend:

```tsx
POST /api/notifications/register
{
  "userId": "user123",
  "token": "ExponentPushToken[...]",
  "deviceId": "device-id",
  "platform": "ios" | "android",
  "appVersion": "1.0.0"
}
```

### 2. Send Notification from Backend

Your backend sends to Expo Push Service:

```bash
POST https://exp.host/--/api/v2/push/send
Content-Type: application/json

{
  "to": "ExponentPushToken[...]",
  "title": "New Message",
  "body": "You have a new message",
  "data": {
    "screen": "Messages",
    "params": { "messageId": "123" }
  },
  "sound": "default",
  "priority": "high",
  "channelId": "message"
}
```

## 🎨 Customization

### Customize Notification Banner

Edit `src/features/notifications/components/NotificationBanner.tsx`:

```tsx
// Change colors, position, animation, etc.
const styles = StyleSheet.create({
  container: {
    top: Platform.OS === 'ios' ? 50 : 10, // Adjust position
    // ... your styles
  },
});
```

### Custom Permission Primer

Create your own primer modal or use the provided one with custom context:

```tsx
<PermissionPrimerModal
  context="PROMOTIONAL" // or AFTER_BOOKING, AFTER_ORDER, DEFAULT
  onEnable={handleEnable}
  onSkip={handleSkip}
/>
```

## 🔐 Environment Variables

Create `.env` file:

```bash
EXPO_PUBLIC_API_URL=https://your-backend.com
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
```

## 📊 Permission Flow Diagram

```
App Opens
    ↓
[NO permission request] ← Good!
    ↓
User takes meaningful action (order, booking, etc.)
    ↓
Check: Should ask? (app opens > 2, not asked recently)
    ↓
YES → Show PermissionPrimerModal (explains value)
    ↓
User taps "Enable"
    ↓
System Permission Dialog
    ↓
If GRANTED → Get Push Token → Register with Backend
    ↓
✅ Notifications Enabled
```

## 🐛 Troubleshooting

### Issue: "Not a physical device"
**Solution:** Push notifications only work on real devices, not simulators.

### Issue: No token received
**Solution:**
1. Check you're on a physical device
2. Check Expo project ID in app.json
3. Check permission was granted

### Issue: Permission denied
**Solution:**
1. User must go to device Settings → Your App → Enable Notifications
2. Don't ask too frequently (system blocks repeated requests)

### Issue: Notifications not showing in foreground
**Solution:** Check `NotificationBanner` is rendered in App.tsx

### Issue: Can't navigate on notification tap
**Solution:** Ensure navigation ref is accessible in `onNotificationTapped` handler

## 📝 Best Practices

1. ✅ **Always** show primer before system permission
2. ✅ **Always** explain value to user
3. ✅ **Wait** for meaningful user action
4. ✅ **Respect** user's decision (don't ask repeatedly)
5. ✅ **Test** on physical devices
6. ✅ **Log** everything for debugging
7. ✅ **Handle** all edge cases (denied, blocked, etc.)

## 🚀 Production Checklist

- [ ] Set correct `API_BASE_URL` in notificationAPI.ts
- [ ] Add your Expo Project ID to app.json
- [ ] Test on both iOS and Android physical devices
- [ ] Configure backend to receive & store tokens
- [ ] Configure backend to send via Expo Push API
- [ ] Test notification tap navigation
- [ ] Test foreground notifications (banner)
- [ ] Test background notifications
- [ ] Test permission denial flow
- [ ] Remove/disable debug panel for production
- [ ] Set up analytics for notification events

## 📚 Additional Resources

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [Android Notification Channels](https://developer.android.com/training/notify-user/channels)
- [iOS Notification Best Practices](https://developer.apple.com/design/human-interface-guidelines/notifications)

## 💡 Tips

- **iOS**: Requires Apple Developer account for production
- **Android**: Works immediately without extra setup
- **Expo Go**: Works with Expo Go app for testing
- **Production**: Use EAS Build for production apps

---

**Need Help?** Check the Debug Panel logs or console output for detailed error messages.
