/**
 * useNotifications Hook
 * Main hook for remote push notifications - handles permissions, token, and listeners
 * Follows big tech UX patterns: contextual permission requests, not on first launch
 */

import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerPushToken } from '../services/notificationAPI';
import { notificationLogger } from '../utils/notificationLogger';
import {
  parseNotificationPayload,
  isPhysicalDevice,
  shouldShowInForeground,
} from '../utils/notificationHelpers';
import {
  NOTIFICATION_CONFIG,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  PERMISSION_TIMING,
  CHANNEL_CONFIGS,
} from '../constants';
import { PushTokenState, NotificationPermission } from '../types';
import Constants from 'expo-constants';

// Configure how notifications are presented when app is in foreground
// Only set handler if not using Expo Go (remote notifications don't work in Expo Go)
const isExpoGo = Constants.appOwnership === 'expo';
if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const payload = parseNotificationPayload(notification);
      const shouldShow = shouldShowInForeground(payload.data);

      // Don't show alert/banner in foreground - we'll use custom NotificationBanner component
      // This prevents duplicate notifications on iOS
      return {
        shouldShowAlert: false, // Don't show system alert - use custom banner
        shouldPlaySound: shouldShow && NOTIFICATION_CONFIG.PLAY_SOUND_IN_FOREGROUND,
        shouldSetBadge: NOTIFICATION_CONFIG.SET_BADGE,
        shouldShowBanner: false, // Don't show system banner - use custom banner
        shouldShowList: true, // Still add to notification center
      };
    },
  });
}

interface UseNotificationsOptions {
  userId?: string;
  autoRegister?: boolean;
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    userId,
    autoRegister = false,
    onNotificationReceived,
    onNotificationTapped,
  } = options;

  const [tokenState, setTokenState] = useState<PushTokenState>({
    token: null,
    error: null,
    isLoading: false,
    permissionStatus: 'undetermined',
  });

  const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);

  /**
   * Setup Android notification channels (required for Android 8+)
   */
  const setupAndroidChannels = async () => {
    if (Platform.OS === 'android') {
      try {
        // Create all notification channels
        for (const [channelId, config] of Object.entries(CHANNEL_CONFIGS)) {
          await Notifications.setNotificationChannelAsync(channelId, {
            name: config.name,
            importance: config.importance,
            sound: config.sound,
            vibrationPattern: config.vibrationPattern ? [...config.vibrationPattern] : undefined,
            lightColor: config.lightColor,
            enableLights: config.enableLights,
            enableVibrate: config.enableVibrate,
            lockscreenVisibility: (config as any).lockscreenVisibility,
          });
        }
        notificationLogger.info('Android notification channels configured', null, 'Setup');
      } catch (error) {
        notificationLogger.error('Failed to setup Android channels', error, 'Setup');
      }
    }
  };

  /**
   * Check current permission status (non-intrusive)
   */
  const checkPermissionStatus = async (): Promise<NotificationPermission> => {
    try {
      const settings = await Notifications.getPermissionsAsync();

      const permission: NotificationPermission = {
        status: settings.granted ? 'granted' : settings.canAskAgain ? 'undetermined' : 'denied',
        canAskAgain: settings.canAskAgain,
        granted: settings.granted,
      };

      setTokenState((prev) => ({
        ...prev,
        permissionStatus: permission.status,
      }));

      notificationLogger.logPermission(permission.status, settings);

      return permission;
    } catch (error) {
      notificationLogger.error('Failed to check permission status', error, 'Permission');

      return {
        status: 'denied',
        canAskAgain: false,
        granted: false,
      };
    }
  };

  /**
   * Check if we should ask for permission now (big tech timing)
   */
  const shouldAskForPermission = async (): Promise<boolean> => {
    try {
      // Check if already asked recently
      const lastAsked = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PERMISSION_REQUEST);
      if (lastAsked) {
        const daysSinceAsked = (Date.now() - parseInt(lastAsked)) / (1000 * 60 * 60 * 24);
        if (daysSinceAsked < 7) {
          notificationLogger.debug('Permission asked recently, skipping', { daysSinceAsked }, 'Permission');
          return false;
        }
      }

      // Check app open count
      const appOpenCountStr = await AsyncStorage.getItem(STORAGE_KEYS.APP_OPEN_COUNT);
      const appOpenCount = appOpenCountStr ? parseInt(appOpenCountStr) : 0;

      if (appOpenCount < PERMISSION_TIMING.MIN_APP_OPENS) {
        notificationLogger.debug('Not enough app opens yet', { appOpenCount }, 'Permission');
        return false;
      }

      // Check install date
      const installDateStr = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_INSTALL_DATE);
      if (installDateStr) {
        const daysSinceInstall = (Date.now() - parseInt(installDateStr)) / (1000 * 60 * 60 * 24);
        if (daysSinceInstall < 1) {
          notificationLogger.debug('App installed too recently', { daysSinceInstall }, 'Permission');
          return false;
        }
      }

      return true;
    } catch (error) {
      notificationLogger.error('Error checking permission timing', error, 'Permission');
      return false;
    }
  };

  /**
   * Request notification permissions (called contextually, not automatically)
   */
  const requestPermission = async (): Promise<NotificationPermission> => {
    try {
      notificationLogger.info('Requesting notification permission', null, 'Permission');

      // Save request timestamp
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_PERMISSION_REQUEST, Date.now().toString());

      const settings = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
        android: {},
      });

      const permission: NotificationPermission = {
        status: settings.granted ? 'granted' : settings.canAskAgain ? 'undetermined' : 'denied',
        canAskAgain: settings.canAskAgain,
        granted: settings.granted,
      };

      setTokenState((prev) => ({
        ...prev,
        permissionStatus: permission.status,
        error: permission.granted ? null : ERROR_MESSAGES.PERMISSION_DENIED,
      }));

      notificationLogger.logPermission(permission.status, settings);

      return permission;
    } catch (error) {
      notificationLogger.error('Failed to request permission', error, 'Permission');

      setTokenState((prev) => ({
        ...prev,
        permissionStatus: 'denied',
        error: ERROR_MESSAGES.PERMISSION_DENIED,
      }));

      return {
        status: 'denied',
        canAskAgain: false,
        granted: false,
      };
    }
  };

  /**
   * Get Expo Push Token
   */
  const getPushToken = async (): Promise<string | null> => {
    try {
      // Check if running in Expo Go - remote notifications don't work in Expo Go
      if (isExpoGo) {
        const errorMsg = 'Push notifications not supported in Expo Go. Use development build.';
        notificationLogger.warning(errorMsg, null, 'Token');

        setTokenState((prev) => ({
          ...prev,
          error: errorMsg,
          isLoading: false,
        }));

        return null;
      }

      // Check if physical device
      if (!isPhysicalDevice()) {
        const errorMsg = ERROR_MESSAGES.NOT_PHYSICAL_DEVICE;
        notificationLogger.warning(errorMsg, null, 'Token');

        setTokenState((prev) => ({
          ...prev,
          error: errorMsg,
          isLoading: false,
        }));

        return null;
      }

      notificationLogger.info('Getting Expo push token', null, 'Token');

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID || undefined,
      });

      const token = tokenData.data;

      notificationLogger.logToken(token);

      // Save token to storage
      await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, token);

      setTokenState((prev) => ({
        ...prev,
        token,
        error: null,
        isLoading: false,
      }));

      return token;
    } catch (error) {
      notificationLogger.logToken(null, error);

      setTokenState((prev) => ({
        ...prev,
        token: null,
        error: ERROR_MESSAGES.TOKEN_FAILED,
        isLoading: false,
      }));

      return null;
    }
  };

  /**
   * Register device for push notifications (full flow)
   */
  const registerForNotifications = async (): Promise<string | null> => {
    setTokenState((prev) => ({ ...prev, isLoading: true }));

    try {
      // 1. Setup Android channels
      await setupAndroidChannels();

      // 2. Check permission
      let permission = await checkPermissionStatus();

      // 3. Request permission if needed
      if (!permission.granted) {
        permission = await requestPermission();
      }

      if (!permission.granted) {
        notificationLogger.warning('Permission not granted', null, 'Register');
        setTokenState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }

      // 4. Get push token
      const token = await getPushToken();

      if (!token) {
        return null;
      }

      // 5. Register with backend (if userId provided)
      if (userId) {
        const result = await registerPushToken(userId, token);

        if (!result.success) {
          notificationLogger.error('Failed to register token with backend', result.error, 'Register');
          setTokenState((prev) => ({
            ...prev,
            error: ERROR_MESSAGES.REGISTRATION_FAILED,
            isLoading: false,
          }));
        } else {
          notificationLogger.info('Successfully registered with backend', null, 'Register');
        }
      }

      return token;
    } catch (error) {
      notificationLogger.error('Registration failed', error, 'Register');

      setTokenState((prev) => ({
        ...prev,
        error: ERROR_MESSAGES.REGISTRATION_FAILED,
        isLoading: false,
      }));

      return null;
    }
  };

  /**
   * Handle foreground notification
   */
  const handleNotificationReceived = (notification: Notifications.Notification) => {
    notificationLogger.logNotificationReceived(notification, true);
    setLastNotification(notification);
    onNotificationReceived?.(notification);
  };

  /**
   * Handle notification tap/interaction
   */
  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const notification = response.notification;
    notificationLogger.logNotificationInteraction(response.actionIdentifier, notification);
    setLastNotification(notification);
    onNotificationTapped?.(response);
  };

  /**
   * Setup notification listeners
   */
  useEffect(() => {
    // Skip listener setup in Expo Go - remote notifications don't work
    if (isExpoGo) {
      notificationLogger.info('Skipping notification listeners in Expo Go', null, 'Setup');
      return;
    }

    // Listener for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      handleNotificationReceived
    );

    // Listener for when user taps on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    notificationLogger.info('Notification listeners registered', null, 'Setup');

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
      notificationLogger.info('Notification listeners removed', null, 'Setup');
    };
  }, [onNotificationReceived, onNotificationTapped]);

  /**
   * Auto-register if enabled and userId provided
   */
  useEffect(() => {
    if (autoRegister && userId) {
      registerForNotifications();
    }
  }, [autoRegister, userId]);

  /**
   * Track app opens for smart permission timing
   */
  useEffect(() => {
    const trackAppOpen = async () => {
      try {
        // Increment app open count
        const countStr = await AsyncStorage.getItem(STORAGE_KEYS.APP_OPEN_COUNT);
        const count = countStr ? parseInt(countStr) + 1 : 1;
        await AsyncStorage.setItem(STORAGE_KEYS.APP_OPEN_COUNT, count.toString());

        // Save first install date if not exists
        const installDate = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_INSTALL_DATE);
        if (!installDate) {
          await AsyncStorage.setItem(STORAGE_KEYS.FIRST_INSTALL_DATE, Date.now().toString());
        }

        notificationLogger.debug('App open tracked', { count }, 'Tracking');
      } catch (error) {
        notificationLogger.error('Failed to track app open', error, 'Tracking');
      }
    };

    trackAppOpen();
  }, []);

  return {
    // State
    token: tokenState.token,
    error: tokenState.error,
    isLoading: tokenState.isLoading,
    permissionStatus: tokenState.permissionStatus,
    lastNotification,

    // Methods
    registerForNotifications,
    requestPermission,
    checkPermissionStatus,
    shouldAskForPermission,
    getPushToken,
  };
}
