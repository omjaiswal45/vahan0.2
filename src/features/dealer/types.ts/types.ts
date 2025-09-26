
export type Car = {
  make: string;
  model: string;
  year: number;
  fuel: "Petrol" | "Diesel" | "CNG" | "EV" | "Hybrid";
  transmission: "Manual" | "Automatic";
};

export type Listing = {
  id: string;
  regNo: string;
  title: string;
  price: number;
  km: number;
  city: string;
  images: string[];
  car: Car;
};

export type Dealer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
};

export type Lead = {
  id: string;
  name: string;
  contact: string;
  inquiry: string;
  listingId: string;
};
