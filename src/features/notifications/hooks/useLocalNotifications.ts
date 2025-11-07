/**
 * useLocalNotifications Hook
 * Handles local/scheduled notifications within the app
 */

import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationLogger } from '../utils/notificationLogger';
import { createNotificationId, getNotificationCategory } from '../utils/notificationHelpers';
import { LocalNotificationConfig } from '../types';

export function useLocalNotifications() {
  const [scheduledNotifications, setScheduledNotifications] = useState<string[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);

  /**
   * Schedule a local notification
   */
  const scheduleNotification = useCallback(
    async (config: LocalNotificationConfig): Promise<string | null> => {
      setIsScheduling(true);

      try {
        const notificationId = createNotificationId('local');
        const channelId = config.data ? getNotificationCategory(config.data) : 'default';

        // Build trigger
        let trigger: Notifications.NotificationTriggerInput = null;

        if (config.trigger) {
          if (config.trigger.seconds) {
            trigger = {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: config.trigger.seconds,
              repeats: config.trigger.repeats || false,
            };
          } else if (config.trigger.date) {
            trigger = {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: config.trigger.date,
            };
          }
        }

        // Schedule the notification
        const id = await Notifications.scheduleNotificationAsync({
          identifier: notificationId,
          content: {
            title: config.title,
            body: config.body,
            data: config.data || {},
            sound: config.sound !== false ? (config.sound as string) || 'default' : undefined,
            badge: config.badge,
            priority:
              config.priority === 'high'
                ? Notifications.AndroidNotificationPriority.HIGH
                : config.priority === 'low'
                ? Notifications.AndroidNotificationPriority.LOW
                : Notifications.AndroidNotificationPriority.DEFAULT,
            ...(channelId && { channelId }),
          },
          trigger,
        });

        notificationLogger.logLocalScheduled(id, config);

        setScheduledNotifications((prev) => [...prev, id]);
        setIsScheduling(false);

        return id;
      } catch (error) {
        notificationLogger.error('Failed to schedule local notification', error, 'Local');
        setIsScheduling(false);
        return null;
      }
    },
    []
  );

  /**
   * Cancel a scheduled notification by ID
   */
  const cancelNotification = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);

      notificationLogger.info(`Cancelled notification: ${notificationId}`, null, 'Local');

      setScheduledNotifications((prev) => prev.filter((id) => id !== notificationId));

      return true;
    } catch (error) {
      notificationLogger.error(
        `Failed to cancel notification: ${notificationId}`,
        error,
        'Local'
      );
      return false;
    }
  }, []);

  /**
   * Cancel all scheduled notifications
   */
  const cancelAllNotifications = useCallback(async (): Promise<boolean> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      notificationLogger.info('Cancelled all scheduled notifications', null, 'Local');

      setScheduledNotifications([]);

      return true;
    } catch (error) {
      notificationLogger.error('Failed to cancel all notifications', error, 'Local');
      return false;
    }
  }, []);

  /**
   * Get all scheduled notifications
   */
  const getAllScheduledNotifications = useCallback(async (): Promise<
    Notifications.NotificationRequest[]
  > => {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();

      notificationLogger.info(
        `Found ${notifications.length} scheduled notifications`,
        null,
        'Local'
      );

      return notifications;
    } catch (error) {
      notificationLogger.error('Failed to get scheduled notifications', error, 'Local');
      return [];
    }
  }, []);

  /**
   * Dismiss a displayed notification (remove from notification tray)
   */
  const dismissNotification = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      await Notifications.dismissNotificationAsync(notificationId);

      notificationLogger.info(`Dismissed notification: ${notificationId}`, null, 'Local');

      return true;
    } catch (error) {
      notificationLogger.error(
        `Failed to dismiss notification: ${notificationId}`,
        error,
        'Local'
      );
      return false;
    }
  }, []);

  /**
   * Dismiss all displayed notifications
   */
  const dismissAllNotifications = useCallback(async (): Promise<boolean> => {
    try {
      await Notifications.dismissAllNotificationsAsync();

      notificationLogger.info('Dismissed all notifications', null, 'Local');

      return true;
    } catch (error) {
      notificationLogger.error('Failed to dismiss all notifications', error, 'Local');
      return false;
    }
  }, []);

  /**
   * Present a notification immediately (no scheduling)
   */
  const presentNotificationNow = useCallback(
    async (
      title: string,
      body: string,
      data?: Record<string, any>
    ): Promise<string | null> => {
      try {
        const notificationId = createNotificationId('instant');

        const id = await Notifications.scheduleNotificationAsync({
          identifier: notificationId,
          content: {
            title,
            body,
            data: data || {},
            sound: 'default',
          },
          trigger: null, // Present immediately
        });

        notificationLogger.info(`Presented notification immediately: ${id}`, null, 'Local');

        return id;
      } catch (error) {
        notificationLogger.error('Failed to present notification', error, 'Local');
        return null;
      }
    },
    []
  );

  /**
   * Schedule a reminder notification
   */
  const scheduleReminder = useCallback(
    async (
      title: string,
      body: string,
      delaySeconds: number,
      data?: Record<string, any>
    ): Promise<string | null> => {
      return scheduleNotification({
        title,
        body,
        data: { ...data, type: 'reminder' },
        trigger: {
          seconds: delaySeconds,
          repeats: false,
        },
        sound: 'default',
        priority: 'normal',
      });
    },
    [scheduleNotification]
  );

  /**
   * Schedule a daily repeating notification
   */
  const scheduleDailyNotification = useCallback(
    async (
      title: string,
      body: string,
      hour: number,
      minute: number,
      data?: Record<string, any>
    ): Promise<string | null> => {
      try {
        const now = new Date();
        let scheduledDate = new Date();
        scheduledDate.setHours(hour, minute, 0, 0);

        // If time has passed today, schedule for tomorrow
        if (scheduledDate < now) {
          scheduledDate.setDate(scheduledDate.getDate() + 1);
        }

        const secondsUntilTrigger = Math.floor(
          (scheduledDate.getTime() - now.getTime()) / 1000
        );

        // Note: For true daily repeating, you may need to reschedule after each trigger
        // Expo doesn't support complex repeat patterns natively
        return scheduleNotification({
          title,
          body,
          data: { ...data, type: 'reminder', dailyRepeat: true },
          trigger: {
            seconds: secondsUntilTrigger,
            repeats: false, // We'll handle rescheduling in the app
          },
          sound: 'default',
          priority: 'normal',
        });
      } catch (error) {
        notificationLogger.error('Failed to schedule daily notification', error, 'Local');
        return null;
      }
    },
    [scheduleNotification]
  );

  /**
   * Get badge count
   */
  const getBadgeCount = useCallback(async (): Promise<number> => {
    try {
      const count = await Notifications.getBadgeCountAsync();
      return count;
    } catch (error) {
      notificationLogger.error('Failed to get badge count', error, 'Local');
      return 0;
    }
  }, []);

  /**
   * Set badge count
   */
  const setBadgeCount = useCallback(async (count: number): Promise<boolean> => {
    try {
      await Notifications.setBadgeCountAsync(count);
      notificationLogger.info(`Badge count set to ${count}`, null, 'Local');
      return true;
    } catch (error) {
      notificationLogger.error('Failed to set badge count', error, 'Local');
      return false;
    }
  }, []);

  return {
    // State
    scheduledNotifications,
    isScheduling,

    // Schedule/Cancel
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    getAllScheduledNotifications,

    // Display/Dismiss
    presentNotificationNow,
    dismissNotification,
    dismissAllNotifications,

    // Helpers
    scheduleReminder,
    scheduleDailyNotification,

    // Badge
    getBadgeCount,
    setBadgeCount,
  };
}
