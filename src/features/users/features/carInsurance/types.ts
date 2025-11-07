// src/features/users/features/carInsurance/types.ts

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  provider: string;
  policyType: 'comprehensive' | 'third-party' | 'standalone-od';
  issueDate: string;
  expiryDate: string;
  premiumAmount: number;
  idv: number;
  coverageType: string;
  addOns: string[];
  status: 'active' | 'expired' | 'expiring-soon';
  claimsMade: number;
  ncbPercentage: number;
}

export interface VehicleInsuranceData {
  registrationNumber: string;
  ownerName: string;
  vehicleModel: string;
  vehicleClass: string;
  chassisNumber: string;
  engineNumber: string;
  currentPolicy: InsurancePolicy | null;
  policyHistory: InsurancePolicy[];
  totalPolicies: number;
  totalClaimsMade: number;
  lastCheckedAt: string;
}

export interface CarInsuranceState {
  currentInsuranceData: VehicleInsuranceData | null;
  recentSearches: string[];
  savedReports: VehicleInsuranceData[];
  isLoading: boolean;
  error: string | null;
  hasExpiredInsurance: boolean; // Flag to show notification badge on home screen
}

export interface InsuranceSearchRequest {
  registrationNumber: string;
  chassisNumber?: string;
}

export interface InsuranceQuoteRequest {
  registrationNumber: string;
  policyType: 'comprehensive' | 'third-party' | 'standalone-od';
  coverageAmount: number;
  addOns?: string[];
}

export interface InsuranceStats {
  totalPolicies: number;
  activePolicies: number;
  expiredPolicies: number;
  expiringSoonPolicies: number;
  totalPremiumPaid: number;
  totalClaimsMade: number;
  currentNCB: number;
}
