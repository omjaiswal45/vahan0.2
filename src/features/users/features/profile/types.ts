// src/features/users/features/profile/types.ts
export interface Userprofile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  avatarUrl?: string;
  membership?: 'basic' | 'verified' | 'premium' | string;
  joinedAt?: string;
}

export interface CarListing {
  id: string;
  title: string;
  price: number;
  image: string;
  mileage?: number;
  year?: number;
  city?: string;
  shortDescription?: string;
}

export type SavedCar = CarListing;
