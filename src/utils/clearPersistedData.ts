import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '../store/store';

/**
 * Clear all persisted Redux state data
 * Useful for debugging or when users experience login issues
 *
 * Usage:
 * import { clearPersistedData } from './utils/clearPersistedData';
 * await clearPersistedData();
 */
export const clearPersistedData = async (): Promise<void> => {
  try {
    // Purge the persistor
    await persistor.purge();

    // Clear AsyncStorage completely (optional - use with caution)
    // await AsyncStorage.clear();

    console.log('✅ Persisted data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing persisted data:', error);
  }
};

/**
 * Clear specific keys from AsyncStorage
 */
export const clearSpecificKeys = async (keys: string[]): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(keys);
    console.log('✅ Specific keys cleared:', keys);
  } catch (error) {
    console.error('❌ Error clearing keys:', error);
  }
};

/**
 * Get all stored keys in AsyncStorage (for debugging)
 */
export const getAllStorageKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('📦 All storage keys:', keys);
    return keys;
  } catch (error) {
    console.error('❌ Error getting storage keys:', error);
    return [];
  }
};
