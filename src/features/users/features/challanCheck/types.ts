// src/features/users/features/challanCheck/types.ts

export interface ChallanRecord {
  id: string;
  challanNumber: string;
  issueDate: string;
  violationType: string;
  violationDescription: string;
  amount: number;
  penaltyAmount: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  location: string;
  officerName: string;
  courtName?: string;
  dueDate: string;
}

export interface VehicleChallanData {
  registrationNumber: string;
  ownerName: string;
  vehicleModel: string;
  vehicleClass: string;
  chassisNumber: string;
  engineNumber: string;
  totalChallans: number;
  totalPendingAmount: number;
  totalPaidAmount: number;
  challans: ChallanRecord[];
  lastCheckedAt: string;
}

export interface ChallanCheckState {
  currentChallanData: VehicleChallanData | null;
  recentSearches: string[];
  savedReports: VehicleChallanData[];
  isLoading: boolean;
  error: string | null;
  pendingChallanCount: number; // Count of pending challans to show on home screen badge
}

export interface ChallanSearchRequest {
  registrationNumber: string;
  chassisNumber?: string;
}

export interface ChallanPaymentRequest {
  challanId: string;
  amount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking';
}

export interface ChallanStats {
  totalChallans: number;
  pendingChallans: number;
  paidChallans: number;
  overdueChallans: number;
  totalPendingAmount: number;
}