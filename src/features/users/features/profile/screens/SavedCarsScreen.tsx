// SavedCarsScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSavedCars } from '../../../../../../src/store/slices/customerSlice';
import { RootState } from '../../../../../../src/store/store';

const Card = ({ item }: any) => (
  <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
    <Image source={{ uri: item.image }} style={{ width: 100, height: 70, borderRadius: 6 }} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={{ fontWeight: '600' }}>{item.title}</Text>
      <Text style={{ color: '#666' }}>{item.year} • {item.mileage} km</Text>
      <Text style={{ marginTop: 6 }}>₹{item.price}</Text>
    </View>
  </View>
);

const SavedCarsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const saved = useSelector((s: RootState) => s.customer.savedCars);

  useEffect(() => {
    dispatch(fetchSavedCars() as any);
  }, [dispatch]);

  return (
    <FlatList data={saved} keyExtractor={(i) => i.id} renderItem={({ item }) => <Card item={item} />} ListEmptyComponent={() => <Text style={{ padding: 16 }}>No saved cars yet.</Text>} />
  );
};

export default SavedCarsScreen;
