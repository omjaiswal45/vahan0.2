import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Car } from "../types.ts/types";

// Define props type
type CarFormProps = {
  car: Car;
  onSubmit: (data: { price: number; km: number; city: string }) => void | Promise<void>;
  loading: boolean;
};

export default function CarForm({ car, onSubmit, loading }: CarFormProps) {
  const [price, setPrice] = useState("");
  const [km, setKm] = useState("");
  const [city, setCity] = useState("");

  return (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
        {car.make} {car.model} ({car.year})
      </Text>
      <Text>Fuel: {car.fuel}</Text>
      <Text>Transmission: {car.transmission}</Text>

      <TextInput
        placeholder="Enter Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />

      <TextInput
        placeholder="Enter KM Driven"
        value={km}
        onChangeText={setKm}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />

      <TextInput
        placeholder="Enter City"
        value={city}
        onChangeText={setCity}
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />

      <Button
        title={loading ? "Saving..." : "Save Listing"}
        onPress={() =>
          onSubmit({
            price: Number(price),
            km: Number(km),
            city,
          })
        }
      />
    </View>
  );
}
