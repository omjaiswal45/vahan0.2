// src/features/dealer/components/BrandGrid.tsx
import React from "react";
import { View, FlatList, TouchableOpacity, Image, Text } from "react-native";

interface Brand {
  id: string;
  name: string;
  logo: string;
}

interface BrandGridProps {
  brands: Brand[];
  onSelect: (brandName: string) => void;
}

export default function BrandGrid({ brands, onSelect }: BrandGridProps) {
  return (
    <FlatList
      data={brands}
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
          onPress={() => onSelect(item.name)}
        >
          <Image
            source={{ uri: item.logo }}
            style={{ width: 60, height: 60, resizeMode: "contain" }}
          />
          <Text style={{ marginTop: 6 }}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
