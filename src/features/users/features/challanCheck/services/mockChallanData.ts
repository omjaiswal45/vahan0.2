// src/features/users/features/challanCheck/services/mockChallanData.ts

import { VehicleChallanData, ChallanRecord } from '../types';

const violationTypes = [
  { type: 'Overspeeding', description: 'Exceeding speed limit by 20 km/h', baseAmount: 2000 },
  { type: 'Red Light Violation', description: 'Crossing red light signal', baseAmount: 1000 },
  { type: 'Wrong Parking', description: 'Parking in no-parking zone', baseAmount: 500 },
  { type: 'No Helmet', description: 'Riding without helmet', baseAmount: 1000 },
  { type: 'Triple Riding', description: 'More than 2 persons on two-wheeler', baseAmount: 1000 },
  { type: 'No Seatbelt', description: 'Not wearing seatbelt', baseAmount: 1000 },
  { type: 'Mobile Phone Usage', description: 'Using mobile while driving', baseAmount: 5000 },
  { type: 'Drunk Driving', description: 'Driving under influence of alcohol', baseAmount: 10000 },
  { type: 'Documents Not Available', description: 'Not carrying valid documents', baseAmount: 500 },
  { type: 'Pollution Certificate', description: 'Expired or no PUC certificate', baseAmount: 1000 },
];

const locations = [
  'Connaught Place, New Delhi',
  'Andheri West, Mumbai',
  'MG Road, Bangalore',
  'Park Street, Kolkata',
  'Anna Salai, Chennai',
  'Banjara Hills, Hyderabad',
  'CG Road, Ahmedabad',
  'MI Road, Jaipur',
  'Civil Lines, Lucknow',
  'FC Road, Pune',
];

const officerNames = [
  'Inspector Rajesh Kumar',
  'Sub-Inspector Priya Sharma',
  'Constable Amit Singh',
  'Inspector Neha Verma',
  'Traffic Officer Suresh Patel',
  'ASI Deepak Mehta',
];

function generateChallan(index: number): ChallanRecord {
  const violation = violationTypes[Math.floor(Math.random() * violationTypes.length)];
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 180));
  
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 30);
  
  const isPaid = Math.random() > 0.6;
  const isOverdue = !isPaid && new Date() > dueDate;
  
  const penaltyAmount = isOverdue ? violation.baseAmount * 0.2 : 0;
  
  return {
    id: `CH${Date.now()}${index}`,
    challanNumber: `TPC/${issueDate.getFullYear()}/${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    issueDate: issueDate.toISOString(),
    violationType: violation.type,
    violationDescription: violation.description,
    amount: violation.baseAmount,
    penaltyAmount,
    totalAmount: violation.baseAmount + penaltyAmount,
    status: isPaid ? 'paid' : (isOverdue ? 'overdue' : 'pending'),
    location: locations[Math.floor(Math.random() * locations.length)],
    officerName: officerNames[Math.floor(Math.random() * officerNames.length)],
    courtName: Math.random() > 0.7 ? 'District Traffic Court' : undefined,
    dueDate: dueDate.toISOString(),
  };
}

export function generateMockChallanData(registrationNumber: string): VehicleChallanData {
  const challanCount = Math.floor(Math.random() * 8);
  const challans = Array.from({ length: challanCount }, (_, i) => generateChallan(i));
  
  const totalPendingAmount = challans
    .filter(c => c.status !== 'paid')
    .reduce((sum, c) => sum + c.totalAmount, 0);
  
  const totalPaidAmount = challans
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.totalAmount, 0);
  
  const vehicleModels = [
    'Maruti Suzuki Swift',
    'Hyundai Creta',
    'Honda City',
    'Tata Nexon',
    'Mahindra XUV700',
    'Toyota Innova',
    'Kia Seltos',
  ];
  
  return {
    registrationNumber: registrationNumber.toUpperCase(),
    ownerName: 'Vehicle Owner',
    vehicleModel: vehicleModels[Math.floor(Math.random() * vehicleModels.length)],
    vehicleClass: 'Motor Car',
    chassisNumber: `MA3${Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('')}`,
    engineNumber: `K${Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('')}`,
    totalChallans: challanCount,
    totalPendingAmount,
    totalPaidAmount,
    challans: challans.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()),
    lastCheckedAt: new Date().toISOString(),
  };
}