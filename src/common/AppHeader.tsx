import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AppHeader = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // gentle floating movement
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // subtle pulse for CTA
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // background drift for depth
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, pulseAnim, bgAnim]);

  const floatY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const blueLeft = bgAnim.interpolate({ inputRange: [0, 1], outputRange: [-36, 0] });
  const orangeRight = bgAnim.interpolate({ inputRange: [0, 1], outputRange: [36, 0] });

  return (
    <View style={styles.header}>
      {/* soft background shapes */}
      <Animated.View
        style={[
          styles.bgCircle,
          styles.blueCircle,
          { transform: [{ translateX: blueLeft }] },
        ]}
      />
      <Animated.View
        style={[
          styles.bgCircle,
          styles.orangeCircle,
          { transform: [{ translateX: orangeRight }] },
        ]}
      />

      {/* logo, title, tagline */}
      <Animated.View style={[styles.logoWrap, { transform: [{ translateY: floatY }] }]}>
        <View style={styles.logoBubble}>
          <MaterialCommunityIcons name="car-hatchback" size={36} color="#1E88E5" />
        </View>

        <Text style={styles.title}>
          <Text style={styles.vahan}>Vahan</Text>
          <Text style={styles.help}>Help</Text>
        </Text>

        <Text style={styles.tag}>Find • Compare • Buy — faster, local & trusted</Text>
      </Animated.View>

      {/* pulsing CTA */}
      <Animated.View style={[styles.ctaWrap, { transform: [{ scale: pulseScale }] }]}>   
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 220,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },

  bgCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.12,
  },
  blueCircle: {
    backgroundColor: '#1E88E5',
    left: -90,
    top: -40,
  },
  orangeCircle: {
    backgroundColor: '#FB8C00',
    right: -90,
    top: -40,
  },

  logoWrap: {
    alignItems: 'center',
  },
  logoBubble: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      android: { elevation: 6 },
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
    }),
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  vahan: { color: '#1E88E5' },
  help: { color: '#FB8C00' },

  tag: {
    color: '#6b6b6b',
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  ctaWrap: {
    position: 'absolute',
    right: 18,
    bottom: 14,
  },
  cta: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    ...Platform.select({
      android: { elevation: 3 },
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
    }),
  },
  ctaText: { color: 'white', fontWeight: '700' },
});

export default AppHeader;
