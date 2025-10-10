import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Spacing } from '../styles';

interface Props extends TextInputProps {
  value: string;
  onChangeText: (t: string) => void;
}

const Input = ({ value, onChangeText, style, ...props }: Props) => (
  <TextInput
    style={[styles.input, style]}
    value={value}
    onChangeText={onChangeText}
    placeholderTextColor="#888"
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    borderRadius: 10,
    marginBottom: Spacing.md,
    fontSize: 16,
    backgroundColor: Colors.card,
  },
});

export default Input;
