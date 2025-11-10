/**
 * Notification Test Screen
 * Debug screen to test both local and push notifications
 * Only available in development mode
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/useNotifications';
import { useLocalNotifications } from '../hooks/useLocalNotifications';
import { NotificationMessages } from '../notificationMessages';
import { sendTestNotification } from '../services/notificationAPI';

export const NotificationTestScreen: React.FC = () => {
  const {
    token,
    permissionStatus,
    registerForNotifications,
    requestPermission,
  } = useNotifications();

  const {
    presentNotificationNow,
    scheduleNotification,
    scheduleReminder,
    getAllScheduledNotifications,
    cancelAllNotifications,
  } = useLocalNotifications();

  const [testing, setTesting] = useState(false);

  const copyToken = () => {
    if (token) {
      Clipboard.setString(token);
      Alert.alert('✅ Copied!', 'Push token copied to clipboard');
    }
  };

  const testLocalNotification = async () => {
    setTesting(true);
    try {
      const notification = NotificationMessages.ADDED_TO_WISHLIST;
      await presentNotificationNow(
        notification.title('Honda', 'City'),
        notification.body(),
        { type: 'test', screen: 'Home' }
      );
      Alert.alert('✅ Success', 'Local notification sent!');
    } catch (error) {
      Alert.alert('❌ Error', `Failed: ${error}`);
    }
    setTesting(false);
  };

  const testWishlistNotification = async () => {
    setTesting(true);
    try {
      const notification = NotificationMessages.ADDED_TO_WISHLIST;
      await presentNotificationNow(
        notification.title('Maruti', 'Swift'),
        notification.body(),
        { type: 'wishlist', screen: 'SavedCars' }
      );
      Alert.alert('✅ Success', 'Wishlist notification sent!');
    } catch (error) {
      Alert.alert('❌ Error', `Failed: ${error}`);
    }
    setTesting(false);
  };

  const testListingNotification = async () => {
    setTesting(true);
    try {
      const notification = NotificationMessages.LISTING_SUBMITTED;
      await presentNotificationNow(
        notification.title('Hyundai', 'Creta'),
        notification.body('Hyundai', 'Creta'),
        { type: 'alert', screen: 'DealerListings' }
      );
      Alert.alert('✅ Success', 'Listing notification sent!');
    } catch (error) {
      Alert.alert('❌ Error', `Failed: ${error}`);
    }
    setTesting(false);
  };

  const testScheduledNotification = async () => {
    setTesting(true);
    try {
      await scheduleReminder(
        '⏰ Scheduled Test',
        'This notification was scheduled 5 seconds ago!',
        5,
        { type: 'test' }
      );
      Alert.alert('✅ Scheduled', 'Will appear in 5 seconds!');
    } catch (error) {
      Alert.alert('❌ Error', `Failed: ${error}`);
    }
    setTesting(false);
  };

  const testPushNotification = async () => {
    if (!token) {
      Alert.alert('❌ No Token', 'Push token not available. Register first!');
      return;
    }

    setTesting(true);
    try {
      const result = await sendTestNotification(
        token,
        '🚀 Push Notification Test',
        'If you see this, push notifications are working!'
      );

      if (result.success) {
        Alert.alert(
          '✅ Sent!',
          'Push notification sent. Check your device in a few seconds!'
        );
      } else {
        Alert.alert('❌ Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('❌ Error', `Failed: ${error}`);
    }
    setTesting(false);
  };

  const viewScheduledNotifications = async () => {
    try {
      const notifications = await getAllScheduledNotifications();
      if (notifications.length === 0) {
        Alert.alert('ℹ️ No Scheduled Notifications', 'You have no scheduled notifications');
      } else {
        Alert.alert(
          'Scheduled Notifications',
          `You have ${notifications.length} scheduled notification(s)`
        );
      }
    } catch (error) {
      Alert.alert('❌ Error', `Failed: ${error}`);
    }
  };

  const clearAllScheduled = async () => {
    Alert.alert(
      'Clear All?',
      'Are you sure you want to cancel all scheduled notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await cancelAllNotifications();
            Alert.alert('✅ Cleared', 'All scheduled notifications cleared');
          },
        },
      ]
    );
  };

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return '#10b981';
      case 'denied':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'checkmark-circle';
      case 'denied':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="notifications" size={48} color="#ff1ea5" />
        <Text style={styles.title}>Notification Testing</Text>
        <Text style={styles.subtitle}>Test local and push notifications</Text>
      </View>

      {/* Permission Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permission Status</Text>
        <View style={[styles.statusCard, { borderLeftColor: getStatusColor() }]}>
          <Ionicons name={getStatusIcon()} size={32} color={getStatusColor()} />
          <View style={styles.statusContent}>
            <Text style={styles.statusText}>{permissionStatus.toUpperCase()}</Text>
            <Text style={styles.statusSubtext}>
              {permissionStatus === 'granted'
                ? 'Notifications enabled'
                : permissionStatus === 'denied'
                ? 'Notifications blocked'
                : 'Permission not requested'}
            </Text>
          </View>
        </View>

        {permissionStatus !== 'granted' && (
          <TouchableOpacity
            style={styles.button}
            onPress={requestPermission}
            disabled={testing}
          >
            <Ionicons name="key" size={20} color="#fff" />
            <Text style={styles.buttonText}>Request Permission</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Push Token */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Push Token</Text>
        {token ? (
          <>
            <View style={styles.tokenCard}>
              <Text style={styles.tokenLabel}>Expo Push Token:</Text>
              <Text style={styles.tokenText} numberOfLines={2}>
                {token}
              </Text>
            </View>
            <TouchableOpacity style={styles.buttonSecondary} onPress={copyToken}>
              <Ionicons name="copy" size={20} color="#ff1ea5" />
              <Text style={styles.buttonSecondaryText}>Copy Token</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.noTokenText}>No push token available</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={registerForNotifications}
              disabled={testing}
            >
              <Ionicons name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.buttonText}>Register for Push</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Local Notifications Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Local Notifications (Works in Expo Go)</Text>

        <TestButton
          icon="heart"
          title="Test Wishlist Notification"
          subtitle="Simulates adding car to wishlist"
          onPress={testWishlistNotification}
          disabled={testing}
          color="#e11d48"
        />

        <TestButton
          icon="car"
          title="Test Listing Submitted"
          subtitle="Simulates dealer submitting listing"
          onPress={testListingNotification}
          disabled={testing}
          color="#8b5cf6"
        />

        <TestButton
          icon="notifications"
          title="Test Basic Notification"
          subtitle="Simple test notification"
          onPress={testLocalNotification}
          disabled={testing}
          color="#3b82f6"
        />

        <TestButton
          icon="time"
          title="Test Scheduled (5 sec)"
          subtitle="Notification appears in 5 seconds"
          onPress={testScheduledNotification}
          disabled={testing}
          color="#f59e0b"
        />
      </View>

      {/* Push Notifications Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Push Notifications (Needs Dev Build)</Text>

        <View style={styles.warningCard}>
          <Ionicons name="warning" size={24} color="#f59e0b" />
          <Text style={styles.warningText}>
            Push notifications don't work in Expo Go! You need a development build.
          </Text>
        </View>

        <TestButton
          icon="rocket"
          title="Send Test Push Notification"
          subtitle="Test remote push notification"
          onPress={testPushNotification}
          disabled={testing || !token}
          color="#10b981"
        />
      </View>

      {/* Scheduled Notifications Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗓️ Scheduled Notifications</Text>

        <TestButton
          icon="list"
          title="View Scheduled"
          subtitle="See all scheduled notifications"
          onPress={viewScheduledNotifications}
          disabled={testing}
          color="#6366f1"
        />

        <TestButton
          icon="trash"
          title="Clear All Scheduled"
          subtitle="Cancel all scheduled notifications"
          onPress={clearAllScheduled}
          disabled={testing}
          color="#ef4444"
        />
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#3b82f6" />
        <Text style={styles.infoText}>
          See NOTIFICATION_TESTING_GUIDE.md for complete testing instructions
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

interface TestButtonProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled: boolean;
  color: string;
}

const TestButton: React.FC<TestButtonProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  disabled,
  color,
}) => (
  <TouchableOpacity
    style={[styles.testButton, disabled && styles.testButtonDisabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <View style={[styles.testIconWrapper, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <View style={styles.testContent}>
      <Text style={styles.testTitle}>{title}</Text>
      <Text style={styles.testSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusContent: {
    marginLeft: 16,
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statusSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  tokenCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  tokenText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#3b82f6',
  },
  noTokenText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#ff1ea5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff1ea5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonSecondaryText: {
    color: '#ff1ea5',
    fontSize: 16,
    fontWeight: '700',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  testButtonDisabled: {
    opacity: 0.5,
  },
  testIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  testContent: {
    flex: 1,
  },
  testTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  testSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
    marginBottom: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
});
