// src/navigation/components/AnimatedTabBar.tsx
import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

const { width } = Dimensions.get('window');

export const AnimatedTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const tabWidth = width / state.routes.length;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [state.index, tabWidth]);

  const getIconName = (routeName: string, focused: boolean) => {
    const icons: Record<string, { focused: string; unfocused: string }> = {
      Home: { focused: 'home', unfocused: 'home-outline' },
      BuyUsedCar: { focused: 'car-sport', unfocused: 'car-sport-outline' },
      Profile: { focused: 'person', unfocused: 'person-outline' },
    };
    return focused ? icons[routeName]?.focused : icons[routeName]?.unfocused;
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Animated indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: tabWidth,
              transform: [{ translateX }],
              backgroundColor: colors.primary, // from palette
            },
          ]}
        />

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, {
                  screen: route.name === 'BuyUsedCar' ? 'CarFeed' : undefined,
                });
              }
            };

            const iconName = getIconName(route.name, isFocused);
            const color = isFocused ? colors.primary : colors.gray[400]; // from palette

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={styles.tab}
                activeOpacity={0.8}
              >
                <Ionicons name={iconName as any} size={24} color={color} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: colors.card, // from palette
    borderTopWidth: 0.6,
    borderTopColor: colors.gray[200], // from palette
    elevation: 10,
    shadowColor: colors.black, // from palette
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    height: 64,
    backgroundColor: colors.card, // from palette
  },
  indicator: {
    height: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
});
