import React, { useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeads } from '../../../store/slices/dealerSlice';
import { RootState,AppDispatch } from '../../../store/store';

const LeadsScreen = ({ navigation }: any) => {
const dispatch = useDispatch<AppDispatch>();

  const { leads, loading, error } = useSelector((state: RootState) => state.dealer);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  if (error) return <Text style={{ padding: 16, color: 'red' }}>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={leads}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 12, borderBottomWidth: 0.5 }}
            onPress={() => navigation.navigate('Chat', { leadId: item.id })}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.customerName}</Text>
            <Text>{item.carModel}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No leads available.</Text>}
      />
    </View>
  );
};

export default LeadsScreen;
