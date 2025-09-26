// src/features/dealer/services/dealerAPI.ts
import axios from "axios";


// Toggle between MOCK and REAL API

const USE_MOCK = true; // set to false when backend is ready


// Real API (Axios)
const api = axios.create({ baseURL: "https://your-api.com" });

const realAPI = {
  getDashboard: () => api.get("/dealer/dashboard"),
  getListings: () => api.get("/dealer/listings"),
  addListing: (data: any) => api.post("/dealer/listing", data),
  updateListing: (id: string, data: any) => api.put(`/dealer/listing/${id}`, data),
  getLeads: () => api.get("/dealer/leads"),
  sendMessage: (leadId: string, message: string) =>
    api.post(`/dealer/lead/${leadId}/message`, { message }),
  getProfile: () => api.get("/dealer/profile"),
  updateProfile: (data: any) => api.put("/dealer/profile", data),
};

// Mock API
const fakeDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockAPI = {
  getDashboard: async () => {
    await fakeDelay(1000);
    return {
      data: {
        totalListings: 5,
        activeLeads: 12,
        soldCars: 3,
        revenue: "₹18,50,000",
      },
    };
  },

getListings: async () => {
  await fakeDelay(1000);
  return {
    data: [
      {
        id: "1",
        title: "Maruti Swift 2019",
        price: "₹4,50,000",
        year: 2019,
        km: "45,000 km",
        fuel: "Petrol",
        images: [
          "https://images.unsplash.com/photo-1625231334168-35067f8853ed?w=600&auto=format&fit=crop&q=60",
          "https://imgd.aeplcdn.com/664x374/n/0ro0egb_1840518.jpg?q=80",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5eNmgY408lC072VHFjnGAYv6kPVuX6rBPrKKaMRm2y-FLCXlSgS_ZAmnqFNDFxdJjZOs&usqp=CAU"
        ],
        city: "Mumbai",
        make: "Maruti",
        model: "Swift",
      },
      {
        id: "2",
        title: "Hyundai i20 2020",
        price: "₹6,20,000",
        year: 2020,
        km: "32,000 km",
        fuel: "Diesel",
        images: [
          "https://images.prismic.io/carwow/f70a0317-00e0-4f67-92f5-7181534a1051_hyundai-i20-2024-rhd-front34dynamic.jpg?auto=format&cs=tinysrgb&fit=max&q=60",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx7y4s-uva9goIQHRaUIea5ygK-GyoMouOtwG8diUKt0lb429xCHINpCL8E90n3IYoDBE&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7nPkzoGCSNWMq1XSWo5Uqr-6lDJvonqybp09rpyjB6LB3_H8g56VILxwcARwfuV6gR24&usqp=CAU"
        ],
        city: "Delhi",
        make: "Hyundai",
        model: "i20",
      },
      {
        id: "3",
        title: "Honda City 2021",
        price: "₹9,00,000",
        year: 2021,
        km: "27,500 km",
        fuel: "Petrol",
        images: [
          "https://www.motorbeam.com/wp-content/uploads/2021-Honda-City-Hybrid-i-MMD.jpg",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbTvJyJYzbggbla1AePPOGxBpV8b3uTHsQhkXRQ0jlpV406GkqFwuH9TvMry9oShjMvAw&usqp=CAU",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlrHYmbI3eCa0qG9VrlxCTZaHVqF4Aul6jymGztkHptF_3yodv5lr23MCbcxBpli0UYC0&usqp=CAU"
        ],
        city: "Bangalore",
        make: "Honda",
        model: "City",
      },
      {
        id: "4",
        title: "Tata Nexon EV 2022",
        price: "₹14,00,000",
        year: 2022,
        km: "15,000 km",
        fuel: "Electric",
        images: [
          "https://ackodrive-assets.ackodrive.com/media/test_N9vqQuH.png",
          "https://stimg.cardekho.com/images/cms/carnewsimages/editorimages/65eb47507e366.jpg?impolicy=resize&imwidth=420",
          "https://imgd.aeplcdn.com/642x361/n/cw/ec/98051/left-front-three-quarter1.jpeg?wm=1&q=75"
        ],
        city: "Pune",
        make: "Tata",
        model: "Nexon EV",
      },
      {
        id: "5",
        title: "Mahindra XUV700 2023",
        price: "₹21,00,000",
        year: 2023,
        km: "10,000 km",
        fuel: "Diesel",
        images: [
          "https://images.moneycontrol.com/static-mcnews/2018/12/Mahindra-xuv300-top-770x433.jpg",
          "https://images.news18.com/ibnkhabar/uploads/2022/10/mahindra-xuv-300-4cb76c0f-1.jpg?impolicy=website&width=640&height=480",
          "https://images.financialexpressdigital.com/2019/02/10-3.jpg?w=470"
        ],
        city: "Chennai",
        make: "Mahindra",
        model: "XUV700",
      },
    ],
  };
},

getCarByRegNo: async (regNo: string) => {
  await fakeDelay(800);
  if (regNo.toLowerCase() === "dl02mk8910") {
    return {
      data: {
        make: "Honda",
        model: "City",
        year: 2021,
        fuel: "Petrol",
        transmission: "Manual",
      },
    };
  }
  throw new Error("Car not found for this registration");
},



  addListing: async (data: any) => {
    await fakeDelay(1000);
    return {
      data: { id: String(Date.now()), ...data },
    };
  },

  updateListing: async (id: string, data: any) => {
    await fakeDelay(1000);
    return {
      data: { id, ...data },
    };
  },

  getLeads: async () => {
    await fakeDelay(1000);
    return {
      data: [
        { id: "101", name: "Amit Sharma", phone: "+91 9876543210", interestedIn: "Honda City 2021" },
        { id: "102", name: "Priya Verma", phone: "+91 9988776655", interestedIn: "Hyundai i20 2020" },
      ],
    };
  },

  sendMessage: async (leadId: string, message: string) => {
    await fakeDelay(800);
    return {
      data: { success: true, leadId, message },
    };
  },

  getProfile: async () => {
    await fakeDelay(1000);
    return {
      data: {
        id: "dealer-1",
        name: "Om Jaiswal",
        email: "dealer@example.com",
        phone: "+91 9123456789",
        dealership: "Om Cars & Motors",
      },
    };
  },

  updateProfile: async (data: any) => {
    await fakeDelay(1000);
    return {
      data: { ...data },
    };
  },
};

// --------------------
// Export based on flag
// --------------------
export const {
  getDashboard,
  getListings,
  addListing,
  updateListing,
  getLeads,
  sendMessage,
  getProfile,
  updateProfile,
} = USE_MOCK ? mockAPI : realAPI;





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
