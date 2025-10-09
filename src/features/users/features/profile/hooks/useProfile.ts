// src/features/users/features/profile/hooks/useprofile.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchprofile, fetchSavedCars, fetchMyListings } from '../../../../../../src/store/slices/customerSlice';
import type { RootState } from '../../../../../../src/store/store';

export function useprofile() {
  const dispatch = useDispatch();
  const { profile, savedCars, myListings, loading, error } = useSelector(
    (state: RootState) => state.customer
  );

  useEffect(() => {
    // fetch commonly used data
    dispatch(fetchprofile() as any);
    dispatch(fetchSavedCars() as any);
    dispatch(fetchMyListings() as any);
  }, [dispatch]);

  return {
    profile,
    savedCars,
    myListings,
    loading,
    error,
    refresh: () => {
      dispatch(fetchprofile() as any);
      dispatch(fetchSavedCars() as any);
      dispatch(fetchMyListings() as any);
    },
  };
}
