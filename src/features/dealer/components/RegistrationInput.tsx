// src/features/dealer/components/RegistrationInput.tsx
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

interface RegistrationInputProps {
  regNo: string;
  setRegNo: (val: string) => void;
  onFetch: () => void;
}

export default function RegistrationInput({ regNo, setRegNo, onFetch }: RegistrationInputProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>Enter Car Registration Number</Text>
      <TextInput
        value={regNo}
        onChangeText={setRegNo}
        placeholder="Enter registration number"
        style={styles.input}
      />
      <Button title="Fetch Details" onPress={onFetch} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 4, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
});
