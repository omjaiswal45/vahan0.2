// src/features/users/features/buyUsedCar/services/mockCarData.ts

import { Car, CarsResponse, FilterOptions } from '../types';

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    dealerId: 'd1',
    dealerName: 'Premium Auto Dealers',
    dealerPhone: '+917571074720',
    dealerLocation: 'Connaught Place, Delhi',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'VXI AMT',
    year: 2021,
    price: 650000,
    km: 25000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownerNumber: 1,
    color: 'Pearl White',
    location: {
      city: 'Delhi',
      state: 'Delhi',
    },
    registrationNumber: 'DL 3C AB 1234',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
    description: 'Well maintained Swift with complete service history. Single owner, accident-free car.',
    features: ['ABS', 'Airbags', 'Power Steering', 'AC', 'Music System', 'Alloy Wheels'],
    isSaved: false,
    isVerified: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    dealerId: 'd2',
    dealerName: 'Elite Cars',
    dealerPhone: '+919876543211',
    dealerLocation: 'Saket, Delhi',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX Diesel',
    year: 2020,
    price: 1450000,
    km: 42000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    ownerNumber: 1,
    color: 'Phantom Black',
    location: {
      city: 'Delhi',
      state: 'Delhi',
    },
    registrationNumber: 'DL 8S CD 5678',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    description: 'Premium SUV in excellent condition. Well maintained with all service records.',
    features: ['Sunroof', 'Leather Seats', 'Cruise Control', 'Parking Sensors', 'Touchscreen'],
    isSaved: false,
    isVerified: true,
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z',
  },
  {
    id: '3',
    dealerId: 'd3',
    dealerName: 'City Motors',
    dealerPhone: '+919876543212',
    dealerLocation: 'Dwarka, Delhi',
    brand: 'Honda',
    model: 'City',
    variant: 'VX CVT',
    year: 2022,
    price: 1250000,
    km: 15000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownerNumber: 1,
    color: 'Radiant Red',
    location: {
      city: 'Delhi',
      state: 'Delhi',
    },
    registrationNumber: 'DL 1C EF 9012',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    description: 'Like new Honda City with minimal usage. Perfect for city driving.',
    features: ['Automatic Climate Control', 'Rear AC Vents', 'Push Button Start', '7" Touchscreen'],
    isSaved: true,
    isVerified: true,
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
  },
  {
    id: '4',
    dealerId: 'd4',
    dealerName: 'Royal Autos',
    dealerPhone: '+919876543213',
    dealerLocation: 'Rohini, Delhi',
    brand: 'Tata',
    model: 'Nexon',
    variant: 'XZ Plus',
    year: 2021,
    price: 950000,
    km: 32000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    ownerNumber: 1,
    color: 'Flame Red',
    location: {
      city: 'Delhi',
      state: 'Delhi',
    },
    registrationNumber: 'DL 7C GH 3456',
    images: [
      'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=400',
    description: 'Powerful and spacious SUV. Great for family trips.',
    features: ['Panoramic Sunroof', 'Connected Car Tech', 'Projector Headlamps', 'ESP'],
    isSaved: false,
    isVerified: true,
    createdAt: '2024-01-12T11:45:00Z',
    updatedAt: '2024-01-12T11:45:00Z',
  },
  {
    id: '5',
    dealerId: 'd5',
    dealerName: 'Metro Cars',
    dealerPhone: '+919876543214',
    dealerLocation: 'Lajpat Nagar, Delhi',
    brand: 'Volkswagen',
    model: 'Polo',
    variant: 'Highline Plus',
    year: 2019,
    price: 750000,
    km: 55000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    ownerNumber: 2,
    color: 'Candy White',
    location: {
      city: 'Delhi',
      state: 'Delhi',
    },
    registrationNumber: 'DL 9C IJ 7890',
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
    description: 'German engineering at affordable price. Well maintained.',
    features: ['Touchscreen', 'Rear Parking Sensors', 'Dual Airbags', 'ABS with EBD'],
    isSaved: false,
    isVerified: false,
    createdAt: '2024-01-11T16:00:00Z',
    updatedAt: '2024-01-11T16:00:00Z',
  },
  {
    id: '6',
    dealerId: 'd1',
    dealerName: 'Premium Auto Dealers',
    dealerPhone: '+919876543210',
    dealerLocation: 'Connaught Place, Delhi',
    brand: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7 Luxury',
    year: 2023,
    price: 2350000,
    km: 8000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    ownerNumber: 1,
    color: 'Midnight Black',
    location: {
      city: 'Gurgaon',
      state: 'Haryana',
    },
    registrationNumber: 'HR 26 DL 1234',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1611651149521-c15a4b29aaa7?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    description: 'Latest XUV700 with advanced features. Almost brand new condition.',
    features: ['ADAS', 'Sony Sound System', 'Panoramic Sunroof', 'Wireless Charging', '360 Camera'],
    isSaved: true,
    isVerified: true,
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-10T08:30:00Z',
  },
  {
    id: '7',
    dealerId: 'd2',
    dealerName: 'Elite Cars',
    dealerPhone: '+919876543211',
    dealerLocation: 'Saket, Delhi',
    brand: 'Kia',
    model: 'Seltos',
    variant: 'HTX Plus',
    year: 2021,
    price: 1550000,
    km: 28000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownerNumber: 1,
    color: 'Intelligent Manual Blue',
    location: {
      city: 'Noida',
      state: 'Uttar Pradesh',
    },
    registrationNumber: 'UP 16 BC 5678',
    images: [
      'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=400',
    description: 'Feature-packed Seltos with excellent build quality.',
    features: ['10.25" Touchscreen', 'Ventilated Seats', 'Bose Sound System', 'Air Purifier'],
    isSaved: false,
    isVerified: true,
    createdAt: '2024-01-09T12:15:00Z',
    updatedAt: '2024-01-09T12:15:00Z',
  },
  {
    id: '8',
    dealerId: 'd3',
    dealerName: 'City Motors',
    dealerPhone: '+919876543212',
    dealerLocation: 'Dwarka, Delhi',
    brand: 'Toyota',
    model: 'Fortuner',
    variant: 'Legender 4x2',
    year: 2022,
    price: 3850000,
    km: 12000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    ownerNumber: 1,
    color: 'White Pearl',
    location: {
      city: 'Delhi',
      state: 'Delhi',
    },
    registrationNumber: 'DL 3C MN 2345',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
      'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400',
    description: 'Premium SUV with incredible presence. Perfect condition.',
    features: ['Sequential LED DRLs', 'Wireless Charger', '9" Touchscreen', '7 Airbags'],
    isSaved: false,
    isVerified: true,
    createdAt: '2024-01-08T15:45:00Z',
    updatedAt: '2024-01-08T15:45:00Z',
  },
];

export const MOCK_FILTER_OPTIONS: FilterOptions = {
  brands: [
    { label: 'Maruti Suzuki', value: 'maruti' },
    { label: 'Hyundai', value: 'hyundai' },
    { label: 'Honda', value: 'honda' },
    { label: 'Tata', value: 'tata' },
    { label: 'Mahindra', value: 'mahindra' },
    { label: 'Toyota', value: 'toyota' },
    { label: 'Kia', value: 'kia' },
    { label: 'Volkswagen', value: 'volkswagen' },
  ],
  models: [
    { label: 'Swift', value: 'swift', brand: 'maruti' },
    { label: 'Creta', value: 'creta', brand: 'hyundai' },
    { label: 'City', value: 'city', brand: 'honda' },
    { label: 'Nexon', value: 'nexon', brand: 'tata' },
    { label: 'XUV700', value: 'xuv700', brand: 'mahindra' },
    { label: 'Fortuner', value: 'fortuner', brand: 'toyota' },
    { label: 'Seltos', value: 'seltos', brand: 'kia' },
    { label: 'Polo', value: 'polo', brand: 'volkswagen' },
  ],
  cities: [
    { label: 'Delhi', value: 'delhi' },
    { label: 'Gurgaon', value: 'gurgaon' },
    { label: 'Noida', value: 'noida' },
    { label: 'Mumbai', value: 'mumbai' },
    { label: 'Bangalore', value: 'bangalore' },
  ],
  fuelTypes: [
    { label: 'Petrol', value: 'Petrol' },
    { label: 'Diesel', value: 'Diesel' },
    { label: 'CNG', value: 'CNG' },
    { label: 'Electric', value: 'Electric' },
    { label: 'Hybrid', value: 'Hybrid' },
  ],
  transmissions: [
    { label: 'Manual', value: 'Manual' },
    { label: 'Automatic', value: 'Automatic' },
  ],
  ownerNumbers: [
    { label: '1st Owner', value: 1 },
    { label: '2nd Owner', value: 2 },
    { label: '3rd Owner', value: 3 },
    { label: '4+ Owners', value: 4 },
  ],
  priceRange: {
    min: 100000,
    max: 5000000,
  },
  yearRange: {
    min: 2015,
    max: 2024,
  },
  kmRange: {
    min: 0,
    max: 200000,
  },
};

// Mock API response generator
export const generateMockCarsResponse = (
  page: number = 1,
  limit: number = 10,
  filters?: any
): CarsResponse => {
  let filteredCars = [...MOCK_CARS];

  // Apply filters
  if (filters) {
    if (filters.brands?.length) {
      filteredCars = filteredCars.filter(car => 
        filters.brands.includes(car.brand.toLowerCase().replace(' ', ''))
      );
    }
    if (filters.fuelTypes?.length) {
      filteredCars = filteredCars.filter(car => filters.fuelTypes.includes(car.fuelType));
    }
    if (filters.transmissions?.length) {
      filteredCars = filteredCars.filter(car => filters.transmissions.includes(car.transmission));
    }
    if (filters.priceMin) {
      filteredCars = filteredCars.filter(car => car.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filteredCars = filteredCars.filter(car => car.price <= filters.priceMax);
    }
    if (filters.yearMin) {
      filteredCars = filteredCars.filter(car => car.year >= filters.yearMin);
    }
    if (filters.yearMax) {
      filteredCars = filteredCars.filter(car => car.year <= filters.yearMax);
    }
    if (filters.kmMax) {
      filteredCars = filteredCars.filter(car => car.km <= filters.kmMax);
    }
    if (filters.ownerNumbers?.length) {
      filteredCars = filteredCars.filter(car => filters.ownerNumbers.includes(car.ownerNumber));
    }
  }

  // Apply sorting
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':
        filteredCars.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredCars.sort((a, b) => b.price - a.price);
        break;
      case 'year_desc':
        filteredCars.sort((a, b) => b.year - a.year);
        break;
      case 'km_asc':
        filteredCars.sort((a, b) => a.km - b.km);
        break;
      case 'recent':
      default:
        filteredCars.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  return {
    cars: paginatedCars,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(filteredCars.length / limit),
      totalItems: filteredCars.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < filteredCars.length,
      hasPreviousPage: page > 1,
    },
  };
};