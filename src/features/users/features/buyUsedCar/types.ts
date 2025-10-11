// src/features/users/features/buyUsedCar/types.ts

export interface Car {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerPhone?: string;
  dealerLocation?: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  km: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  ownerNumber: number;
  color: string;
  location: {
    city: string;
    state: string;
  };
  registrationNumber?: string;
  images: string[];
  thumbnail: string;
  description?: string;
  features?: string[];
  isSaved?: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarFilters {
  brands?: string[];
  models?: string[];
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  kmMax?: number;
  fuelTypes?: string[];
  transmissions?: string[];
  ownerNumbers?: number[];
  cities?: string[];
  colors?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'km_asc' | 'recent';
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CarsResponse {
  cars: Car[];
  meta: PaginationMeta;
}

export interface FilterOptions {
  brands: { label: string; value: string }[];
  models: { label: string; value: string; brand: string }[];
  cities: { label: string; value: string }[];
  fuelTypes: { label: string; value: string }[];
  transmissions: { label: string; value: string }[];
  ownerNumbers: { label: string; value: number }[];
  priceRange: { min: number; max: number };
  yearRange: { min: number; max: number };
  kmRange: { min: number; max: number };
}

export interface SavedCarPayload {
  carId: string;
  userId: string;
}

export interface SearchQuery {
  query: string;
  filters?: CarFilters;
  page?: number;
  limit?: number;
}

// Additional utility types
export type FuelType = Car['fuelType'];
export type TransmissionType = Car['transmission'];
export type SortByOption = NonNullable<CarFilters['sortBy']>;

// Component Props Types
export interface CarCardProps {
  car: Car;
  onPress: (car: Car) => void;
  onSave?: (carId: string) => void;
  showSaveButton?: boolean;
}

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: CarFilters) => void;
  filterOptions: FilterOptions | null;
  currentFilters?: CarFilters;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onFilterPress: () => void;
  activeFiltersCount?: number;
}

export interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (sortBy: SortByOption) => void;
  currentSort: SortByOption;
}

// Redux State
export interface BuyUsedCarState {
  cars: Car[];
  filters: CarFilters;
  filterOptions: FilterOptions | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  selectedCar: Car | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface CarDetailsResponse {
  car: Car;
  similarCars?: Car[];
  dealerOtherCars?: Car[];
}