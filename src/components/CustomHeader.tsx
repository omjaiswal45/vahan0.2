import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { useNavigation } from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  useGradient?: boolean;
  titleColor?: string;
  iconColor?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
  useGradient = true,
  titleColor = colors.white,
  iconColor = colors.white,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  // Get dynamic padding based on platform
  const getContainerStyle = () => {
    if (Platform.OS === 'ios') {
      return {
        height: 88,
        paddingTop: 38,
      };
    }

    // Android - use moderate fixed padding that works for both modes
    return {
      height: 80,
      paddingTop: 24,
    };
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={useGradient ? [colors.primary, colors.primaryDark] : [colors.white, colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >
        <View style={[styles.container, getContainerStyle()]}>
          {/* Left Side - Back Button */}
          <View style={styles.leftContainer}>
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.backButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={iconColor}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Center - Title */}
          <View style={styles.centerContainer}>
            <Text
              style={[styles.title, { color: titleColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>

          {/* Right Side - Custom Component */}
          <View style={styles.rightContainer}>
            {rightComponent || null}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
  },
  gradientContainer: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    marginLeft: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 12,
  },
});

export default CustomHeader;
