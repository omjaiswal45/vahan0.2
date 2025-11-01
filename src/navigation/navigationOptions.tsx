import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

/**
 * Default screen options for Stack Navigator
 * Provides consistent styling across all screens with pink gradient header
 */
export const defaultStackScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderBottomWidth: 0,
  },
  headerTintColor: colors.white,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.3,
    color: colors.white,
  },
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
  headerLeftContainerStyle: {
    paddingLeft: 8,
  },
  headerRightContainerStyle: {
    paddingRight: 16,
  },
  headerBackground: () => (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    />
  ),
  cardStyle: {
    backgroundColor: colors.gray[50],
  },
};

/**
 * Default screen options for Native Stack Navigator
 * Provides consistent styling across all screens with pink gradient header
 */
export const defaultNativeStackScreenOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  } as any,
  headerTintColor: colors.white,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.3,
    color: colors.white,
  } as any,
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
  headerShadowVisible: true,
  animation: 'slide_from_right',
  headerBackground: () => (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    />
  ),
  contentStyle: {
    backgroundColor: colors.gray[50],
  },
};

/**
 * Custom back button for navigation headers
 */
export const getHeaderBackButton = (onPress?: () => void) => ({
  headerLeft: (props: any) => (
    <TouchableOpacity
      onPress={onPress || props.onPress}
      style={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
      }}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name="chevron-back"
        size={28}
        color={props.tintColor || colors.white}
      />
    </TouchableOpacity>
  ),
});

/**
 * Options for screens that should hide the header
 */
export const noHeaderOptions: StackNavigationOptions = {
  headerShown: false,
};

/**
 * Options for modal presentation
 */
export const modalScreenOptions: StackNavigationOptions = {
  presentation: 'modal',
  headerStyle: {
    backgroundColor: colors.white,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: colors.gray[700],
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
  },
  headerTitleAlign: 'center',
  cardStyle: {
    backgroundColor: colors.white,
  },
};
