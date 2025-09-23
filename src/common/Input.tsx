import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

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
    borderColor: '#1E88E5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default Input;
