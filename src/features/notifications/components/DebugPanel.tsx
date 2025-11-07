/**
 * DebugPanel Component
 * Development tool for testing and debugging notifications
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { notificationLogger } from '../utils/notificationLogger';
import { sendTestNotification } from '../services/notificationAPI';
import { DEBUG_CONFIG } from '../constants';
import { NotificationLog } from '../types';

interface DebugPanelProps {
  pushToken: string | null;
  permissionStatus: string;
  visible: boolean;
  onClose: () => void;
}

export function DebugPanel({
  pushToken,
  permissionStatus,
  visible,
  onClose,
}: DebugPanelProps) {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [testTitle, setTestTitle] = useState('Test Notification');
  const [testBody, setTestBody] = useState('This is a test notification');
  const [isSending, setIsSending] = useState(false);
  const [logFilter, setLogFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  useEffect(() => {
    if (visible) {
      loadLogs();
    }
  }, [visible]);

  const loadLogs = () => {
    const allLogs = notificationLogger.getLogs();
    setLogs(allLogs);
  };

  const handleSendTest = async () => {
    if (!pushToken) {
      alert('No push token available. Please register for notifications first.');
      return;
    }

    setIsSending(true);

    try {
      const result = await sendTestNotification(pushToken, testTitle, testBody);

      if (result.success) {
        alert('Test notification sent successfully!');
        loadLogs();
      } else {
        alert(`Failed to send test notification: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearLogs = async () => {
    await notificationLogger.clearLogs();
    setLogs([]);
  };

  const handleCopyToken = () => {
    // In a real app, you'd use Clipboard API
    alert(`Token: ${pushToken}`);
  };

  const getFilteredLogs = () => {
    if (logFilter === 'all') return logs;
    return logs.filter((log) => log.level === logFilter);
  };

  const getLevelColor = (level: NotificationLog['level']) => {
    switch (level) {
      case 'error':
        return '#FF3B3B';
      case 'warning':
        return '#FFA500';
      case 'info':
        return '#4ECDC4';
      case 'debug':
        return '#95A5A6';
      default:
        return '#666';
    }
  };

  if (!DEBUG_CONFIG.SHOW_DEBUG_PANEL) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notification Debug Panel</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Status Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Permission:</Text>
              <Text
                style={[
                  styles.value,
                  { color: permissionStatus === 'granted' ? '#4CAF50' : '#FF3B3B' },
                ]}
              >
                {permissionStatus}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Platform:</Text>
              <Text style={styles.value}>{Platform.OS}</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Token:</Text>
              {pushToken ? (
                <TouchableOpacity onPress={handleCopyToken}>
                  <Text style={[styles.value, styles.tokenText]} numberOfLines={1}>
                    {pushToken.substring(0, 30)}...
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.value, { color: '#999' }]}>Not available</Text>
              )}
            </View>
          </View>

          {/* Test Notification Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send Test Notification</Text>
            <TextInput
              style={styles.input}
              value={testTitle}
              onChangeText={setTestTitle}
              placeholder="Title"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={testBody}
              onChangeText={setTestBody}
              placeholder="Body"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              style={[styles.button, isSending && styles.buttonDisabled]}
              onPress={handleSendTest}
              disabled={isSending || !pushToken}
            >
              <Text style={styles.buttonText}>
                {isSending ? 'Sending...' : 'Send Test Notification'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logs Section */}
          <View style={styles.section}>
            <View style={styles.logHeader}>
              <Text style={styles.sectionTitle}>Logs ({getFilteredLogs().length})</Text>
              <View style={styles.logActions}>
                <TouchableOpacity onPress={loadLogs} style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>Refresh</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClearLogs} style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Log Filters */}
            <View style={styles.filterRow}>
              {(['all', 'error', 'warning', 'info'] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    logFilter === filter && styles.filterButtonActive,
                  ]}
                  onPress={() => setLogFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      logFilter === filter && styles.filterButtonTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Log Entries */}
            {getFilteredLogs().length === 0 ? (
              <Text style={styles.emptyText}>No logs available</Text>
            ) : (
              getFilteredLogs()
                .slice()
                .reverse()
                .map((log, index) => (
                  <View key={index} style={styles.logEntry}>
                    <View style={styles.logEntryHeader}>
                      <Text
                        style={[styles.logLevel, { color: getLevelColor(log.level) }]}
                      >
                        [{log.level.toUpperCase()}]
                      </Text>
                      {log.context && (
                        <Text style={styles.logContext}>{log.context}</Text>
                      )}
                      <Text style={styles.logTimestamp}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text style={styles.logMessage}>{log.message}</Text>
                    {log.data && (
                      <Text style={styles.logData}>
                        {JSON.stringify(log.data, null, 2)}
                      </Text>
                    )}
                  </View>
                ))
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2C3E50',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  tokenText: {
    color: '#4ECDC4',
    textDecorationLine: 'underline',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
    color: '#2C3E50',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  smallButtonText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#ECF0F1',
  },
  filterButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  logEntry: {
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4ECDC4',
  },
  logEntryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  logLevel: {
    fontSize: 11,
    fontWeight: '700',
    marginRight: 8,
  },
  logContext: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 8,
  },
  logTimestamp: {
    fontSize: 11,
    color: '#999',
    marginLeft: 'auto',
  },
  logMessage: {
    fontSize: 13,
    color: '#2C3E50',
    marginBottom: 4,
  },
  logData: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#ECF0F1',
    padding: 8,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
