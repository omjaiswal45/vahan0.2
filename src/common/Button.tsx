import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean; //  Added disabled prop
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
}

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false, // default false
  style,
  variant = 'primary',
}: Props) => {
  const isDisabled = loading || disabled; //  combines both

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        isDisabled && styles.disabled, //  disabled style
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  primary: {
    backgroundColor: '#1E88E5', // Blue
  },
  secondary: {
    backgroundColor: '#FB8C00', // Orange
  },
  disabled: {
    backgroundColor: '#f44607ff',
    opacity: 0.7,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
