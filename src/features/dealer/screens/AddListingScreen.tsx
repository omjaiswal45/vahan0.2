import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addListing } from '../services/dealerAPI';
import { GlobalStyles, Spacing } from '../../../styles';

interface FormData {
  make: string;
  model: string;
  year: string;
  price: string;
  city: string;
}

const AddListingScreen = ({ navigation }: any) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    make: '',
    model: '',
    year: '',
    price: '',
    city: '',
  });
  const [images, setImages] = useState<string[]>([]);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  // --- Image Picker ---
  const pickImage = async () => {
    if (images.length >= 8) return Alert.alert('Maximum 8 images allowed');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newUri = result.assets[0].uri;
      setImages([...images, newUri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // --- Step Navigation ---
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // --- Submit Listing ---
  const submitListing = async () => {
    if (images.length === 0) return Alert.alert('Please add at least one image.');
    try {
      await addListing({ ...formData, images });
      Alert.alert('Success', 'Listing added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add listing');
    }
  };

  return (
    <ScrollView style={GlobalStyles.container}>
      <Text style={GlobalStyles.heading2}>Add Listing - Step {step}</Text>

      {/* --- Step 1: Basic Details --- */}
      {step === 1 && (
        <View style={{ marginTop: Spacing.md }}>
          <TextInput
            placeholder="Make"
            value={formData.make}
            onChangeText={(text) => handleChange('make', text)}
            style={GlobalStyles.input}
          />
          <TextInput
            placeholder="Model"
            value={formData.model}
            onChangeText={(text) => handleChange('model', text)}
            style={GlobalStyles.input}
          />
          <TextInput
            placeholder="Year"
            value={formData.year}
            onChangeText={(text) => handleChange('year', text)}
            keyboardType="numeric"
            style={GlobalStyles.input}
          />
          <TextInput
            placeholder="Price"
            value={formData.price}
            onChangeText={(text) => handleChange('price', text)}
            keyboardType="numeric"
            style={GlobalStyles.input}
          />
          <TextInput
            placeholder="City"
            value={formData.city}
            onChangeText={(text) => handleChange('city', text)}
            style={GlobalStyles.input}
          />
        </View>
      )}

      {/* --- Step 2: Images --- */}
      {step === 2 && (
        <View style={{ marginTop: Spacing.md }}>
          <Button title="Pick Image" onPress={pickImage} />
          <ScrollView horizontal style={{ marginTop: Spacing.sm }}>
            {images.map((uri, index) => (
              <View key={index} style={{ marginRight: Spacing.sm }}>
                <Image source={{ uri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
                <Button title="Remove" onPress={() => removeImage(index)} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* --- Step 3: Review --- */}
      {step === 3 && (
        <View style={{ marginTop: Spacing.md }}>
          <Text style={GlobalStyles.heading3}>Review Details:</Text>
          <Text>Make: {formData.make}</Text>
          <Text>Model: {formData.model}</Text>
          <Text>Year: {formData.year}</Text>
          <Text>Price: {formData.price}</Text>
          <Text>City: {formData.city}</Text>
          <Text>Images: {images.length}</Text>
        </View>
      )}

      {/* --- Navigation Buttons --- */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.lg }}>
        {step > 1 && <Button title="Back" onPress={prevStep} />}
        {step < 3 ? <Button title="Next" onPress={nextStep} /> : <Button title="Submit" onPress={submitListing} />}
      </View>
    </ScrollView>
  );
};

export default AddListingScreen;
