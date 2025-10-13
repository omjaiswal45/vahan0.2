// src/features/users/features/rcCheck/types.ts

export interface VehicleBasicInfo {
  registrationNumber: string;
  registrationDate: string;
  manufacturer: string;
  model: string;
  variant: string;
  fuelType: string;
  color: string;
  engineNumber: string;
  chassisNumber: string;
  vehicleClass: string;
  bodyType: string;
}

export interface VehicleOwnerInfo {
  ownerName: string;
  ownerCount: number;
  registeredAt: string;
  address: string;
  state: string;
  district: string;
}

export interface InsuranceInfo {
  policyNumber: string;
  insuranceCompany: string;
  insuranceType: string;
  validUpto: string;
  status: 'active' | 'expired' | 'expiring_soon';
}

export interface FinanceInfo {
  isFinanced: boolean;
  financierName?: string;
  hypothecationCity?: string;
  hypothecationStatus?: 'active' | 'closed';
  outstandingAmount?: number;
}

export interface FitnessInfo {
  fitnessUpto: string;
  pucValidUpto: string;
  roadTaxPaidUpto: string;
  permitValidUpto?: string;
  permitType?: string;
}

export interface ChallansInfo {
  totalChallans: number;
  totalFineAmount: number;
  challans: Challan[];
}

export interface Challan {
  id: string;
  challanNumber: string;
  challanDate: string;
  violation: string;
  fineAmount: number;
  location: string;
  status: 'pending' | 'paid';
}

export interface BlacklistInfo {
  isBlacklisted: boolean;
  reason?: string;
  blacklistedDate?: string;
  authority?: string;
}

export interface TheftInfo {
  isStolen: boolean;
  reportDate?: string;
  reportingAuthority?: string;
  fir?: string;
}

export interface PriceEstimation {
  estimatedPrice: number;
  marketValue: number;
  priceRange: {
    min: number;
    max: number;
  };
  depreciationPercentage: number;
  factors: PriceFactor[];
}

export interface PriceFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  value: string;
  priceImpact: number;
}

export interface InspectionReport {
  reportId: string;
  inspectionDate: string;
  overallScore: number;
  overallGrade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  categories: InspectionCategory[];
  recommendations: string[];
  estimatedRepairCost: number;
}

export interface InspectionCategory {
  name: string;
  score: number;
  grade: string;
  items: InspectionItem[];
}

export interface InspectionItem {
  name: string;
  status: 'good' | 'fair' | 'needs_attention' | 'critical';
  notes?: string;
  estimatedCost?: number;
}

export interface VehicleHistory {
  accidentHistory: AccidentRecord[];
  serviceHistory: ServiceRecord[];
  ownershipHistory: OwnershipRecord[];
}

export interface AccidentRecord {
  date: string;
  type: string;
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  repairCost?: number;
  claimAmount?: number;
}

export interface ServiceRecord {
  date: string;
  serviceType: string;
  mileage: number;
  serviceCenter: string;
  cost: number;
  description: string;
}

export interface OwnershipRecord {
  ownerNumber: number;
  from: string;
  to?: string;
  duration: string;
  transferDate: string;
}

export interface RCCheckReport {
  registrationNumber: string;
  checkDate: string;
  reportId: string;
  status: 'completed' | 'processing' | 'failed';
  
  basicInfo: VehicleBasicInfo;
  ownerInfo: VehicleOwnerInfo;
  insuranceInfo: InsuranceInfo;
  financeInfo: FinanceInfo;
  fitnessInfo: FitnessInfo;
  challansInfo: ChallansInfo;
  blacklistInfo: BlacklistInfo;
  theftInfo: TheftInfo;
  
  priceEstimation?: PriceEstimation;
  inspectionReport?: InspectionReport;
  vehicleHistory?: VehicleHistory;
  
  trustScore: number;
  trustGrade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  warnings: Warning[];
  recommendations: string[];
}

export interface Warning {
  severity: 'high' | 'medium' | 'low';
  message: string;
  category: string;
}

export interface RCCheckRequest {
  registrationNumber: string;
  includeHistory?: boolean;
  includeInspection?: boolean;
  includePriceEstimation?: boolean;
}

export interface SavedRCCheck {
  id: string;
  registrationNumber: string;
  vehicleName: string;
  checkDate: string;
  trustScore: number;
  estimatedPrice?: number;
  thumbnail?: string;
}

export interface RCCheckFilters {
  sortBy: 'recent' | 'trust_score' | 'price';
  filterByGrade?: string[];
  searchQuery?: string;
}

export interface RCCheckState {
  currentReport: RCCheckReport | null;
  savedReports: SavedRCCheck[];
  recentSearches: string[];
  loading: boolean;
  error: string | null;
  filters: RCCheckFilters;
}