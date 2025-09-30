import React, { forwardRef, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";

interface AttributeCardProps {
  label: string;
  value: string;
  required?: boolean;
  onChange: (val: string) => void;
  onComplete?: () => void; // called when user finishes input
}

const AttributeCard = forwardRef<any, AttributeCardProps>(
  ({ label, value, required = false, onChange, onComplete }, ref) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleChange = (text: string) => {
      setInputValue(text);
      onChange(text);
    };

    const handleBlur = () => {
      // Trigger auto-advance when input is filled
      if (inputValue && onComplete) {
        onComplete();
      }
    };

    return (
      <View ref={ref} style={styles.card}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleChange}
          onBlur={handleBlur}
          placeholder={`Enter ${label}`}
          returnKeyType="next"
        />
      </View>
    );
  }
);

export default AttributeCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
  },
});
