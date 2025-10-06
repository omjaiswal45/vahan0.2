import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
} from "react-native";

interface RegistrationInputProps {
  value: string;
  onComplete: (val: string) => void;
  onChooseBrand: (brand: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const padding = 16;
const gap = 12;

const popularBrands = [
  { id: "1", name: "Maruti", logo: "https://static.vecteezy.com/system/resources/previews/020/336/024/non_2x/maruti-logo-maruti-icon-free-free-vector.jpg" },
  { id: "2", name: "Hyundai", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRM_Xtp5Yzs_-y7sxk344C59OX5kEaZIb2LA&s" },
  { id: "3", name: "Honda", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR08y9H67CSKglmuSWh8jGdeQt9xmJnogNKTQ&s" },
  { id: "4", name: "Toyota", logo: "https://1000logos.net/wp-content/uploads/2018/02/Toyota-logo.png" },
  { id: "5", name: "Kia", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6LXHdTPrqcQ3cXNbfD9c4gg3J2IHCR54jfg&s" },
];


export default function RegistrationInput({
  value,
  onComplete,
  onChooseBrand,
}: RegistrationInputProps) {
  const [reg, setReg] = useState(value);
  const brandCardWidth = (screenWidth - padding * 2 - gap * 2) / 3;

  const handleFetch = () => {
    if (reg.trim()) onComplete(reg.trim());
  };

  const renderBrandCard = (
    brand: typeof popularBrands[0],
    isMore = false,
    key: string
  ) => {
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        key={key}
        style={{ transform: [{ scale }], marginRight: gap }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChooseBrand(isMore ? "more" : brand.name)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.brandCard,
            isMore && styles.moreCard,
            { width: brandCardWidth },
          ]}
        >
          {!isMore && <Image source={{ uri: brand.logo }} style={styles.logo} />}
          <Text
            style={[
              styles.brandName,
              isMore && { color: "#4caf50", fontSize: 18 },
            ]}
          >
            {isMore ? "More →" : brand.name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <Text style={styles.title}>Enter Registration Number</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Registration Number"
        value={reg}
        onChangeText={setReg}
      />

      <TouchableOpacity style={styles.fetchBtn} onPress={handleFetch}>
        <Text style={{ color: "#fff", fontWeight: "800" }}>Fetch Details</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or Choose Brand</Text>

      {/* First Row: 3 cards */}
      <View style={styles.row}>
        {popularBrands.slice(0, 3).map((b) => renderBrandCard(b, false, b.id))}
      </View>

      {/* Second Row: 2 cards + More */}
      <View style={styles.row}>
        {popularBrands.slice(3).map((b) => renderBrandCard(b, false, b.id))}
        {renderBrandCard({ id: "more", name: "More", logo: "" }, true, "more")}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding,
    justifyContent: "center",
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  fetchBtn: {
    backgroundColor: "#f000a8ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  orText: {
    marginVertical: 16,
    fontWeight: "600",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: gap,
  },
  brandCard: {
    height: 110,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  moreCard: {
    borderWidth: 2,
    borderColor: "#ff1ea5ff",
    backgroundColor: "#e8f5e9",
  },
  logo: { width: 50, height: 50, resizeMode: "contain", marginBottom: 6 },
  brandName: { fontWeight: "600", fontSize: 14, textAlign: "center" },
});
