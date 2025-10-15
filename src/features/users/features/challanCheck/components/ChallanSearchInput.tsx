// src/features/users/features/challanCheck/components/ChallanSearchInput.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  Animated,
  Platform,
  Keyboard,
} from 'react-native';
import { colors } from '../../../../../styles';

interface ChallanSearchInputProps {
  onSearch: (registrationNumber: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const ChallanSearchInput: React.FC<ChallanSearchInputProps> = ({
  onSearch,
  isLoading = false,
  placeholder = 'Search vehicle registration',
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleSearch = () => {
    const trimmedValue = value.trim().toUpperCase();
    if (trimmedValue.length >= 6) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.96,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
      
      Keyboard.dismiss();
      onSearch(trimmedValue);
    }
  };

  const formatRegistrationNumber = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setValue(cleaned);
  };

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  const isValidLength = value.trim().length >= 6;
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.gray[200], colors.primary],
  });

  return (
    <View style={styles.container}>
      {/* Main Search Box */}
      <Animated.View
        style={[
          styles.searchBox,
          {
            borderColor,
            shadowOpacity: isFocused ? 0.12 : 0.04,
          },
        ]}
      >
        {/* Search Icon Left */}
        <View style={styles.iconLeft}>
          <View style={styles.searchIconContainer}>
            <View style={styles.searchIconCircle} />
            <View style={styles.searchIconHandle} />
          </View>
        </View>

        {/* Input Field */}
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={formatRegistrationNumber}
            placeholder={placeholder}
            placeholderTextColor={colors.gray[400]}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={15}
            editable={!isLoading}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            selectionColor={colors.primary}
          />
          
          {/* Character Counter */}
          {value.length > 0 && (
            <Text style={styles.charCounter}>{value.length}/15</Text>
          )}
        </View>

        {/* Action Buttons Right */}
        <View style={styles.actionsContainer}>
          {/* Clear Button */}
          {value.length > 0 && !isLoading && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.clearIconWrapper}>
                <View style={styles.clearLine1} />
                <View style={styles.clearLine2} />
              </View>
            </TouchableOpacity>
          )}

          {/* Divider */}
          {value.length > 0 && (
            <View style={styles.divider} />
          )}

          {/* Search/Loading Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.searchButton,
                !isValidLength && styles.searchButtonDisabled,
              ]}
              onPress={handleSearch}
              disabled={!isValidLength || isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={styles.arrowIcon}>
                  <View style={styles.arrowLine} />
                  <View style={styles.arrowHead} />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Helper Section */}
      <View style={styles.helperSection}>
        {/* Validation Message */}
        {value.length > 0 && !isValidLength ? (
          <View style={styles.validationContainer}>
            <View style={styles.warningDot} />
            <Text style={styles.validationText}>
              Minimum 6 characters required
            </Text>
          </View>
        ) : (
          /* Examples */
          <View style={styles.examplesContainer}>
            <Text style={styles.exampleLabel}>Try: </Text>
            <TouchableOpacity
              onPress={() => {
                setValue('DL01AB1234');
                inputRef.current?.focus();
              }}
            >
              <Text style={styles.exampleChip}>DL01AB1234</Text>
            </TouchableOpacity>
            <Text style={styles.exampleSeparator}>or</Text>
            <TouchableOpacity
              onPress={() => {
                setValue('MH02CD5678');
                inputRef.current?.focus();
              }}
            >
              <Text style={styles.exampleChip}>MH02CD5678</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 6,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconLeft: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  searchIconContainer: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  searchIconCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.gray[500],
    position: 'absolute',
    top: 0,
    left: 1,
  },
  searchIconHandle: {
    width: 7,
    height: 2,
    backgroundColor: colors.gray[500],
    position: 'absolute',
    bottom: 2,
    right: 2,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  charCounter: {
    fontSize: 11,
    color: colors.gray[400],
    fontWeight: '600',
    marginLeft: 8,
    fontVariant: ['tabular-nums'],
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIconWrapper: {
    width: 12,
    height: 12,
    position: 'relative',
  },
  clearLine1: {
    width: 12,
    height: 1.5,
    backgroundColor: colors.gray[500],
    position: 'absolute',
    top: 5.25,
    left: 0,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  clearLine2: {
    width: 12,
    height: 1.5,
    backgroundColor: colors.gray[500],
    position: 'absolute',
    top: 5.25,
    left: 0,
    transform: [{ rotate: '-45deg' }],
    borderRadius: 1,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.gray[200],
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchButtonDisabled: {
    backgroundColor: colors.gray[200],
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  arrowIcon: {
    width: 18,
    height: 18,
    position: 'relative',
  },
  arrowLine: {
    width: 14,
    height: 2,
    backgroundColor: colors.white,
    position: 'absolute',
    top: 8,
    left: 0,
    borderRadius: 1,
  },
  arrowHead: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.white,
    position: 'absolute',
    top: 5,
    right: 1,
    transform: [{ rotate: '45deg' }],
  },
  helperSection: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.warning,
    marginRight: 8,
  },
  validationText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  examplesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  exampleLabel: {
    fontSize: 13,
    color: colors.gray[500],
    fontWeight: '500',
    marginRight: 8,
  },
  exampleChip: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: colors.pink[50],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
    }),
  },
  exampleSeparator: {
    fontSize: 12,
    color: colors.gray[400],
    marginHorizontal: 8,
    fontWeight: '500',
  },
});