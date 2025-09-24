import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const ListingDetailScreen = ({ route }: any) => {
  const { id } = route.params;

  useEffect(() => {
    // Fetch listing detail by ID
  }, [id]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Listing Detail - ID: {id}</Text>
      <Button title="Edit" onPress={() => console.log('Edit Listing')} />
    </View>
  );
};

export default ListingDetailScreen;
