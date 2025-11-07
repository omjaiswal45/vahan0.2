# 🧪 Testing Notifications in Expo Go

## ⚠️ Important: Expo Go Limitations

Starting from **Expo SDK 53**, **remote push notifications are NOT supported in Expo Go**. You saw this warning:

```
WARN expo-notifications: Android Push notifications (remote notifications)
functionality was removed from Expo Go with the release of SDK 53.
```

## ✅ What WORKS in Expo Go

| Feature | Expo Go | Development Build |
|---------|---------|-------------------|
| **Local Notifications** | ✅ **Works!** | ✅ Works |
| Permission Requests | ✅ Works | ✅ Works |
| Notification Banner (UI) | ✅ Works | ✅ Works |
| Scheduled Notifications | ✅ Works | ✅ Works |
| **Remote Push Notifications** | ❌ **Removed** | ✅ Works |
| Push Tokens | ❌ Limited | ✅ Full Support |

## 🎯 How to Test RIGHT NOW (Expo Go)

### 1. **Test Local Notifications** (Works Now!)

I've added **3 test buttons** at the bottom-right of your app (in development mode):

#### Button 1: 🔔 Test Notification
- Tap this button
- **Immediately** sends a local notification
- Also schedules one for 5 seconds later
- ✅ **Works in Expo Go!**

#### Button 2: 🔧 Debug Panel
- Opens the debug panel
- View logs
- See notification history

#### Button 3: 📱 Request Permission
- Requests notification permission
- Shows current status
- Tracks permission state

### 2. **What You'll See:**

When you tap "🔔 Test Notification":
1. First notification appears **immediately**
2. In-app banner slides down (if app is open)
3. After 5 seconds, second notification appears
4. Check notification tray for both

### 3. **Test the Banner:**

- Keep app **open** (foreground)
- Tap "🔔 Test Notification"
- Banner slides down from top
- Shows title, body, and icon
- Auto-hides after 4 seconds
- Tap banner to interact

## 🚀 For Full Testing (Remote Push)

To test **remote push notifications**, you need a **development build**:

### Option A: EAS Build (Cloud, Easier)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for your device
eas build --profile development --platform android

# Wait 10-15 minutes, then install APK on device
```

### Option B: Local Build (Faster, but needs setup)

```bash
# Install dev client
npx expo install expo-dev-client

# Build locally (requires Android Studio/Xcode)
npx expo run:android  # Android
npx expo run:ios      # iOS (Mac only)
```

## 📋 Testing Checklist (Expo Go)

Test these features NOW in Expo Go:

- [x] Tap "🔔 Test Notification" button
- [x] Immediate notification appears
- [x] Scheduled notification (5 sec) appears
- [x] Banner shows when app is open
- [x] Tap banner to see interaction
- [x] Check notification tray
- [x] Tap "📱 Request Permission" button
- [x] Grant permission
- [x] Check permission status updates
- [x] Open "🔧 Debug Panel"
- [x] View logs

## 🐛 Troubleshooting

### "No notification appears"
1. Check device notification settings
2. Ensure permission is granted
3. Check console logs
4. Look in notification tray (swipe down)

### "Banner doesn't show"
1. Banner only shows when app is **open**
2. If app is closed/background, check notification tray
3. Check console for `📬 Notification received` log

### "Permission denied"
1. Go to device Settings → Your App → Notifications
2. Enable notifications
3. Restart app
4. Try "📱 Request Permission" again

## 💡 What Each Button Does

### 🔔 Test Notification
```javascript
// Sends immediately
presentNotificationNow(
  'Test Notification 🎉',
  'This local notification works in Expo Go!',
  { type: 'system', screen: 'Home' }
);

// Schedules for 5 seconds
scheduleNotification({
  title: 'Scheduled Test ⏰',
  body: 'This notification was scheduled 5 seconds ago',
  trigger: { seconds: 5 },
});
```

### 📱 Request Permission
```javascript
// Asks for notification permission
registerForNotifications();
// Updates permission status
// Works in Expo Go, but won't get remote push token
```

### 🔧 Debug Panel
- View all notification logs
- See permission status
- Check token (limited in Expo Go)
- View recent notifications

## 🎉 Next Steps

### Now (Expo Go):
1. Test local notifications ✅
2. Test permission flow ✅
3. Test UI components (banner) ✅
4. Build your features ✅

### Later (Production):
1. Create development build
2. Test remote push notifications
3. Test with backend
4. Deploy to stores

## 📚 Quick Reference

**Local Notifications (Works Now):**
```typescript
import { useLocalNotifications } from '@/features/notifications';

const { presentNotificationNow, scheduleNotification } = useLocalNotifications();

// Immediate
await presentNotificationNow('Title', 'Body', { type: 'system' });

// Scheduled
await scheduleNotification({
  title: 'Reminder',
  body: 'Your booking is soon!',
  trigger: { seconds: 3600 }, // 1 hour
});
```

**Remote Push (Needs Dev Build):**
```typescript
import { useNotifications } from '@/features/notifications';

const { registerForNotifications, token } = useNotifications();

// Request permission + get token
const pushToken = await registerForNotifications();
// Only works in development build!
```

## ✅ Summary

**Right Now (Expo Go):**
- ✅ Use the 3 test buttons at bottom-right
- ✅ Test local notifications
- ✅ Test permission requests
- ✅ Test UI components
- ✅ Build your app features

**For Production:**
- Create EAS development build
- Test remote push notifications
- Full functionality available

---

**The notification system is working correctly!** The warning is expected because Expo Go doesn't support remote push anymore. Use the test buttons to see everything in action! 🚀
