import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../../../store/slices/dealerSlice';
import { AppDispatch, RootState } from '../../../store/store';

import KPIBox from '../components/KPIBox';

const DashboardScreen = () => {
 const dispatch = useDispatch<AppDispatch>();

  const { dashboard, loading, error } = useSelector((state: RootState) => state.dealer);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  if (error) return <Text style={{ padding: 16, color: 'red' }}>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Dashboard</Text>

      {dashboard && (
        <View style={{ marginTop: 16 }}>
          <KPIBox title="Total Listings" value={dashboard.totalListings} />
          <KPIBox title="New Leads" value={dashboard.newLeads} />
        </View>
      )}

      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Recent Activity</Text>
      <FlatList
        data={dashboard?.recentActivity || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 8, borderBottomWidth: 0.5 }}>{item}</Text>
        )}
      />
    </View>
  );
};

export default DashboardScreen;
