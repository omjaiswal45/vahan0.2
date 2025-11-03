import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "../../../store/slices/locationSlice";
import { RootState } from "../../../store/store";
import citiesData from "../../../utils/Indian_Cities_In_States.json";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LocationSelectProps {
  tabBarHeight?: number;
  carData: any;
  onComplete: (data: any) => void;
}

interface CityItem {
  city: string;
  state: string;
  display: string;
}

export default function LocationSelect({ tabBarHeight = 60, carData, onComplete }: LocationSelectProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const currentCity = useSelector((state: RootState) => state.location.city);
  const [searchQuery, setSearchQuery] = useState(currentCity || "");

  const allCities = useMemo<CityItem[]>(() => {
    const result: CityItem[] = [];
    Object.entries(citiesData).forEach(([state, cityList]) => {
      (cityList as string[]).forEach((city) => {
        result.push({ city, state, display: `${city}, ${state}` });
      });
    });
    return result;
  }, []);

  const suggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return allCities
      .filter(
        (c) =>
          c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [searchQuery, allCities]);

  const handleSelect = (item: CityItem) => {
    dispatch(setCity(item.city));
    setSearchQuery(item.city);
  };

  const handleClear = () => setSearchQuery("");

  const handleNext = () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter/select a city");
      return;
    }

    const selected = allCities.find(
      (c) => c.city.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    const finalLocation = selected || { city: searchQuery.trim(), state: "" };

    dispatch(setCity(finalLocation.city));

    const finalCityString = `${finalLocation.city}${finalLocation.state ? ", " + finalLocation.state : ""}`;

    const finalCarData = {
      ...carData,
      location: finalCityString,
    };

    console.log("📦 Full Car Data:", finalCarData);

    onComplete(finalCarData);

    // Navigate to ImagePickerScreen with car data
    navigation.navigate("ImagePickerScreen", { carData: finalCarData });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
          keyboardShouldPersistTaps="handled"
        >
        <Text style={styles.title}>Select Your Location</Text>
        <Text style={styles.subtitle}>Enter your city or select from suggestions</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#777" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search city or state..."
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons name="close-circle" size={22} color="#777" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={suggestions}
          keyExtractor={(item, i) => `${item.city}-${i}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.row}>
              <Ionicons name="location" size={22} color="#667eea" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.city}>{item.city}</Text>
                <Text style={styles.state}>{item.state}</Text>
              </View>
              {item.city === currentCity && <Ionicons name="checkmark-circle" size={20} color="#667eea" />}
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyBox}>
              <Ionicons name="sad-outline" size={80} color="#ccc" />
              <Text style={styles.emptyTitle}>
                {searchQuery.trim() === "" ? "Search your city" : "No results found"}
              </Text>
              <Text style={styles.emptySub}>
                {searchQuery.trim() === "" ? "Type your city or state to get suggestions" : "Try different spelling or keywords"}
              </Text>
            </View>
          )}
        />
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={styles.submitWrapper}>
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: searchQuery.trim() ? "#ff1ea5" : "#ccc" }]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!searchQuery.trim()}
            >
              <Text style={styles.submitText}>Next</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" },
  keyboardView: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollView: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#666", fontWeight: "400", marginBottom: 20 },
  searchBar: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 16 },
  input: { flex: 1, fontSize: 16, color: "#333", marginLeft: 8 },
  row: { flexDirection: "row", alignItems: "center", padding: 14, backgroundColor: "#fff", borderRadius: 12, marginBottom: 6 },
  city: { fontSize: 16, fontWeight: "600", color: "#222" },
  state: { fontSize: 13, color: "#777" },
  emptyBox: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginTop: 12 },
  emptySub: { fontSize: 14, color: "#777", textAlign: "center", marginTop: 4 },
  submitWrapper: { backgroundColor: "transparent" },
  submitContainer: { backgroundColor: "#FAFAFA", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderTopWidth: 1, borderTopColor: "#f0f0f0", ...Platform.select({ ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 8 } }) },
  submitButton: { borderRadius: 14, paddingVertical: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", shadowColor: "#ff1ea5", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "700", marginRight: 8 },
  arrow: { color: "#fff", fontSize: 20, fontWeight: "700" },
});
