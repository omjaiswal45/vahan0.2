import React, { useEffect } from 'react';
import { View, FlatList, Button, ActivityIndicator, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListings } from '../../../store/slices/dealerSlice';
import { RootState, AppDispatch } from '../../../store/store';
import ListingCard from '../components/ListingCard';

const ListingsScreen = ({ navigation }: any) => {
 const dispatch = useDispatch<AppDispatch>();

  const { listings, loading, error } = useSelector((state: RootState) => state.dealer);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  if (error) return <Text style={{ padding: 16, color: 'red' }}>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Add Listing" onPress={() => navigation.navigate('AddListing')} />
      <FlatList
        data={listings}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => navigation.navigate('ListingDetail', { id: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No listings available.</Text>}
      />
    </View>
  );
};

export default ListingsScreen;
