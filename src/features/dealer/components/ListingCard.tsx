import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ListingCarousel from "./ListingCarousel";
import { Ionicons } from "@expo/vector-icons";

export interface CarListing {
  id: string;
  title: string;
  price: string;
  year: number;
  km: string;
  fuel: string;
  images: string[];
  city: string;
  make: string;
  model: string;
}

interface ListingCardProps {
  listing: CarListing;
  onPress: () => void;
  autoplay?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress, autoplay = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.card}
    >
      {/* Carousel */}
      <View style={{ position: "relative" }}>
        <ListingCarousel images={listing.images} autoplay={autoplay} />

        {/* Year Badge */}
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>{listing.year}</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleText}>
            {listing.make} {listing.model}
          </Text>
          <Text style={styles.priceText}>{listing.price}</Text>

          <View style={styles.specsContainer}>
            <Ionicons name="speedometer-outline" size={16} color="#555" />
            <Text style={styles.specText}>{listing.km}</Text>
            <Ionicons name="flame-outline" size={16} color="#555" />
            <Text style={styles.specText}>{listing.fuel}</Text>
          </View>
        </View>

        {/* Location Badge */}
        <TouchableOpacity style={styles.locationBadge} activeOpacity={0.7}>
          <Ionicons name="location-outline" size={16} color="#000000ff" />
          <Text style={styles.locationText}>{listing.city}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  yearBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#303132ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  yearText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff1ea5ff",
    marginBottom: 6,
  },
  specsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  specText: {
    marginLeft: 4,
    color: "#555",
    marginRight: 12,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef63b7ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    shadowColor: "#ff1ea5ff",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  locationText: {
    marginLeft: 4,
    color: "#111212ff",
    fontWeight: "600",
  },
});

export default ListingCard;
