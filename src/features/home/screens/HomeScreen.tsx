import React from 'react';
import { View, Text, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useLocation } from '../../location/hooks/useLocation';

const HomeScreen = () => {
  const location = useSelector((state: RootState) => state.location);
  const { getLocation } = useLocation();

  return (
    <View>
      <Text>Latitude: {location.latitude}</Text>
      <Text>Longitude: {location.longitude}</Text>
      <Button title="Refresh Location" onPress={getLocation} />
    </View>
  );
};

export default HomeScreen;
