/**
 * Notification Constants
 * Global configuration for notification channels, priorities, and settings
 */

import { Platform } from 'react-native';

// Notification Channels (Android)
export const NOTIFICATION_CHANNELS = {
  DEFAULT: 'default',
  PROMOTION: 'promotion',
  ALERT: 'alert',
  MESSAGE: 'message',
  REMINDER: 'reminder',
  SYSTEM: 'system',
} as const;

// Channel Configurations for Android
export const CHANNEL_CONFIGS = {
  [NOTIFICATION_CHANNELS.DEFAULT]: {
    name: 'Default Notifications',
    importance: 4, // HIGH
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF6B6B',
    enableLights: true,
    enableVibrate: true,
  },
  [NOTIFICATION_CHANNELS.PROMOTION]: {
    name: 'Promotions & Offers',
    importance: 3, // MEDIUM
    sound: 'default',
    vibrationPattern: [0, 200, 200, 200],
    lightColor: '#4ECDC4',
    enableLights: true,
    enableVibrate: true,
  },
  [NOTIFICATION_CHANNELS.ALERT]: {
    name: 'Important Alerts',
    importance: 5, // MAX
    sound: 'default',
    vibrationPattern: [0, 300, 300, 300],
    lightColor: '#FF3B3B',
    enableLights: true,
    enableVibrate: true,
    lockscreenVisibility: 1, // PUBLIC
  },
  [NOTIFICATION_CHANNELS.MESSAGE]: {
    name: 'Messages',
    importance: 4, // HIGH
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#95E1D3',
    enableLights: true,
    enableVibrate: true,
  },
  [NOTIFICATION_CHANNELS.REMINDER]: {
    name: 'Reminders',
    importance: 3, // MEDIUM
    sound: 'default',
    vibrationPattern: [0, 150, 150, 150],
    lightColor: '#FFA07A',
    enableLights: true,
    enableVibrate: true,
  },
  [NOTIFICATION_CHANNELS.SYSTEM]: {
    name: 'System Notifications',
    importance: 2, // LOW
    sound: null,
    vibrationPattern: null,
    lightColor: '#CCCCCC',
    enableLights: false,
    enableVibrate: false,
  },
} as const;

// Notification Priorities
export const NOTIFICATION_PRIORITY = {
  MAX: 'max',
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
  MIN: 'min',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  PROMO: 'promo',
  ALERT: 'alert',
  MESSAGE: 'message',
  REMINDER: 'reminder',
  SYSTEM: 'system',
} as const;

// Permission Request Timing (Big Tech Standard)
export const PERMISSION_TIMING = {
  // Don't ask on first app open - wait for user engagement
  MIN_APP_OPENS: 2,
  // Or wait for a meaningful action
  TRIGGER_ON_ACTION: true,
  // Time delay after app install (milliseconds)
  DELAY_AFTER_INSTALL: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Notification Behavior Configuration
export const NOTIFICATION_CONFIG = {
  // Show notification even when app is in foreground
  SHOW_IN_FOREGROUND: true,
  // Play sound when app is in foreground
  PLAY_SOUND_IN_FOREGROUND: true,
  // Set badge count
  SET_BADGE: Platform.OS === 'ios',
  // Auto-hide banner after (ms)
  BANNER_AUTO_HIDE_DELAY: 4000,
  // Maximum logs to store
  MAX_LOGS_STORED: 100,
  // Expo Push Notification Endpoint
  EXPO_PUSH_URL: 'https://exp.host/--/api/v2/push/send',
} as const;

// Permission Priming Messages (contextual, like big tech)
export const PERMISSION_PRIMER_MESSAGES = {
  DEFAULT: {
    title: 'Stay Updated',
    message: 'Get notified about important updates and new features. You can change this anytime in settings.',
    confirmText: 'Enable Notifications',
    cancelText: 'Not Now',
  },
  AFTER_ORDER: {
    title: 'Track Your Order',
    message: 'Get real-time updates about your order status and delivery.',
    confirmText: 'Enable Notifications',
    cancelText: 'Skip',
  },
  AFTER_BOOKING: {
    title: 'Booking Confirmation',
    message: 'Receive confirmation and reminder notifications for your bookings.',
    confirmText: 'Enable Notifications',
    cancelText: 'Maybe Later',
  },
  PROMOTIONAL: {
    title: 'Exclusive Offers',
    message: 'Be the first to know about special deals and promotions.',
    confirmText: 'Yes, Notify Me',
    cancelText: 'No Thanks',
  },
} as const;

// Deep Link Routes (map notification types to screens)
export const NOTIFICATION_ROUTES = {
  promo: 'Promotions',
  alert: 'Alerts',
  message: 'Messages',
  reminder: 'Reminders',
  order: 'OrderDetails',
  booking: 'BookingDetails',
  profile: 'Profile',
  home: 'Home',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Notification permission was denied. You can enable it in device settings.',
  TOKEN_FAILED: 'Failed to get push notification token. Please try again.',
  REGISTRATION_FAILED: 'Failed to register device for notifications. Please check your connection.',
  NOT_PHYSICAL_DEVICE: 'Push notifications only work on physical devices, not simulators.',
  SCHEDULE_FAILED: 'Failed to schedule local notification.',
  INVALID_PAYLOAD: 'Invalid notification payload received.',
} as const;

// Storage Keys (for AsyncStorage)
export const STORAGE_KEYS = {
  PUSH_TOKEN: '@notification_push_token',
  PERMISSION_STATUS: '@notification_permission_status',
  LOGS: '@notification_logs',
  LAST_PERMISSION_REQUEST: '@notification_last_permission_request',
  APP_OPEN_COUNT: '@app_open_count',
  FIRST_INSTALL_DATE: '@first_install_date',
  PERMISSION_PRIMER_SHOWN: '@permission_primer_shown',
} as const;

// Notification Sounds (optional custom sounds)
export const NOTIFICATION_SOUNDS = {
  DEFAULT: 'default',
  SUCCESS: 'success.wav',
  ALERT: 'alert.wav',
  MESSAGE: 'message.wav',
} as const;

// Development/Debug Configuration
export const DEBUG_CONFIG = {
  ENABLE_LOGGING: __DEV__,
  SHOW_DEBUG_PANEL: __DEV__,
  LOG_TO_CONSOLE: __DEV__,
  MOCK_TOKEN_IN_SIMULATOR: __DEV__,
} as const;
