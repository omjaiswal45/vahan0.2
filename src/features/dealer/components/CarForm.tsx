// src/features/dealer/components/CarForm.tsx
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface CarFormProps {
  brand: string;
  setBrand: (val: string) => void;
  model: string;
  setModel: (val: string) => void;
  makeYear: string;
  setMakeYear: (val: string) => void;
  fuel: string;
  setFuel: (val: string) => void;
  additionalFuel: string;
  setAdditionalFuel: (val: string) => void;
  ownership: string;
  setOwnership: (val: string) => void;
  mileage: string;
  setMileage: (val: string) => void;
  color: string;
  setColor: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
}

export default function CarForm({
  brand,
  setBrand,
  model,
  setModel,
  makeYear,
  setMakeYear,
  fuel,
  setFuel,
  additionalFuel,
  setAdditionalFuel,
  ownership,
  setOwnership,
  mileage,
  setMileage,
  color,
  setColor,
  price,
  setPrice,
  location,
  setLocation,
}: CarFormProps) {
  const renderInput = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    placeholder?: string
  ) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || label}
        style={styles.input}
      />
    </View>
  );

  return (
    <View>
      {renderInput("Brand", brand, setBrand)}
      {renderInput("Model", model, setModel)}
      {renderInput("Make / Year", makeYear, setMakeYear)}
      {renderInput("Fuel Type", fuel, setFuel)}
      {renderInput("Additional Fuel", additionalFuel, setAdditionalFuel)}
      {renderInput("Ownership", ownership, setOwnership)}
      {renderInput("Mileage (KM)", mileage, setMileage)}
      {renderInput("Color", color, setColor)}
      {renderInput("Price", price, setPrice)}
      {renderInput("Location", location, setLocation)}
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
  },
});
