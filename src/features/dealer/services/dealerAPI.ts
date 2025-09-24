import axios from 'axios';

const api = axios.create({ baseURL: 'https://your-api.com' });

export const getDashboard = () => api.get('/dealer/dashboard');
export const getListings = () => api.get('/dealer/listings');
export const addListing = (data: any) => api.post('/dealer/listing', data);
export const updateListing = (id: string, data: any) => api.put(`/dealer/listing/${id}`, data);
export const getLeads = () => api.get('/dealer/leads');
export const sendMessage = (leadId: string, message: string) =>
  api.post(`/dealer/lead/${leadId}/message`, { message });
export const getProfile = () => api.get('/dealer/profile');
export const updateProfile = (data: any) => api.put('/dealer/profile', data);




// dealerAPI.ts
// Dummy APIs for frontend testing without backend

// src/features/dealer/services/dealerAPI.ts
// export interface DashboardData {
//   totalListings: number;
//   newLeads: number;
//   recentActivity: string[];
// }

// export interface Listing {
//   id: string;
//   make: string;
//   model: string;
//   year: number;
//   price: number;
//   city: string;
//   images: string[];
// }

// export interface Lead {
//   id: string;
//   customerName: string;
//   message: string;
//   timestamp: string;
// }

// export interface Profile {
//   id: string;
//   name: string;
//   businessName: string;
//   contact: string;
//   address: string;
// }

// // --- Dummy APIs ---

// export const getDashboard = (): Promise<DashboardData> =>
//   new Promise((resolve) =>
//     setTimeout(
//       () =>
//         resolve({
//           totalListings: 12,
//           newLeads: 4,
//           recentActivity: [
//             'New lead from Alice',
//             'Car Honda City added',
//             'Toyota Corolla sold',
//             'Car price updated',
//           ],
//         }),
//       500
//     )
//   );

// export const getListings = (): Promise<Listing[]> =>
//   new Promise((resolve) =>
//     setTimeout(
//       () =>
//         resolve([
//           { id: '1', make: 'Honda', model: 'City', year: 2020, price: 800000, city: 'Delhi', images: [] },
//           { id: '2', make: 'Toyota', model: 'Corolla', year: 2019, price: 900000, city: 'Mumbai', images: [] },
//         ]),
//       500
//     )
//   );

// export const addListing = (data: Listing): Promise<Listing> =>
//   new Promise((resolve) => setTimeout(() => resolve({ ...data, id: String(Date.now()) }), 500));

// export const updateListing = (id: string, data: Partial<Listing>): Promise<Listing> =>
//   new Promise((resolve) => setTimeout(() => resolve({ ...data, id } as Listing), 500));

// export const getLeads = (): Promise<Lead[]> =>
//   new Promise((resolve) =>
//     setTimeout(
//       () =>
//         resolve([
//           { id: 'l1', customerName: 'Alice', message: 'Interested in Honda City', timestamp: '2025-09-24T10:00:00' },
//           { id: 'l2', customerName: 'Bob', message: 'Query about Toyota Corolla', timestamp: '2025-09-24T11:00:00' },
//         ]),
//       500
//     )
//   );

// export const sendMessage = (leadId: string, message: string): Promise<Lead> =>
//   new Promise((resolve) =>
//     setTimeout(() => resolve({ id: leadId, customerName: 'Alice', message, timestamp: new Date().toISOString() }), 300)
//   );

// export const getProfile = (): Promise<Profile> =>
//   new Promise((resolve) =>
//     setTimeout(
//       () =>
//         resolve({
//           id: 'p1',
//           name: 'John Doe',
//           businessName: 'Super Cars Dealer',
//           contact: '+91 9876543210',
//           address: '123, MG Road, Delhi',
//         }),
//       500
//     )
//   );

// export const updateProfile = (data: Partial<Profile>): Promise<Profile> =>
//   new Promise((resolve) => setTimeout(() => resolve({ ...data, id: 'p1' } as Profile), 500));
