// src/features/users/features/carInsuranceAPI.ts

import { VehicleInsuranceData, InsuranceSearchRequest, InsuranceQuoteRequest } from '../types';
import { generateMockInsuranceData } from './mockInsuranceData';

const API_BASE_URL = 'https://api.example.com/insurance';
const USE_MOCK_DATA = true;

class CarInsuranceAPI {
  async searchInsurance(request: InsuranceSearchRequest): Promise<VehicleInsuranceData> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = generateMockInsuranceData(request.registrationNumber);
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
      throw new Error('Failed to fetch insurance data');
    }

    return response.json();
  }

  async getQuote(request: InsuranceQuoteRequest): Promise<{ premium: number; quote: any }> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const basePremium = request.coverageAmount * 0.03;
          const addOnCost = (request.addOns?.length || 0) * 500;
          resolve({
            premium: Math.floor(basePremium + addOnCost),
            quote: {
              id: `QUOTE${Date.now()}`,
              validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          });
        }, 1000);
      });
    }

    const response = await fetch(`${API_BASE_URL}/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to get insurance quote');
    }

    return response.json();
  }

  async renewPolicy(policyNumber: string): Promise<{ success: boolean; newPolicyNumber: string }> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            newPolicyNumber: `POL/${new Date().getFullYear()}/${Date.now()}`,
          });
        }, 1000);
      });
    }

    const response = await fetch(`${API_BASE_URL}/renew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ policyNumber }),
    });

    if (!response.ok) {
      throw new Error('Policy renewal failed');
    }

    return response.json();
  }

  async getInsuranceDetails(policyId: string): Promise<any> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: policyId,
            details: 'Mock insurance policy details',
          });
        }, 500);
      });
    }

    const response = await fetch(`${API_BASE_URL}/${policyId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch insurance details');
    }

    return response.json();
  }
}

export default new CarInsuranceAPI();
