import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { setLocation } from '../../../store/slices/locationSlice';
import { useEffect } from 'react';

export const useLocation = () => {
  const dispatch = useDispatch();

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    dispatch(setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }));
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { getLocation };
};
