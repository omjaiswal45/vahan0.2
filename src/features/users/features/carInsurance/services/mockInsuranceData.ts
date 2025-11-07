// src/features/users/features/carInsurance/services/mockInsuranceData.ts

import { VehicleInsuranceData, InsurancePolicy } from '../types';

const insuranceProviders = [
  'HDFC ERGO',
  'ICICI Lombard',
  'Bajaj Allianz',
  'Tata AIG',
  'SBI General Insurance',
  'Reliance General',
  'New India Assurance',
  'Oriental Insurance',
];

const vehicleModels = [
  'Maruti Suzuki Swift VXI',
  'Hyundai Creta SX',
  'Honda City VX',
  'Tata Nexon XZ+',
  'Mahindra XUV700 AX7',
  'Toyota Innova Crysta',
  'Kia Seltos HTX',
  'MG Hector Smart',
];

const addOnOptions = [
  'Zero Depreciation',
  'Engine Protection',
  'Road Side Assistance',
  'Return to Invoice',
  'Key Replacement',
  'Tyre Protection',
  'Consumables Cover',
  'NCB Protection',
];

function generateInsurancePolicy(index: number, status: 'active' | 'expired' | 'expiring-soon'): InsurancePolicy {
  const provider = insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)];
  const issueDate = new Date();

  if (status === 'expired') {
    issueDate.setFullYear(issueDate.getFullYear() - 2);
  } else if (status === 'expiring-soon') {
    issueDate.setFullYear(issueDate.getFullYear() - 1);
    issueDate.setMonth(issueDate.getMonth() + 11);
  } else {
    issueDate.setMonth(issueDate.getMonth() - Math.floor(Math.random() * 6));
  }

  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const ncbValues = [0, 20, 25, 35, 45, 50];
  const ncb = ncbValues[Math.floor(Math.random() * ncbValues.length)];

  const idv = Math.floor(Math.random() * 500000) + 500000;
  const premiumAmount = Math.floor((idv * 0.03) * (1 - ncb / 100)) + Math.floor(Math.random() * 3000);

  const numberOfAddOns = Math.floor(Math.random() * 4) + 1;
  const selectedAddOns = [];
  const availableAddOns = [...addOnOptions];

  for (let i = 0; i < numberOfAddOns && availableAddOns.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableAddOns.length);
    selectedAddOns.push(availableAddOns[randomIndex]);
    availableAddOns.splice(randomIndex, 1);
  }

  return {
    id: `POL${Date.now()}${index}`,
    policyNumber: `POL/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 999999999)).padStart(9, '0')}`,
    provider,
    policyType: Math.random() > 0.8 ? 'third-party' : 'comprehensive',
    issueDate: issueDate.toISOString().split('T')[0],
    expiryDate: expiryDate.toISOString().split('T')[0],
    premiumAmount,
    idv,
    coverageType: 'Own Damage + Third Party',
    addOns: selectedAddOns,
    status,
    claimsMade: Math.floor(Math.random() * 3),
    ncbPercentage: ncb,
  };
}

export function generateMockInsuranceData(registrationNumber: string): VehicleInsuranceData {
  // 80% chance of having insurance
  const hasInsurance = Math.random() > 0.2;

  let status: 'active' | 'expired' | 'expiring-soon' = 'active';
  if (hasInsurance) {
    const rand = Math.random();
    if (rand < 0.15) {
      status = 'expired';
    } else if (rand < 0.35) {
      status = 'expiring-soon';
    }
    // else status remains 'active' (65% chance)
  } else {
    status = 'expired';
  }

  // Generate 1-3 policies if has insurance, otherwise at least 1 expired policy
  const policyCount = hasInsurance ? Math.floor(Math.random() * 3) + 1 : 1;
  const policies: InsurancePolicy[] = [];

  if (hasInsurance) {
    // First policy with the determined status
    policies.push(generateInsurancePolicy(0, status));

    // Additional older policies (all expired)
    for (let i = 1; i < policyCount; i++) {
      policies.push(generateInsurancePolicy(i, 'expired'));
    }
  } else {
    // At least one expired policy to show history
    policies.push(generateInsurancePolicy(0, 'expired'));
  }

  const currentPolicy = status !== 'expired' && policies.length > 0 ? policies[0] : null;
  const totalClaimsMade = policies.reduce((sum, p) => sum + p.claimsMade, 0);

  return {
    registrationNumber: registrationNumber.toUpperCase(),
    ownerName: 'Vehicle Owner',
    vehicleModel: vehicleModels[Math.floor(Math.random() * vehicleModels.length)],
    vehicleClass: 'LMV (Light Motor Vehicle)',
    chassisNumber: `CH${Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('')}`,
    engineNumber: `EN${Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('')}`,
    currentPolicy,
    policyHistory: policies.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()),
    totalPolicies: policyCount,
    totalClaimsMade,
    lastCheckedAt: new Date().toISOString(),
  };
}
