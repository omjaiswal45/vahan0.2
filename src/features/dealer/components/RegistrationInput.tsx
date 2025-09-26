import React from "react";
import { View, TextInput, Button } from "react-native";

// Props type define करो
type RegistrationInputProps = {
  regNo: string;
  setRegNo: (val: string) => void;
  onFetch: () => void;
};

export default function RegistrationInput({
  regNo,
  setRegNo,
  onFetch,
}: RegistrationInputProps) {
  return (
    <View style={{ marginVertical: 12 }}>
      <TextInput
        placeholder="Enter Registration Number"
        value={regNo}
        onChangeText={setRegNo}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 10,
          marginBottom: 8,
        }}
      />
      <Button title="Fetch Car Details" onPress={onFetch} />
    </View>
  );
}
