/**
 * NotificationBanner Component
 * In-app banner for displaying foreground notifications
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  useColorScheme,
  PlatformColor,
  Image,
} from 'react-native';
import { Notification } from 'expo-notifications';
import { parseNotificationPayload } from '../utils/notificationHelpers';
import { NOTIFICATION_CONFIG } from '../constants';

interface NotificationBannerProps {
  notification: Notification | null;
  onPress?: (notification: Notification) => void;
  onDismiss?: () => void;
  autoHideDuration?: number;
}

export function NotificationBanner({
  notification,
  onPress,
  onDismiss,
  autoHideDuration = NOTIFICATION_CONFIG.BANNER_AUTO_HIDE_DELAY,
}: NotificationBannerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Dynamic colors that match iOS system appearance
  const colors = {
    // iOS uses elevated backgrounds in dark mode (not pure black)
    background: isDark
      ? (Platform.OS === 'ios' ? '#2C2C2E' : '#1C1C1E') // iOS: gray, Android: darker
      : '#FFFFFF',
    iconBackground: isDark
      ? (Platform.OS === 'ios' ? '#3A3A3C' : '#2C2C2E')
      : '#F2F2F7',
    title: isDark ? '#FFFFFF' : '#000000',
    body: isDark
      ? (Platform.OS === 'ios' ? '#EBEBF5' : '#E5E5EA') // iOS: lighter gray
      : '#3C3C43',
    secondary: isDark
      ? (Platform.OS === 'ios' ? '#8E8E93' : '#98989D')
      : '#8E8E93',
  };

  useEffect(() => {
    if (notification) {
      // Show banner
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      if (autoHideDuration > 0) {
        autoHideTimer.current = setTimeout(() => {
          hideBanner();
        }, autoHideDuration);
      }
    } else {
      hideBanner();
    }

    return () => {
      if (autoHideTimer.current) {
        clearTimeout(autoHideTimer.current);
      }
    };
  }, [notification]);

  const hideBanner = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  const handlePress = () => {
    if (notification) {
      onPress?.(notification);
      hideBanner();
    }
  };

  const handleDismiss = () => {
    hideBanner();
  };

  if (!notification) {
    return null;
  }

  const payload = parseNotificationPayload(notification);
  const { title, body } = payload;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.banner,
          { backgroundColor: colors.background }
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={[
              styles.appIcon,
              { backgroundColor: colors.iconBackground }
            ]}>
              <Image
                source={require('../../../../assets/icon.png')}
                style={styles.appIconImage}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.title }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.body, { color: colors.body }]} numberOfLines={2}>
              {body}
            </Text>
            <Text style={[styles.timestamp, { color: colors.secondary }]}>now</Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.closeText, { color: colors.secondary }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 10,
    left: 10,
    right: 10,
    zIndex: 9999,
    elevation: 10,
  },
  banner: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  appIconImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  iconText: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  body: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '300',
  },
});
