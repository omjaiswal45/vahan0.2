import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Text,
  View,
  ViewToken,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import ListingCard, { CarListing } from "../components/ListingCard";
import { getListings } from "../services/dealerAPI";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");
const CARD_MARGIN = 12; // margin from screen edges

const ListingsScreen = () => {
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const navigation = useNavigation<any>();

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleIds = new Set<string>();
      viewableItems.forEach((item) => {
        if (item.isViewable && item.item.id) visibleIds.add(item.item.id);
      });

      // Keep only top 2 visible
      const topTwo = Array.from(visibleIds).slice(0, 2);
      setVisibleItems(new Set(topTwo));
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getListings();
        setListings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      {/* Add Listing Button */}
      <View
        style={{
          paddingHorizontal: 16,
          marginVertical: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("AddListingStack")}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ff1ea5ff",
            paddingVertical: 14,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
            Add Listing
          </Text>
        </TouchableOpacity>
      </View>

      {/* Listings */}
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              width: screenWidth - CARD_MARGIN * 2,
              marginHorizontal: CARD_MARGIN,
            }}
          >
            <ListingCard
              listing={item}
              onPress={() =>
                navigation.navigate("ListingDetail", { id: item.id, listing: item })
              }
              autoplay={visibleItems.has(item.id)}
            />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false} // hide scroll bar
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            No listings available.
          </Text>
        }
      />
    </SafeAreaView>
  ); 
};

export default ListingsScreen;
