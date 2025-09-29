// src/features/dealer/screens/AddListingScreen.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RegistrationInput from "../components/RegistrationInput";
import CarForm from "../components/CarForm";
import BrandGrid from "../components/BrandGrid";

export default function AddListingScreen() {
  const navigation = useNavigation<any>();

  // -----------------------------
  // States for all car attributes
  // -----------------------------
  const [regNo, setRegNo] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [makeYear, setMakeYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [additionalFuel, setAdditionalFuel] = useState("");
  const [ownership, setOwnership] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  // -----------------------------
  // Dummy API fetch function
  // -----------------------------
  const handleFetch = () => {
    const dummyData = {
      brand: "Maruti",
      model: "Swift",
      makeYear: "2020",
      fuel: "Petrol",
      additionalFuel: "",
      ownership: "1st",
      mileage: "15000",
      color: "Red",
      price: "500000",
      location: "Delhi",
    };

    setBrand(dummyData.brand);
    setModel(dummyData.model);
    setMakeYear(dummyData.makeYear);
    setFuel(dummyData.fuel);
    setAdditionalFuel(dummyData.additionalFuel);
    setOwnership(dummyData.ownership);
    setMileage(dummyData.mileage);
    setColor(dummyData.color);
    setPrice(dummyData.price);
    setLocation(dummyData.location);
  };

  // -----------------------------
  // Dummy car brands
  // -----------------------------
  const carBrands = [
    {
      id: "1",
      name: "Maruti",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/2/29/Maruti_Suzuki_logo.png",
    },
    {
      id: "2",
      name: "Hyundai",
      logo: "https://1000logos.net/wp-content/uploads/2018/02/Hyundai-Logo.png",
    },
    {
      id: "3",
      name: "Honda",
      logo: "https://1000logos.net/wp-content/uploads/2018/02/Honda-logo.png",
    },
  ];

  // -----------------------------
  // Save / Publish Handlers
  // -----------------------------
  const handleSaveDraft = () => {
    console.log("Draft Saved:", {
      regNo,
      brand,
      model,
      makeYear,
      fuel,
      additionalFuel,
      ownership,
      mileage,
      color,
      price,
      location,
    });
    alert("Draft Saved (Dummy)");
  };

  const handlePublish = () => {
    console.log("Published:", {
      regNo,
      brand,
      model,
      makeYear,
      fuel,
      additionalFuel,
      ownership,
      mileage,
      color,
      price,
      location,
    });
    alert("Listing Published (Dummy)");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Add New Car Listing
      </Text>

      {/* Registration Number Input */}
      <RegistrationInput
        regNo={regNo}
        setRegNo={setRegNo}
        onFetch={handleFetch}
      />

      {/* Brand Selection */}
      <Text style={{ marginVertical: 12, fontWeight: "bold" }}>
        Or Select Car Brand
      </Text>
      <BrandGrid brands={carBrands} onSelect={setBrand} />

      {/* Car Form */}
      <CarForm
        brand={brand} setBrand={setBrand}
        model={model} setModel={setModel}
        makeYear={makeYear} setMakeYear={setMakeYear}
        fuel={fuel} setFuel={setFuel}
        additionalFuel={additionalFuel} setAdditionalFuel={setAdditionalFuel}
        ownership={ownership} setOwnership={setOwnership}
        mileage={mileage} setMileage={setMileage}
        color={color} setColor={setColor}
        price={price} setPrice={setPrice}
        location={location} setLocation={setLocation}
      />

      {/* Save / Publish Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
        <Button title="Save Draft" onPress={handleSaveDraft} />
        <Button title="Publish" onPress={handlePublish} />
      </View>
    </ScrollView>
  );
}
