import React, { useRef } from "react";
import { View, StyleSheet, ScrollView, findNodeHandle } from "react-native";
import AttributeCard from "./AttributeCard";

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
  const scrollRef = useRef<ScrollView>(null);
  const cardRefs = useRef<any[]>([]);

const scrollToNext = (index: number) => {
  if (cardRefs.current[index + 1]) {
    cardRefs.current[index + 1].measureLayout(
      findNodeHandle(scrollRef.current),
      (_x: number, y: number) => {
        scrollRef.current?.scrollTo({ y: y - 16, animated: true });
      },
      () => {}
    );
  }
};


  const attributes = [
    { label: "Brand", value: brand, onChange: setBrand, required: true },
    { label: "Model", value: model, onChange: setModel, required: true },
    { label: "Make Year", value: makeYear, onChange: setMakeYear, required: true },
    { label: "Fuel Type", value: fuel, onChange: setFuel, required: true },
    { label: "Additional Fuel", value: additionalFuel, onChange: setAdditionalFuel, required: false },
    { label: "Ownership", value: ownership, onChange: setOwnership, required: true },
    { label: "Mileage (1000km)", value: mileage, onChange: setMileage, required: false },
    { label: "Color", value: color, onChange: setColor, required: true },
    { label: "Price", value: price, onChange: setPrice, required: true },
    { label: "Location", value: location, onChange: setLocation, required: true },
  ];

  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      {attributes.map((attr, index) => (
        <AttributeCard
          key={index}
          ref={(el: any) => (cardRefs.current[index] = el)}
          label={attr.label}
          value={attr.value}
          required={attr.required}
          onChange={attr.onChange}
          onComplete={() => scrollToNext(index)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
});
