/**
 * Notification Helpers
 * Pure utility functions for notification processing and formatting
 */

import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { NOTIFICATION_ROUTES, NOTIFICATION_TYPES, NOTIFICATION_CHANNELS } from '../constants';
import { NotificationData, NotificationPayload } from '../types';

/**
 * Check if device is physical (not simulator/emulator)
 */
export function isPhysicalDevice(): boolean {
  return Device.isDevice;
}

/**
 * Get platform type
 */
export function getPlatform(): 'ios' | 'android' {
  return Platform.OS as 'ios' | 'android';
}

/**
 * Parse notification payload and extract structured data
 */
export function parseNotificationPayload(notification: any): NotificationPayload {
  const content = notification?.request?.content || notification?.content || {};

  return {
    title: content.title || 'Notification',
    body: content.body || '',
    data: content.data || {},
    sound: content.sound,
    badge: content.badge,
    channelId: content.channelId,
  };
}

/**
 * Get notification category from data payload
 */
export function getNotificationCategory(data?: NotificationData): string {
  if (!data) return NOTIFICATION_CHANNELS.DEFAULT;

  const type = data.type || 'default';

  switch (type) {
    case NOTIFICATION_TYPES.PROMO:
      return NOTIFICATION_CHANNELS.PROMOTION;
    case NOTIFICATION_TYPES.ALERT:
      return NOTIFICATION_CHANNELS.ALERT;
    case NOTIFICATION_TYPES.MESSAGE:
      return NOTIFICATION_CHANNELS.MESSAGE;
    case NOTIFICATION_TYPES.REMINDER:
      return NOTIFICATION_CHANNELS.REMINDER;
    case NOTIFICATION_TYPES.SYSTEM:
      return NOTIFICATION_CHANNELS.SYSTEM;
    default:
      return NOTIFICATION_CHANNELS.DEFAULT;
  }
}

/**
 * Get screen route from notification data
 */
export function getNotificationRoute(data?: NotificationData): string | null {
  if (!data) return null;

  // Explicit screen provided
  if (data.screen) {
    return data.screen;
  }

  // Map type to route
  if (data.type && NOTIFICATION_ROUTES[data.type as keyof typeof NOTIFICATION_ROUTES]) {
    return NOTIFICATION_ROUTES[data.type as keyof typeof NOTIFICATION_ROUTES];
  }

  return null;
}

/**
 * Format notification message for display
 */
export function formatNotificationMessage(title: string, body: string, maxLength: number = 100): string {
  const combined = `${title}: ${body}`;

  if (combined.length <= maxLength) {
    return combined;
  }

  return `${combined.substring(0, maxLength - 3)}...`;
}

/**
 * Validate notification payload structure
 */
export function isValidNotificationPayload(payload: any): boolean {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  // Must have at least title or body
  return Boolean(payload.title || payload.body);
}

/**
 * Extract navigation params from notification data
 */
export function getNavigationParams(data?: NotificationData): Record<string, any> {
  if (!data || !data.params) {
    return {};
  }

  return data.params;
}

/**
 * Determine if notification should show in foreground
 */
export function shouldShowInForeground(data?: NotificationData): boolean {
  // High priority alerts always show
  if (data?.priority === 'high' || data?.type === 'alert') {
    return true;
  }

  // System notifications might not need to show
  if (data?.type === 'system') {
    return false;
  }

  return true;
}

/**
 * Get notification priority level
 */
export function getNotificationPriority(data?: NotificationData): 'high' | 'normal' | 'low' {
  if (data?.priority) {
    return data.priority;
  }

  // Infer from type
  switch (data?.type) {
    case NOTIFICATION_TYPES.ALERT:
      return 'high';
    case NOTIFICATION_TYPES.MESSAGE:
      return 'high';
    case NOTIFICATION_TYPES.PROMO:
      return 'normal';
    case NOTIFICATION_TYPES.REMINDER:
      return 'normal';
    case NOTIFICATION_TYPES.SYSTEM:
      return 'low';
    default:
      return 'normal';
  }
}

/**
 * Create notification identifier (for local notifications)
 */
export function createNotificationId(prefix: string = 'notif'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format timestamp for notification display
 */
export function formatNotificationTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

/**
 * Clean notification data (remove sensitive fields if any)
 */
export function sanitizeNotificationData(data?: NotificationData): NotificationData | undefined {
  if (!data) return undefined;

  const sanitized = { ...data };

  // Remove potentially sensitive fields
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.apiKey;
  delete sanitized.secret;

  return sanitized;
}

/**
 * Check if notification is expired
 */
export function isNotificationExpired(data?: NotificationData): boolean {
  if (!data?.expiresAt) return false;

  const expiryDate = new Date(data.expiresAt);
  return expiryDate < new Date();
}

/**
 * Build deep link URL from notification data
 */
export function buildDeepLink(data?: NotificationData): string | null {
  const route = getNotificationRoute(data);
  if (!route) return null;

  const params = getNavigationParams(data);
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return queryString ? `${route}?${queryString}` : route;
}

/**
 * Get badge count for app icon (iOS)
 */
export function getBadgeCount(currentBadge: number = 0, increment: boolean = true): number {
  if (Platform.OS !== 'ios') return 0;

  return increment ? currentBadge + 1 : Math.max(0, currentBadge - 1);
}

/**
 * Determine if notification requires user action
 */
export function requiresUserAction(data?: NotificationData): boolean {
  return Boolean(data?.actionId || data?.type === 'alert');
}

/**
 * Group notifications by type
 */
export function groupNotificationsByType(notifications: any[]): Record<string, any[]> {
  return notifications.reduce((groups, notification) => {
    const payload = parseNotificationPayload(notification);
    const type = payload.data?.type || 'default';

    if (!groups[type]) {
      groups[type] = [];
    }

    groups[type].push(notification);
    return groups;
  }, {} as Record<string, any[]>);
}

/**
 * Convert seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}
