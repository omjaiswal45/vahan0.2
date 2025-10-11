// src/features/users/features/buyUsedCar/hooks/useBuyUsedCar.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { buyUsedCarAPI } from '../services/buyUsedCarAPI';
import { Car, CarsResponse, CarFilters, FilterOptions } from '../types';

export const useBuyUsedCar = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const isFetchingRef = useRef(false);
  const filtersRef = useRef<CarFilters | undefined>(undefined);
  const searchQueryRef = useRef<string>('');

  // Fetch cars with pagination
  const fetchCars = useCallback(async (
    pageNum: number = 1,
    filters?: CarFilters,
    searchQuery?: string,
    append: boolean = false
  ) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setError(null);

    if (!append) {
      setLoading(true);
    }

    try {
      let response: CarsResponse;

      if (searchQuery && searchQuery.trim()) {
        response = await buyUsedCarAPI.searchCars(searchQuery, pageNum, 10, filters);
      } else {
        response = await buyUsedCarAPI.getCars(pageNum, 10, filters);
      }

      if (append) {
        setCars(prev => [...prev, ...response.cars]);
      } else {
        setCars(response.cars);
      }

      setHasMore(response.meta.hasNextPage);
      setTotalItems(response.meta.totalItems);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cars');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Load more cars
  const loadMore = useCallback(() => {
    if (!loading && hasMore && !isFetchingRef.current) {
      fetchCars(page + 1, filtersRef.current, searchQueryRef.current, true);
    }
  }, [loading, hasMore, page, fetchCars]);

  // Refresh cars
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await fetchCars(1, filtersRef.current, searchQueryRef.current, false);
    setRefreshing(false);
  }, [fetchCars]);

  // Apply filters
  const applyFilters = useCallback((filters: CarFilters) => {
    filtersRef.current = filters;
    setPage(1);
    fetchCars(1, filters, searchQueryRef.current, false);
  }, [fetchCars]);

  // Search cars
  const searchCars = useCallback((query: string) => {
    searchQueryRef.current = query;
    setPage(1);
    fetchCars(1, filtersRef.current, query, false);
  }, [fetchCars]);

  // Clear filters
  const clearFilters = useCallback(() => {
    filtersRef.current = undefined;
    setPage(1);
    fetchCars(1, undefined, searchQueryRef.current, false);
  }, [fetchCars]);

  // Initial fetch
  useEffect(() => {
    fetchCars(1);
  }, []);

  return {
    cars,
    loading,
    refreshing,
    error,
    hasMore,
    totalItems,
    page,
    loadMore,
    refresh,
    applyFilters,
    searchCars,
    clearFilters,
  };
};

export const useCarDetails = (carId: string) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const data = await buyUsedCarAPI.getCarById(carId);
        setCar(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch car details');
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  return { car, loading, error };
};

export const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const data = await buyUsedCarAPI.getFilterOptions();
        setFilterOptions(data);
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return { filterOptions, loading };
};

export const useSavedCars = (userId: string) => {
  const [savedCars, setSavedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSavedCars = useCallback(async () => {
    try {
      setLoading(true);
      const response = await buyUsedCarAPI.getSavedCars(userId);
      setSavedCars(response.cars);
    } catch (err) {
      console.error('Failed to fetch saved cars:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSavedCars();
    setRefreshing(false);
  }, [fetchSavedCars]);

  useEffect(() => {
    fetchSavedCars();
  }, [fetchSavedCars]);

  return { savedCars, loading, refreshing, refresh };
};