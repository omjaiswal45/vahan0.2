import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  FlatList,
  Animated 
} from "react-native";

interface ColorSelectProps {
  value: string;
  onComplete: (val: string) => void;
}

export default function ColorSelect({ value, onComplete }: ColorSelectProps) {
  const [selectedColor, setSelectedColor] = useState(value);
  const [searchQuery, setSearchQuery] = useState("");

  // Most popular car colors based on real-world data (sorted by popularity)
  const carColors = [
    { name: "White", hex: "#FFFFFF", popular: true },
    { name: "Black", hex: "#000000", popular: true },
    { name: "Gray", hex: "#808080", popular: true },
    { name: "Silver", hex: "#C0C0C0", popular: true },
    { name: "Blue", hex: "#1E3A8A", popular: true },
    { name: "Red", hex: "#DC2626", popular: true },
    { name: "Brown", hex: "#78350F", popular: false },
    { name: "Green", hex: "#166534", popular: false },
    { name: "Beige", hex: "#D4B896", popular: false },
    { name: "Orange", hex: "#EA580C", popular: false },
    { name: "Gold", hex: "#D4AF37", popular: false },
    { name: "Yellow", hex: "#EAB308", popular: false },
    { name: "Purple", hex: "#7C3AED", popular: false },
    { name: "Pink", hex: "#EC4899", popular: false },
    { name: "Burgundy", hex: "#7F1D1D", popular: false },
    { name: "Navy Blue", hex: "#1E3A8A", popular: false },
    { name: "Charcoal", hex: "#374151", popular: false },
    { name: "Pearl White", hex: "#F8FAFC", popular: false },
    { name: "Metallic Blue", hex: "#3B82F6", popular: false },
    { name: "Dark Green", hex: "#14532D", popular: false },
    { name: "Champagne", hex: "#F7E7CE", popular: false },
    { name: "Bronze", hex: "#92400E", popular: false },
    { name: "Maroon", hex: "#881337", popular: false },
    { name: "Teal", hex: "#0F766E", popular: false },
  ];

  const filteredColors = carColors.filter(color => 
    color.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (colorName: string) => {
    setSelectedColor(colorName);
    onComplete(colorName);
  };

  const renderColorItem = ({ item }: { item: typeof carColors[0] }) => {
    const isSelected = selectedColor === item.name;
    const isLight = ["White", "Pearl White", "Beige", "Champagne", "Yellow", "Gold"].includes(item.name);

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item.name)}
        activeOpacity={0.7}
        style={[
          styles.colorCard,
          isSelected && styles.selectedCard
        ]}
      >
        <View style={styles.colorPreview}>
          <View 
            style={[
              styles.colorCircle, 
              { backgroundColor: item.hex },
              isLight && styles.lightColorBorder
            ]} 
          />
          {isSelected && (
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          )}
        </View>
        <View style={styles.colorInfo}>
          <Text style={[styles.colorName, isSelected && styles.selectedText]}>
            {item.name}
          </Text>
          {item.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Color</Text>
        <Text style={styles.subtitle}>Choose your vehicle's color</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search colors..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchQuery === "" && (
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Most Popular</Text>
        </View>
      )}

      <FlatList
        data={filteredColors}
        renderItem={renderColorItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No colors found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    fontWeight: "400",
  },
  searchContainer: {
    position: "relative",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    padding: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d1d1d6",
    borderRadius: 12,
  },
  clearText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  popularSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  listContent: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  colorCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    borderColor: "#007AFF",
    borderWidth: 2.5,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  colorPreview: {
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  colorCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  lightColorBorder: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  checkCircle: {
    position: "absolute",
    bottom: -4,
    right: "50%",
    transform: [{ translateX: 18 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  checkMark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  colorInfo: {
    alignItems: "center",
  },
  colorName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 6,
  },
  selectedText: {
    color: "#007AFF",
    fontWeight: "700",
  },
  popularBadge: {
    backgroundColor: "#FFD60A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  popularText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});