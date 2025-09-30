import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";

interface YearSelectProps {
  value: string;
  onComplete: (val: string) => void;
}

export default function YearSelect({ value, onComplete }: YearSelectProps) {
  const [selectedYear, setSelectedYear] = useState(value);
  const [searchQuery, setSearchQuery] = useState("");

  const currentYear = new Date().getFullYear();
  const startYear = 1980;
  const yearRange = currentYear - startYear + 1;
  const years = Array.from({ length: yearRange }, (_, i) => (startYear + i).toString()).reverse();

  const filteredYears = years.filter(year => year.includes(searchQuery));

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedYear;
    
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedYear(item);
          onComplete(item);
        }}
        activeOpacity={0.7}
        style={[styles.yearChip, isSelected && styles.selectedChip]}
      >
        <Text style={[styles.yearText, isSelected && styles.selectedText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Year</Text>
      <Text style={styles.subtitle}>Choose your vehicle's make year</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search year..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          keyboardType="numeric"
          maxLength={4}
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
      
      <FlatList
        data={filteredYears}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
    fontWeight: "400",
  },
  searchContainer: {
    position: "relative",
    marginBottom: 24,
  },
  searchInput: {
    height: 48,
    backgroundColor: "#f5f5f7",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  clearButton: {
    position: "absolute",
    right: 12,
    top: 12,
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
  listContent: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  yearChip: {
    width: "31%",
    aspectRatio: 2.2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f5f5f7",
    borderWidth: 1.5,
    borderColor: "#e5e5ea",
  },
  selectedChip: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    transform: [{ scale: 1.05 }],
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  yearText: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "700",
  },
});