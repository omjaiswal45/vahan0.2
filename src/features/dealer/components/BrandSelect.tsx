import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

interface BrandSelectProps {
  value: string;
  onComplete: (val: string) => void;
}

const { width } = Dimensions.get("window");

// Dummy brands data
const brandsData = [
  { id: "1", name: "Maruti", logo: "https://upload.wikimedia.org/wikipedia/en/2/29/Maruti_Suzuki_logo.png" },
  { id: "2", name: "Hyundai", logo: "https://1000logos.net/wp-content/uploads/2018/02/Hyundai-Logo.png" },
  { id: "3", name: "Honda", logo: "https://1000logos.net/wp-content/uploads/2018/02/Honda-logo.png" },
  { id: "4", name: "Toyota", logo: "https://1000logos.net/wp-content/uploads/2018/02/Toyota-logo.png" },
  { id: "5", name: "Ford", logo: "https://1000logos.net/wp-content/uploads/2018/02/Ford-logo.png" },
  { id: "6", name: "Kia", logo: "https://1000logos.net/wp-content/uploads/2018/02/Kia-logo.png" },
];

export default function BrandSelect({ value, onComplete }: BrandSelectProps) {
  const [search, setSearch] = useState("");
  const [filteredBrands, setFilteredBrands] = useState(brandsData);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = brandsData.filter((b) =>
      b.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBrands(filtered);
  };

  const handleSelect = (brand: string) => {
    onComplete(brand); // auto-advance handled in AddListingScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Car Brand</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search brand..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredBrands}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.brandCard}
            onPress={() => handleSelect(item.name)}
          >
            <Image source={{ uri: item.logo }} style={styles.logo} />
            <Text style={styles.brandName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  brandCard: {
    flex: 1,
    margin: 8,
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 6,
  },
  brandName: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
