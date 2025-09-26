// screens/AddListingScreen.tsx
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import RegistrationInput from "../components/RegistrationInput";
import { useNavigation } from "@react-navigation/native";

const carBrands = [
  { id: "1", name: "Maruti", logo: "https://upload.wikimedia.org/wikipedia/en/2/29/Maruti_Suzuki_logo.png" },
  { id: "2", name: "Hyundai", logo: "https://1000logos.net/wp-content/uploads/2018/02/Hyundai-Logo.png" },
  { id: "3", name: "Honda", logo: "https://1000logos.net/wp-content/uploads/2018/02/Honda-logo.png" },
  { id: "4", name: "Tata", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Tata_logo.svg/2560px-Tata_logo.svg.png" },
  { id: "5", name: "Mahindra", logo: "https://upload.wikimedia.org/wikipedia/en/0/05/Mahindra_new_logo.png" },
];

export default function AddListingScreen() {
  const [regNo, setRegNo] = useState("");
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
        Add New Car Listing
      </Text>

      {/* Registration Number Entry */}
      <RegistrationInput
        regNo={regNo}
        setRegNo={setRegNo}
        onFetch={() => {
          // TODO: fetch details via API
          navigation.navigate("CarForm", { regNo });
        }}
      />

      <Text style={{ marginVertical: 12, fontWeight: "bold" }}>
        Or Select Car Brand
      </Text>

      {/* Logos Grid */}
      <FlatList
        data={carBrands}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flex: 1,
              margin: 8,
              alignItems: "center",
              padding: 12,
              borderWidth: 1,
              borderRadius: 8,
            }}
            onPress={() => navigation.navigate("ModelSelect", { brand: item.name })}
          >
            <Image
              source={{ uri: item.logo }}
              style={{ width: 60, height: 60, resizeMode: "contain" }}
            />
            <Text style={{ marginTop: 6 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
