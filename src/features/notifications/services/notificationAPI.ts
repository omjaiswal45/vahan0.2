/**
 * Notification API Service
 * Handles all server communication related to push notifications
 */

import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { NOTIFICATION_CONFIG } from '../constants';
import { notificationLogger } from '../utils/notificationLogger';
import { RegisterTokenPayload, SendNotificationPayload } from '../types';

// Replace with your actual backend API URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend-api.com';

/**
 * Register push token with backend
 */
export async function registerPushToken(
  userId: string,
  token: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const payload: RegisterTokenPayload = {
      userId,
      token,
      deviceId: Constants.sessionId || Device.modelName || 'unknown',
      platform: Platform.OS as 'ios' | 'android',
      appVersion: Constants.expoConfig?.version || '1.0.0',
    };

    notificationLogger.debug('Registering push token', payload, 'API');

    const response = await fetch(`${API_BASE_URL}/api/notifications/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    notificationLogger.logAPI('POST', '/notifications/register', payload, data);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    notificationLogger.logAPI('POST', '/notifications/register', { userId, token }, null, error);

    return {
      success: false,
      error: error.message || 'Failed to register push token',
    };
  }
}

/**
 * Unregister push token from backend
 */
export async function unregisterPushToken(
  userId: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    notificationLogger.debug('Unregistering push token', { userId, token }, 'API');

    const response = await fetch(`${API_BASE_URL}/api/notifications/unregister`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    notificationLogger.logAPI('POST', '/notifications/unregister', { userId, token }, data);

    return { success: true };
  } catch (error: any) {
    notificationLogger.logAPI('POST', '/notifications/unregister', { userId, token }, null, error);

    return {
      success: false,
      error: error.message || 'Failed to unregister push token',
    };
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: {
    promotions?: boolean;
    alerts?: boolean;
    messages?: boolean;
    reminders?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    notificationLogger.debug('Updating notification preferences', { userId, preferences }, 'API');

    const response = await fetch(`${API_BASE_URL}/api/notifications/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, preferences }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    notificationLogger.logAPI('PUT', '/notifications/preferences', { userId, preferences }, data);

    return { success: true };
  } catch (error: any) {
    notificationLogger.logAPI(
      'PUT',
      '/notifications/preferences',
      { userId, preferences },
      null,
      error
    );

    return {
      success: false,
      error: error.message || 'Failed to update notification preferences',
    };
  }
}

/**
 * Send a test notification via Expo Push Service
 */
export async function sendTestNotification(
  token: string,
  title: string = 'Test Notification',
  body: string = 'This is a test notification from your app'
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const payload: SendNotificationPayload = {
      to: token,
      title,
      body,
      data: { type: 'system', test: true },
      sound: 'default',
      priority: 'high',
    };

    notificationLogger.debug('Sending test notification', payload, 'API');

    const response = await fetch(NOTIFICATION_CONFIG.EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || data.message || `HTTP ${response.status}`
      );
    }

    notificationLogger.logAPI('POST', NOTIFICATION_CONFIG.EXPO_PUSH_URL, payload, data);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    notificationLogger.logAPI('POST', NOTIFICATION_CONFIG.EXPO_PUSH_URL, { token }, null, error);

    return {
      success: false,
      error: error.message || 'Failed to send test notification',
    };
  }
}

/**
 * Send notification via your backend (backend handles Expo push)
 */
export async function sendNotificationViaBackend(
  payload: SendNotificationPayload
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    notificationLogger.debug('Sending notification via backend', payload, 'API');

    const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    notificationLogger.logAPI('POST', '/notifications/send', payload, data);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    notificationLogger.logAPI('POST', '/notifications/send', payload, null, error);

    return {
      success: false,
      error: error.message || 'Failed to send notification',
    };
  }
}

/**
 * Get notification history from backend
 */
export async function getNotificationHistory(
  userId: string,
  limit: number = 50
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    notificationLogger.debug('Fetching notification history', { userId, limit }, 'API');

    const response = await fetch(
      `${API_BASE_URL}/api/notifications/history?userId=${userId}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    notificationLogger.logAPI('GET', '/notifications/history', { userId, limit }, data);

    return {
      success: true,
      data: data.notifications || [],
    };
  } catch (error: any) {
    notificationLogger.logAPI('GET', '/notifications/history', { userId, limit }, null, error);

    return {
      success: false,
      error: error.message || 'Failed to fetch notification history',
    };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, notificationId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    notificationLogger.logAPI('POST', '/notifications/read', { userId, notificationId }, data);

    return { success: true };
  } catch (error: any) {
    notificationLogger.logAPI(
      'POST',
      '/notifications/read',
      { userId, notificationId },
      null,
      error
    );

    return {
      success: false,
      error: error.message || 'Failed to mark notification as read',
    };
  }
}
