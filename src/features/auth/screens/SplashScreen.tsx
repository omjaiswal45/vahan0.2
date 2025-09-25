import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useNavigation } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync(); // Keep native splash visible

const SplashScreenComponent = () => {
  const navigation = useNavigation<any>(); // Quick fix
  const { role, isVerified } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync(); // Hide native splash
      if (isVerified && role === 'dealer') navigation.replace('DealerTabs');
      else if (isVerified && role === 'customer') navigation.replace('CustomerTabs');
      else navigation.replace('AuthNavigator');
    }, 1500); // 1.5 sec splash animation

    return () => clearTimeout(timer);
  }, [role, isVerified]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../../assets/animations/splash.json')}
        autoPlay
        loop={false}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default SplashScreenComponent;
