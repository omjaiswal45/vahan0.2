/**
 * Notification Logger
 * Centralized logging system for debugging notification issues
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEBUG_CONFIG, STORAGE_KEYS } from '../constants';
import { NotificationLog } from '../types';

class NotificationLogger {
  private logs: NotificationLog[] = [];
  private readonly MAX_LOGS = 100;

  constructor() {
    if (DEBUG_CONFIG.ENABLE_LOGGING) {
      this.loadLogs();
    }
  }

  /**
   * Load existing logs from storage
   */
  private async loadLogs() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LOGS);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('[NotificationLogger] Failed to load logs:', error);
    }
  }

  /**
   * Save logs to storage
   */
  private async saveLogs() {
    try {
      // Keep only last MAX_LOGS entries
      if (this.logs.length > this.MAX_LOGS) {
        this.logs = this.logs.slice(-this.MAX_LOGS);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs));
    } catch (error) {
      console.error('[NotificationLogger] Failed to save logs:', error);
    }
  }

  /**
   * Create a log entry
   */
  private createLog(
    level: NotificationLog['level'],
    message: string,
    data?: any,
    context?: string
  ): NotificationLog {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context,
    };
  }

  /**
   * Add log and optionally print to console
   */
  private addLog(log: NotificationLog) {
    this.logs.push(log);

    if (DEBUG_CONFIG.LOG_TO_CONSOLE) {
      const prefix = {
        info: '[INFO]',
        error: '[ERROR]',
        warning: '[WARNING]',
        debug: '[DEBUG]',
      }[log.level];

      console.log(
        `${prefix} [Notification${log.context ? `:${log.context}` : ''}] ${log.message}`,
        log.data || ''
      );
    }

    // Save to storage (non-blocking)
    this.saveLogs();
  }

  /**
   * Log info message
   */
  info(message: string, data?: any, context?: string) {
    if (!DEBUG_CONFIG.ENABLE_LOGGING) return;
    this.addLog(this.createLog('info', message, data, context));
  }

  /**
   * Log error message
   */
  error(message: string, error?: any, context?: string) {
    if (!DEBUG_CONFIG.ENABLE_LOGGING) return;

    const errorData = error
      ? {
          message: error.message || String(error),
          stack: error.stack,
          code: error.code,
          ...error,
        }
      : undefined;

    this.addLog(this.createLog('error', message, errorData, context));
  }

  /**
   * Log warning message
   */
  warning(message: string, data?: any, context?: string) {
    if (!DEBUG_CONFIG.ENABLE_LOGGING) return;
    this.addLog(this.createLog('warning', message, data, context));
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any, context?: string) {
    if (!DEBUG_CONFIG.ENABLE_LOGGING) return;
    this.addLog(this.createLog('debug', message, data, context));
  }

  /**
   * Log API request/response
   */
  logAPI(method: string, endpoint: string, payload?: any, response?: any, error?: any) {
    if (!DEBUG_CONFIG.ENABLE_LOGGING) return;

    const data = {
      method,
      endpoint,
      payload,
      response,
      error: error
        ? {
            message: error.message || String(error),
            status: error.status,
            code: error.code,
          }
        : undefined,
    };

    if (error) {
      this.addLog(this.createLog('error', `API ${method} ${endpoint} failed`, data, 'API'));
    } else {
      this.addLog(this.createLog('info', `API ${method} ${endpoint} success`, data, 'API'));
    }
  }

  /**
   * Log permission request/result
   */
  logPermission(status: string, details?: any) {
    this.info(`Permission status: ${status}`, details, 'Permission');
  }

  /**
   * Log token registration
   */
  logToken(token: string | null, error?: any) {
    if (error) {
      this.error('Failed to get push token', error, 'Token');
    } else {
      this.info(`Push token obtained: ${token?.substring(0, 20)}...`, { token }, 'Token');
    }
  }

  /**
   * Log notification received
   */
  logNotificationReceived(notification: any, foreground: boolean) {
    this.info(
      `Notification received (${foreground ? 'foreground' : 'background'})`,
      {
        title: notification.request?.content?.title,
        body: notification.request?.content?.body,
        data: notification.request?.content?.data,
      },
      'Receive'
    );
  }

  /**
   * Log notification interaction
   */
  logNotificationInteraction(actionId: string, notification: any) {
    this.info(
      `Notification interacted: ${actionId}`,
      {
        title: notification.request?.content?.title,
        data: notification.request?.content?.data,
      },
      'Interaction'
    );
  }

  /**
   * Log local notification scheduled
   */
  logLocalScheduled(notificationId: string, config: any) {
    this.info(
      `Local notification scheduled: ${notificationId}`,
      {
        title: config.title,
        trigger: config.trigger,
      },
      'Local'
    );
  }

  /**
   * Get all logs
   */
  getLogs(): NotificationLog[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: NotificationLog['level']): NotificationLog[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get recent logs (last n entries)
   */
  getRecentLogs(count: number = 20): NotificationLog[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  async clearLogs() {
    this.logs = [];
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LOGS);
      this.info('Logs cleared', undefined, 'Logger');
    } catch (error) {
      console.error('[NotificationLogger] Failed to clear logs:', error);
    }
  }

  /**
   * Export logs as JSON string
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const notificationLogger = new NotificationLogger();

// Export class for testing
export default NotificationLogger;
