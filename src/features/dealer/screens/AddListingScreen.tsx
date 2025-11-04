import React, { useRef, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Spacing } from "../../../styles/spacing";

// Attribute components
import RegistrationInput from "../components/RegistrationInput";
import BrandSelect from "../components/BrandSelect";
import ModelSelect from "../components/ModelSelect";
import YearSelect from "../components/YearSelect";
import FuelSelect from "../components/FuelSelect";
import PriceInput from "../components/PriceInput";
import LocationSelect from "../components/LocationSelect";
import AttributeBreadcrumb from "../components/AttributeBreadcrumb";
import KmInput from "../components/KmInput";
import OwnerSelect from "../components/OwnerNumberSelect";
import TransmissionSelect from "../components/TransmissionSelect";

const { width } = Dimensions.get("window");

export default function AddListingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const breadcrumbScrollRef = useRef<ScrollView>(null);

  const [currentStep, setCurrentStep] = useState(0);

  const [registration, setRegistration] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [km, setKm] = useState("");
  const [owner, setOwner] = useState("");
  const [transmission, setTransmission] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const steps = [
    "Registration",
    "Brand",
    "Model",
    "Year",
    "Fuel",
    "KM",
    "Owner",
    "Transmission",
    "Price",
    "Location",
  ];

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentStep(index);

      // scroll breadcrumb automatically
      setTimeout(() => {
        if (breadcrumbScrollRef.current) {
          breadcrumbScrollRef.current.scrollTo({ x: index * 80, animated: true });
        }
      }, 100);
    }
  };

  const attributes = [
    {
      key: "registration",
      component: (
        <RegistrationInput
          value={registration}
          onComplete={(val: string) => {
            setRegistration(val);
            scrollToIndex(1);
          }}
          onChooseBrand={(brandName) => {
            if (brandName === "more") {
              scrollToIndex(1);
            } else {
              setBrand(brandName);
              scrollToIndex(2);
            }
          }}
        />
      ),
    },
    {
      key: "brand",
      component: (
        <BrandSelect
          value={brand}
          onComplete={(val: string) => {
            setBrand(val);
            scrollToIndex(2);
          }}
        />
      ),
    },
    {
      key: "model",
      component: (
        <ModelSelect
          value={model}
          onComplete={(val: string) => {
            setModel(val);
            scrollToIndex(3);
          }}
        />
      ),
    },
    {
      key: "year",
      component: (
        <YearSelect
          value={year}
          onComplete={(val: string) => {
            setYear(val);
            scrollToIndex(4);
          }}
        />
      ),
    },
    {
      key: "fuel",
      component: (
        <FuelSelect
          value={fuel}
          onComplete={(val: string) => {
            setFuel(val);
            scrollToIndex(5);
          }}
        />
      ),
    },
    {
      key: "km",
      component: (
        <KmInput
          value={km}
          onComplete={(val: string) => {
            setKm(val);
            scrollToIndex(6);
          }}
        />
      ),
    },
    {
      key: "owner",
      component: (
        <OwnerSelect
          value={owner}
          onComplete={(val: string) => {
            setOwner(val);
            scrollToIndex(7);
          }}
        />
      ),
    },
    {
      key: "transmission",
      component: (
        <TransmissionSelect
          value={transmission}
          onComplete={(val: string) => {
            setTransmission(val);
            scrollToIndex(8);
          }}
        />
      ),
    },
    {
      key: "price",
      component: (
        <PriceInput
          value={price}
          onComplete={(val: string) => {
            setPrice(val);
            scrollToIndex(9);
          }}
        />
      ),
    },
    {
      key: "location",
      component: (
        <LocationSelect
          tabBarHeight={60}
          carData={{
            registration,
            brand,
            model,
            year,
            fuel,
            km,
            owner,
            transmission,
            price,
            location,
          }}
          onComplete={(finalCarData) => {
            console.log("✅ Final Data from LocationSelect:", finalCarData);
          }}
        />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Breadcrumb at top */}
      <View style={styles.breadcrumbContainer}>
        <ScrollView
          ref={breadcrumbScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center", paddingHorizontal: Spacing.sm }}
        >
          <AttributeBreadcrumb
            steps={steps}
            currentIndex={currentStep}
            onStepPress={scrollToIndex}
          />
        </ScrollView>
      </View>

      {/* Horizontal cards for each attribute */}
      <View style={styles.flatListContainer}>
        <FlatList
          ref={flatListRef}
          data={attributes}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {item.component}
            </View>
          )}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  breadcrumbContainer: {
    height: 60,
    backgroundColor: "#fff",
  },
  flatListContainer: {
    flex: 1,
  },
  itemContainer: {
    width,
    flex: 1,
  },
});
