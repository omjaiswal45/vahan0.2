/**
 * Notification Module Types
 * Defines all TypeScript interfaces for push & local notifications
 */

import { Notification } from 'expo-notifications';

export interface NotificationData {
  type?: 'promo' | 'alert' | 'message' | 'reminder' | 'system';
  screen?: string;
  params?: Record<string, any>;
  priority?: 'high' | 'normal' | 'low';
  category?: string;
  actionId?: string;
  [key: string]: any;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: NotificationData;
  sound?: string | boolean;
  badge?: number;
  channelId?: string;
}

export interface PushTokenState {
  token: string | null;
  error: string | null;
  isLoading: boolean;
  permissionStatus: 'granted' | 'denied' | 'undetermined';
}

export interface NotificationPermission {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain: boolean;
  granted: boolean;
}

export interface LocalNotificationConfig {
  title: string;
  body: string;
  data?: NotificationData;
  trigger?: {
    seconds?: number;
    date?: Date;
    repeats?: boolean;
    channelId?: string;
  };
  sound?: string | boolean;
  badge?: number;
  priority?: 'high' | 'normal' | 'low';
}

export interface NotificationResponse {
  notification: Notification;
  actionIdentifier: string;
}

export interface NotificationLog {
  timestamp: string;
  level: 'info' | 'error' | 'warning' | 'debug';
  message: string;
  data?: any;
  context?: string;
}

export interface RegisterTokenPayload {
  userId: string;
  token: string;
  deviceId: string;
  platform: 'ios' | 'android';
  appVersion?: string;
}

export interface SendNotificationPayload {
  to: string | string[];
  title: string;
  body: string;
  data?: NotificationData;
  sound?: string;
  badge?: number;
  priority?: 'high' | 'normal' | 'default';
  channelId?: string;
}

export interface NotificationCategory {
  identifier: string;
  actions: NotificationAction[];
  options?: {
    previewPlaceholder?: string;
    intentIdentifiers?: string[];
    categorySummaryFormat?: string;
  };
}

export interface NotificationAction {
  identifier: string;
  buttonTitle: string;
  options?: {
    opensAppToForeground?: boolean;
    isAuthenticationRequired?: boolean;
    isDestructive?: boolean;
  };
}

export interface NotificationSettings {
  allowSound: boolean;
  allowBadge: boolean;
  allowAlert: boolean;
  allowCriticalAlerts: boolean;
  allowProvisional: boolean;
  allowAnnouncements: boolean;
}

export type NotificationTriggerInput =
  | null
  | { seconds: number; repeats?: boolean }
  | { date: Date }
  | { hour: number; minute: number; repeats?: boolean }
  | { weekday: number; hour: number; minute: number; repeats?: boolean };
