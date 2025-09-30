import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";

interface ModelSelectProps {
  value: string;
  onComplete: (val: string) => void;
  brand?: string; // selected brand to suggest models
}

const { width: screenWidth } = Dimensions.get("window");
const padding = 16;
const gap = 12;
const boxWidth = (screenWidth - padding * 2 - gap * 2) / 3; // 3 per row

const brandModels: Record<string, string[]> = {
  Maruti: ["Swift", "Baleno", "Dzire", "Brezza", "Alto"],
  Hyundai: ["i20", "i10", "Creta", "Verna", "Venue"],
  Honda: ["City", "Civic", "Amaze", "WR-V", "Jazz"],
  Toyota: ["Corolla", "Camry", "Fortuner", "Yaris", "Glanza"],
  Kia: ["Seltos", "Sonet", "Carnival", "Stinger", "EV6"],
};

export default function ModelSelect({ value, onComplete, brand }: ModelSelectProps) {
  const [models, setModels] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (brand && brandModels[brand]) {
      setModels(brandModels[brand]);
    } else {
      // default models if brand not selected
      setModels(Object.values(brandModels).flat());
    }
  }, [brand]);

  const filteredModels = models.filter((m) =>
    m.toLowerCase().includes(search.toLowerCase())
  );

  const renderModelBox = ({ item }: { item: string }) => (
    <TouchableOpacity
      key={item}
      style={styles.modelBox}
      onPress={() => onComplete(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.modelText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Model</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search model..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredModels}
        keyExtractor={(item) => item}
        renderItem={renderModelBox}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: gap }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  modelBox: {
    width: boxWidth,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  modelText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
