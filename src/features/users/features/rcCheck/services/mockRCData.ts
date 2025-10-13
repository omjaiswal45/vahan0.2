// src/features/users/features/rcCheck/services/mockRCData.ts

import { RCCheckReport, SavedRCCheck } from '../types';

export const mockRCReports: RCCheckReport[] = [
  {
    registrationNumber: 'DL3CAF4097',
    checkDate: '2025-10-13T10:30:00Z',
    reportId: 'RC_001',
    status: 'completed',
    
    basicInfo: {
      registrationNumber: 'DL3CAF4097',
      registrationDate: '2018-03-15',
      manufacturer: 'MARUTI SUZUKI',
      model: 'SWIFT DZIRE',
      variant: 'VDI',
      fuelType: 'Diesel',
      color: 'White',
      engineNumber: 'K14BF2154789',
      chassisNumber: 'MA3EUA81S00432156',
      vehicleClass: 'Motor Car(LMV)',
      bodyType: 'Sedan',
    },
    
    ownerInfo: {
      ownerName: 'RAJESH KUMAR',
      ownerCount: 2,
      registeredAt: 'New Delhi',
      address: 'H.NO-123, Sector 15, Rohini',
      state: 'Delhi',
      district: 'North West Delhi',
    },
    
    insuranceInfo: {
      policyNumber: 'POL123456789',
      insuranceCompany: 'ICICI Lombard',
      insuranceType: 'Comprehensive',
      validUpto: '2025-03-14',
      status: 'expiring_soon',
    },
    
    financeInfo: {
      isFinanced: false,
    },
    
    fitnessInfo: {
      fitnessUpto: '2033-03-14',
      pucValidUpto: '2025-12-10',
      roadTaxPaidUpto: '2026-03-14',
    },
    
    challansInfo: {
      totalChallans: 1,
      totalFineAmount: 500,
      challans: [
        {
          id: 'CH001',
          challanNumber: 'DEL2024CH123456',
          challanDate: '2024-08-15',
          violation: 'Over Speeding',
          fineAmount: 500,
          location: 'NH-44, Delhi',
          status: 'pending',
        },
      ],
    },
    
    blacklistInfo: {
      isBlacklisted: false,
    },
    
    theftInfo: {
      isStolen: false,
    },
    
    priceEstimation: {
      estimatedPrice: 485000,
      marketValue: 495000,
      priceRange: {
        min: 465000,
        max: 505000,
      },
      depreciationPercentage: 42,
      factors: [
        {
          factor: 'Good Condition',
          impact: 'positive',
          value: 'Well maintained',
          priceImpact: 15000,
        },
        {
          factor: 'Mileage',
          impact: 'neutral',
          value: '62,000 km',
          priceImpact: 0,
        },
        {
          factor: 'Single Owner',
          impact: 'positive',
          value: 'First hand',
          priceImpact: 20000,
        },
        {
          factor: 'Pending Challan',
          impact: 'negative',
          value: '₹500',
          priceImpact: -500,
        },
      ],
    },
    
    inspectionReport: {
      reportId: 'INS_001',
      inspectionDate: '2025-10-13',
      overallScore: 82,
      overallGrade: 'Good',
      categories: [
        {
          name: 'Engine & Transmission',
          score: 85,
          grade: 'Good',
          items: [
            { name: 'Engine Performance', status: 'good' },
            { name: 'Transmission', status: 'good' },
            { name: 'Oil Leakage', status: 'good' },
            { name: 'Cooling System', status: 'fair', notes: 'Minor coolant level low' },
          ],
        },
        {
          name: 'Exterior',
          score: 78,
          grade: 'Good',
          items: [
            { name: 'Paint Condition', status: 'good' },
            { name: 'Body Dents', status: 'fair', notes: 'Minor dent on rear bumper', estimatedCost: 3000 },
            { name: 'Windshield', status: 'good' },
            { name: 'Lights', status: 'good' },
          ],
        },
        {
          name: 'Interior',
          score: 88,
          grade: 'Excellent',
          items: [
            { name: 'Seats Condition', status: 'good' },
            { name: 'Dashboard', status: 'good' },
            { name: 'AC System', status: 'good' },
            { name: 'Infotainment', status: 'good' },
          ],
        },
        {
          name: 'Tyres & Brakes',
          score: 75,
          grade: 'Good',
          items: [
            { name: 'Front Tyres', status: 'fair', notes: '40% tread life remaining' },
            { name: 'Rear Tyres', status: 'good' },
            { name: 'Brake Pads', status: 'good' },
            { name: 'Brake Discs', status: 'good' },
          ],
        },
      ],
      recommendations: [
        'Replace front tyres within 6 months',
        'Fix minor dent on rear bumper',
        'Top up coolant level',
        'Clear pending challan before sale',
      ],
      estimatedRepairCost: 5000,
    },
    
    vehicleHistory: {
      accidentHistory: [],
      serviceHistory: [
        {
          date: '2024-09-10',
          serviceType: 'Regular Service',
          mileage: 60000,
          serviceCenter: 'Maruti Authorized Service Center',
          cost: 4500,
          description: 'Engine oil change, air filter replacement',
        },
        {
          date: '2024-03-05',
          serviceType: 'Major Service',
          mileage: 55000,
          serviceCenter: 'Maruti Authorized Service Center',
          cost: 8900,
          description: 'Complete service with brake pad replacement',
        },
      ],
      ownershipHistory: [
        {
          ownerNumber: 1,
          from: '2018-03-15',
          to: '2022-07-20',
          duration: '4 years 4 months',
          transferDate: '2022-07-20',
        },
        {
          ownerNumber: 2,
          from: '2022-07-20',
          to: undefined,
          duration: '3 years 3 months',
          transferDate: '2022-07-20',
        },
      ],
    },
    
    trustScore: 82,
    trustGrade: 'Good',
    warnings: [
      {
        severity: 'medium',
        message: 'Insurance expiring in 5 months',
        category: 'Insurance',
      },
      {
        severity: 'low',
        message: '1 pending traffic challan',
        category: 'Legal',
      },
    ],
    recommendations: [
      'Renew insurance before expiry',
      'Clear pending challan',
      'Consider replacing front tyres soon',
    ],
  },
  
  // Second Mock Report
  {
    registrationNumber: 'MH02DE1234',
    checkDate: '2025-10-12T15:20:00Z',
    reportId: 'RC_002',
    status: 'completed',
    
    basicInfo: {
      registrationNumber: 'MH02DE1234',
      registrationDate: '2016-05-20',
      manufacturer: 'HYUNDAI',
      model: 'CRETA',
      variant: '1.6 SX',
      fuelType: 'Petrol',
      color: 'Red',
      engineNumber: 'G4FC856321',
      chassisNumber: 'MALHE851DDL004589',
      vehicleClass: 'Motor Car(LMV)',
      bodyType: 'SUV',
    },
    
    ownerInfo: {
      ownerName: 'PRIYA SHARMA',
      ownerCount: 3,
      registeredAt: 'Mumbai',
      address: 'Flat 401, Sai Heights, Andheri West',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
    },
    
    insuranceInfo: {
      policyNumber: 'POL987654321',
      insuranceCompany: 'HDFC ERGO',
      insuranceType: 'Comprehensive',
      validUpto: '2026-05-19',
      status: 'active',
    },
    
    financeInfo: {
      isFinanced: true,
      financierName: 'HDFC Bank Ltd',
      hypothecationCity: 'Mumbai',
      hypothecationStatus: 'active',
      outstandingAmount: 125000,
    },
    
    fitnessInfo: {
      fitnessUpto: '2031-05-19',
      pucValidUpto: '2025-11-15',
      roadTaxPaidUpto: '2026-05-19',
    },
    
    challansInfo: {
      totalChallans: 3,
      totalFineAmount: 3500,
      challans: [
        {
          id: 'CH002',
          challanNumber: 'MH2024CH789456',
          challanDate: '2024-09-05',
          violation: 'Wrong Parking',
          fineAmount: 500,
          location: 'Andheri West, Mumbai',
          status: 'pending',
        },
        {
          id: 'CH003',
          challanNumber: 'MH2024CH654321',
          challanDate: '2024-06-12',
          violation: 'Signal Jump',
          fineAmount: 1000,
          location: 'Bandra, Mumbai',
          status: 'pending',
        },
        {
          id: 'CH004',
          challanNumber: 'MH2024CH456789',
          challanDate: '2024-03-18',
          violation: 'Over Speeding',
          fineAmount: 2000,
          location: 'Western Express Highway',
          status: 'pending',
        },
      ],
    },
    
    blacklistInfo: {
      isBlacklisted: false,
    },
    
    theftInfo: {
      isStolen: false,
    },
    
    priceEstimation: {
      estimatedPrice: 675000,
      marketValue: 720000,
      priceRange: {
        min: 650000,
        max: 700000,
      },
      depreciationPercentage: 55,
      factors: [
        {
          factor: 'Multiple Owners',
          impact: 'negative',
          value: '3 owners',
          priceImpact: -30000,
        },
        {
          factor: 'High Mileage',
          impact: 'negative',
          value: '98,000 km',
          priceImpact: -15000,
        },
        {
          factor: 'Active Loan',
          impact: 'negative',
          value: '₹1.25L outstanding',
          priceImpact: 0,
        },
        {
          factor: 'Multiple Challans',
          impact: 'negative',
          value: '₹3,500 pending',
          priceImpact: -3500,
        },
      ],
    },
    
    inspectionReport: {
      reportId: 'INS_002',
      inspectionDate: '2025-10-12',
      overallScore: 68,
      overallGrade: 'Fair',
      categories: [
        {
          name: 'Engine & Transmission',
          score: 72,
          grade: 'Good',
          items: [
            { name: 'Engine Performance', status: 'fair', notes: 'Minor engine noise detected' },
            { name: 'Transmission', status: 'good' },
            { name: 'Oil Leakage', status: 'needs_attention', notes: 'Minor oil seepage', estimatedCost: 8000 },
            { name: 'Cooling System', status: 'good' },
          ],
        },
        {
          name: 'Exterior',
          score: 65,
          grade: 'Fair',
          items: [
            { name: 'Paint Condition', status: 'fair', notes: 'Paint fading on bonnet' },
            { name: 'Body Dents', status: 'needs_attention', notes: 'Multiple scratches', estimatedCost: 12000 },
            { name: 'Windshield', status: 'good' },
            { name: 'Lights', status: 'fair', notes: 'Right headlight dim' },
          ],
        },
        {
          name: 'Interior',
          score: 70,
          grade: 'Good',
          items: [
            { name: 'Seats Condition', status: 'fair', notes: 'Seat covers worn out' },
            { name: 'Dashboard', status: 'good' },
            { name: 'AC System', status: 'good' },
            { name: 'Infotainment', status: 'needs_attention', notes: 'Touchscreen unresponsive' },
          ],
        },
        {
          name: 'Tyres & Brakes',
          score: 62,
          grade: 'Fair',
          items: [
            { name: 'Front Tyres', status: 'needs_attention', notes: 'Need replacement', estimatedCost: 15000 },
            { name: 'Rear Tyres', status: 'fair', notes: '30% tread life' },
            { name: 'Brake Pads', status: 'needs_attention', notes: 'Worn out', estimatedCost: 6000 },
            { name: 'Brake Discs', status: 'fair' },
          ],
        },
      ],
      recommendations: [
        'Replace all four tyres urgently',
        'Fix oil seepage issue',
        'Replace brake pads',
        'Repair exterior scratches and dents',
        'Fix infotainment system',
        'Clear all pending challans',
        'Complete loan clearance before purchase',
      ],
      estimatedRepairCost: 41000,
    },
    
    vehicleHistory: {
      accidentHistory: [
        {
          date: '2023-11-20',
          type: 'Rear End Collision',
          severity: 'minor',
          description: 'Minor damage to rear bumper',
          repairCost: 18000,
          claimAmount: 15000,
        },
      ],
      serviceHistory: [
        {
          date: '2024-08-15',
          serviceType: 'Regular Service',
          mileage: 95000,
          serviceCenter: 'Local Workshop',
          cost: 3500,
          description: 'Oil change and basic checkup',
        },
      ],
      ownershipHistory: [
        {
          ownerNumber: 1,
          from: '2016-05-20',
          to: '2019-02-10',
          duration: '2 years 8 months',
          transferDate: '2019-02-10',
        },
        {
          ownerNumber: 2,
          from: '2019-02-10',
          to: '2022-08-15',
          duration: '3 years 6 months',
          transferDate: '2022-08-15',
        },
        {
          ownerNumber: 3,
          from: '2022-08-15',
          to: undefined,
          duration: '3 years 2 months',
          transferDate: '2022-08-15',
        },
      ],
    },
    
    trustScore: 58,
    trustGrade: 'Fair',
    warnings: [
      {
        severity: 'high',
        message: 'Vehicle has active loan - ₹1.25L outstanding',
        category: 'Finance',
      },
      {
        severity: 'high',
        message: '3 pending challans worth ₹3,500',
        category: 'Legal',
      },
      {
        severity: 'medium',
        message: 'High repair cost estimated - ₹41,000',
        category: 'Maintenance',
      },
      {
        severity: 'medium',
        message: 'Accident history detected',
        category: 'History',
      },
    ],
    recommendations: [
      'Ensure loan clearance certificate before purchase',
      'Clear all pending challans',
      'Negotiate price considering high repair costs',
      'Get detailed mechanical inspection',
    ],
  },
];

export const mockSavedReports: SavedRCCheck[] = [
  {
    id: 'SR001',
    registrationNumber: 'DL3CAF4097',
    vehicleName: 'Maruti Swift Dzire VDI',
    checkDate: '2025-10-13T10:30:00Z',
    trustScore: 82,
    estimatedPrice: 485000,
  },
  {
    id: 'SR002',
    registrationNumber: 'MH02DE1234',
    vehicleName: 'Hyundai Creta 1.6 SX',
    checkDate: '2025-10-12T15:20:00Z',
    trustScore: 58,
    estimatedPrice: 675000,
  },
];

export const generateMockRCReport = (regNumber: string): RCCheckReport => {
  const existingReport = mockRCReports.find(
    (r) => r.registrationNumber.toLowerCase() === regNumber.toLowerCase()
  );
  
  if (existingReport) {
    return existingReport;
  }
  
  // Generate random report for unknown registration numbers
  const manufacturers = ['MARUTI SUZUKI', 'HYUNDAI', 'HONDA', 'TATA', 'MAHINDRA'];
  const models = ['SWIFT', 'I20', 'CITY', 'NEXON', 'XUV500'];
  const randomManufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
  const randomModel = models[Math.floor(Math.random() * models.length)];
  
  return {
    registrationNumber: regNumber,
    checkDate: new Date().toISOString(),
    reportId: `RC_${Date.now()}`,
    status: 'completed',
    
    basicInfo: {
      registrationNumber: regNumber,
      registrationDate: '2019-06-10',
      manufacturer: randomManufacturer,
      model: randomModel,
      variant: 'VXI',
      fuelType: 'Petrol',
      color: 'Silver',
      engineNumber: `ENG${Math.floor(Math.random() * 1000000)}`,
      chassisNumber: `CHS${Math.floor(Math.random() * 1000000)}`,
      vehicleClass: 'Motor Car(LMV)',
      bodyType: 'Hatchback',
    },
    
    ownerInfo: {
      ownerName: 'VEHICLE OWNER',
      ownerCount: 1,
      registeredAt: 'Delhi',
      address: 'Address Details',
      state: 'Delhi',
      district: 'Central Delhi',
    },
    
    insuranceInfo: {
      policyNumber: `POL${Math.floor(Math.random() * 1000000)}`,
      insuranceCompany: 'National Insurance',
      insuranceType: 'Comprehensive',
      validUpto: '2026-06-10',
      status: 'active',
    },
    
    financeInfo: {
      isFinanced: false,
    },
    
    fitnessInfo: {
      fitnessUpto: '2034-06-10',
      pucValidUpto: '2026-01-15',
      roadTaxPaidUpto: '2026-06-10',
    },
    
    challansInfo: {
      totalChallans: 0,
      totalFineAmount: 0,
      challans: [],
    },
    
    blacklistInfo: {
      isBlacklisted: false,
    },
    
    theftInfo: {
      isStolen: false,
    },
    
    trustScore: 85,
    trustGrade: 'Good',
    warnings: [],
    recommendations: ['Vehicle appears to be in good condition'],
  };
};