// src/features/users/features/rcCheck/services/rcCheckAPI.ts

import { RCCheckReport, RCCheckRequest, SavedRCCheck } from '../types';
import { mockRCReports, mockSavedReports, generateMockRCReport } from './mockRCData';

// Toggle between mock and real API
const USE_MOCK_API = true;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class RCCheckAPI {
  private baseURL = 'https://api.yourapp.com/rc-check';
  
  // Get RC Check Report
  async getRCReport(request: RCCheckRequest): Promise<RCCheckReport> {
    if (USE_MOCK_API) {
      await delay(2000); // Simulate API call
      return generateMockRCReport(request.registrationNumber);
    }
    
    const response = await fetch(`${this.baseURL}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch RC report');
    }
    
    return response.json();
  }
  
  // Get Report by ID
  async getReportById(reportId: string): Promise<RCCheckReport> {
    if (USE_MOCK_API) {
      await delay(1000);
      const report = mockRCReports.find(r => r.reportId === reportId);
      if (!report) {
        throw new Error('Report not found');
      }
      return report;
    }
    
    const response = await fetch(`${this.baseURL}/reports/${reportId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }
    
    return response.json();
  }
  
  // Save Report
  async saveReport(reportId: string): Promise<SavedRCCheck> {
    if (USE_MOCK_API) {
      await delay(500);
      const report = mockRCReports.find(r => r.reportId === reportId);
      if (!report) {
        throw new Error('Report not found');
      }
      
      return {
        id: `SR${Date.now()}`,
        registrationNumber: report.registrationNumber,
        vehicleName: `${report.basicInfo.manufacturer} ${report.basicInfo.model}`,
        checkDate: report.checkDate,
        trustScore: report.trustScore,
        estimatedPrice: report.priceEstimation?.estimatedPrice,
      };
    }
    
    const response = await fetch(`${this.baseURL}/reports/${reportId}/save`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to save report');
    }
    
    return response.json();
  }
  
  // Get Saved Reports
  async getSavedReports(): Promise<SavedRCCheck[]> {
    if (USE_MOCK_API) {
      await delay(800);
      return mockSavedReports;
    }
    
    const response = await fetch(`${this.baseURL}/saved-reports`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch saved reports');
    }
    
    return response.json();
  }
  
  // Delete Saved Report
  async deleteSavedReport(reportId: string): Promise<void> {
    if (USE_MOCK_API) {
      await delay(500);
      return;
    }
    
    const response = await fetch(`${this.baseURL}/saved-reports/${reportId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete report');
    }
  }
  
  // Get Price Estimation
  async getPriceEstimation(registrationNumber: string): Promise<any> {
    if (USE_MOCK_API) {
      await delay(1500);
      const report = generateMockRCReport(registrationNumber);
      return report.priceEstimation;
    }
    
    const response = await fetch(`${this.baseURL}/price-estimation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registrationNumber }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get price estimation');
    }
    
    return response.json();
  }
  
  // Verify Registration Number Format
  verifyRegNumberFormat(regNumber: string): boolean {
    // Indian registration number format: XX00XX0000
    const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;
    return regex.test(regNumber.toUpperCase().replace(/\s/g, ''));
  }
}

export default new RCCheckAPI();