export interface CarDetails {
  id?: string;
  registrationNumber: string;
  brand: string;
  model: string;
  makeYear: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  ownership: number;
  mileage: number;
  color: string;
  price: number;
  location: string;
  transmission?: 'Manual' | 'Automatic';
  variant?: string;
  additionalFuel?: string;
}

export interface ListingFormState {
  registrationNumber: string;
  autoFilledData: Partial<CarDetails>;
  manualEntries: Partial<CarDetails>;
  currentStep: number;
  completedSteps: Set<string>;
  draftData: Partial<CarDetails>;
  errors: Record<string, string>;
  isLoading: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  popular: boolean;
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
  popular: boolean;
}

export interface VehicleAPIResponse {
  success: boolean;
  data: Partial<CarDetails>;
  message?: string;
}