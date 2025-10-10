// src/features/users/features/profile/types.ts

// ============ MAIN TYPES (synced with customerSlice) ============

export interface Userprofile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'dealer';
  location?: {
    city: string;
    state: string;
    pincode?: string;
  };
  dealerInfo?: DealerInfo;
  createdAt: string;
  updatedAt: string;
}

export interface DealerInfo {
  businessName: string;
  gstNumber?: string;
  businessAddress: string;
  yearEstablished?: number;
  specialization?: string[];
  verified: boolean;
  rating?: number;
  totalSales?: number;
}

export interface CarListing {
  id: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  kmDriven: number;
  fuelType: string;
  transmission: string;
  ownerNumber: number;
  registrationNumber: string;
  color: string;
  location: {
    city: string;
    state: string;
  };
  images: string[];
  status: 'active' | 'sold' | 'inactive' | 'pending';
  views: number;
  leads: number;
  createdAt: string;
  updatedAt: string;
}

// ============ ADDITIONAL TYPES ============

export interface ProfileStats {
  totalListings: number;
  activeListing: number;
  soldCars: number;
  savedCars: number;
  totalLeads?: number;
  activeLeads?: number;
}

export interface SavedCar {
  id: string;
  carId: string;
  userId: string;
  savedAt: string;
  car: CarListing;
}

export interface ProfileUpdatePayload {
  name?: string;
  email?: string;
  avatar?: string;
  location?: {
    city: string;
    state: string;
    pincode?: string;
  };
  dealerInfo?: Partial<DealerInfo>;
}

export interface SettingsConfig {
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    leadAlerts: boolean;
    priceDropAlerts: boolean;
    newListingAlerts: boolean;
  };
  privacy: {
    showPhone: boolean;
    showEmail: boolean;
    allowContact: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    distanceUnit: 'km' | 'miles';
  };
}

export interface ProfileOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  iconType?: 'ionicon' | 'material' | 'feather' | 'fontawesome';
  route?: string;
  action?: () => void;
  badge?: number;
  color?: string;
  showChevron?: boolean;
}

export interface AvatarUploadResult {
  uri: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// Type alias for backward compatibility
export type UserProfile = Userprofile;
export type UserListing = CarListing;