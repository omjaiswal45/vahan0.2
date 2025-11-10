/**
 * Notifications Module
 * Centralized export for all notification functionality
 */

// Hooks
export { useNotifications } from './hooks/useNotifications';
export { useLocalNotifications } from './hooks/useLocalNotifications';

// Components
export { NotificationBanner } from './components/NotificationBanner';
export { DebugPanel } from './components/DebugPanel';
export { PermissionPrimerModal } from './components/PermissionPrimerModal';

// Screens (Development)
export { NotificationTestScreen } from './screens/NotificationTestScreen';

// Services
export {
  registerPushToken,
  unregisterPushToken,
  updateNotificationPreferences,
  sendTestNotification,
  sendNotificationViaBackend,
  getNotificationHistory,
  markNotificationAsRead,
} from './services/notificationAPI';

// Utils
export {
  isPhysicalDevice,
  getPlatform,
  parseNotificationPayload,
  getNotificationCategory,
  getNotificationRoute,
  formatNotificationMessage,
  isValidNotificationPayload,
  getNavigationParams,
  shouldShowInForeground,
  getNotificationPriority,
  createNotificationId,
  formatNotificationTime,
  sanitizeNotificationData,
  isNotificationExpired,
  buildDeepLink,
  getBadgeCount,
  requiresUserAction,
  groupNotificationsByType,
  formatDuration,
} from './utils/notificationHelpers';

export { notificationLogger } from './utils/notificationLogger';

// Constants
export {
  NOTIFICATION_CHANNELS,
  CHANNEL_CONFIGS,
  NOTIFICATION_PRIORITY,
  NOTIFICATION_TYPES,
  PERMISSION_TIMING,
  NOTIFICATION_CONFIG,
  PERMISSION_PRIMER_MESSAGES,
  NOTIFICATION_ROUTES,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  NOTIFICATION_SOUNDS,
  DEBUG_CONFIG,
} from './constants';

// Notification Message Templates
export { NotificationMessages, formatNotification } from './notificationMessages';

// Types
export type {
  NotificationData,
  NotificationPayload,
  PushTokenState,
  NotificationPermission,
  LocalNotificationConfig,
  NotificationResponse,
  NotificationLog,
  RegisterTokenPayload,
  SendNotificationPayload,
  NotificationCategory,
  NotificationAction,
  NotificationSettings,
  NotificationTriggerInput,
} from './types';
