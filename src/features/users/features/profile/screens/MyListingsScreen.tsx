// MyListingsScreen.tsx
import React, { useEffect } from 'react';
import { FlatList, Text, Image, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyListings } from '../../../../../../src/store/slices/customerSlice';
import { RootState } from '../../../../../../src/store/store';

const Item = ({ item }: any) => (
  <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
    <Image source={{ uri: item.image }} style={{ width: 120, height: 80, borderRadius: 6 }} />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={{ fontWeight: '700' }}>{item.title}</Text>
      <Text style={{ color: '#666' }}>{item.city} • {item.year}</Text>
      <Text style={{ marginTop: 6 }}>₹{item.price}</Text>
    </View>
  </View>
);

const MyListingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const listings = useSelector((s: RootState) => s.customer.myListings);

  useEffect(() => {
    dispatch(fetchMyListings() as any);
  }, [dispatch]);

  return (
    <FlatList data={listings} keyExtractor={(i) => i.id} renderItem={({ item }) => <Item item={item} />} ListEmptyComponent={() => <Text style={{ padding: 16 }}>No listings found.</Text>} />
  );
};

export default MyListingsScreen;
