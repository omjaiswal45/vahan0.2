import { store, persistor } from '../store/store';
import { logout } from '../store/slices/authslice';

/**
 * Logout user and clear all persisted authentication data
 * Use this function when user wants to logout
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Dispatch logout action to reset auth state
    store.dispatch(logout());

    // Optionally purge persisted state completely (if you want full reset)
    // await persistor.purge();

    console.log('✅ User logged out successfully');
  } catch (error) {
    console.error('❌ Error during logout:', error);
  }
};

/**
 * Check if user is currently logged in
 */
export const isUserLoggedIn = (): boolean => {
  const state = store.getState();
  return state.auth.isVerified && state.auth.role !== null;
};

/**
 * Get current user role
 */
export const getCurrentUserRole = (): 'customer' | 'dealer' | null => {
  const state = store.getState();
  return state.auth.role;
};
