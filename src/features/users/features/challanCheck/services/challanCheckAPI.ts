// src/features/users/features/challanCheck/services/challanCheckAPI.ts

import { VehicleChallanData, ChallanSearchRequest, ChallanPaymentRequest } from '../types';
import { generateMockChallanData } from './mockChallanData';

const API_BASE_URL = 'https://api.example.com/challan';
const USE_MOCK_DATA = true;

class ChallanCheckAPI {
  async searchChallan(request: ChallanSearchRequest): Promise<VehicleChallanData> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = generateMockChallanData(request.registrationNumber);
          resolve(data);
        }, 1500);
      });
    }

    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch challan data');
    }

    return response.json();
  }

  async payChallan(request: ChallanPaymentRequest): Promise<{ success: boolean; transactionId: string }> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            transactionId: `TXN${Date.now()}`,
          });
        }, 1000);
      });
    }

    const response = await fetch(`${API_BASE_URL}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Payment failed');
    }

    return response.json();
  }

  async getChallanDetails(challanId: string): Promise<any> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: challanId,
            details: 'Mock challan details',
          });
        }, 500);
      });
    }

    const response = await fetch(`${API_BASE_URL}/${challanId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch challan details');
    }

    return response.json();
  }
}

export default new ChallanCheckAPI();