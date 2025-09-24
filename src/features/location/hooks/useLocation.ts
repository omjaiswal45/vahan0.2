import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { setLocation, setCity } from '../../../store/slices/locationSlice';
import { useEffect } from 'react';

export const useLocation = () => {
  const dispatch = useDispatch();

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      dispatch(
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      );

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];

        // ✅ Use city instead of district
        const cityName =
          place.city ??
          place.subregion ??
          place.district ??
          place.region ??
          (place as any).state ??
          'Unknown';

        dispatch(setCity(cityName));
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { getLocation };
};
