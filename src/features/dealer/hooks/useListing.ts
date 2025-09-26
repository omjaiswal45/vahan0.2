import { useState } from "react";
import { addListing } from "../services/dealerAPI";
import { Listing, Car } from "../types.ts/types";

export function useListing() {
  const [loading, setLoading] = useState(false);
  const [carDetails, setCarDetails] = useState<Car | null>(null);

  // Fake reg lookup (you can replace with API later)
  const fetchCarDetails = async (regNo: string) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setCarDetails({
        make: "Honda",
        model: "City",
        year: 2021,
        fuel: "Petrol",
        transmission: "Manual",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewListing = async (data: Omit<Listing, "id">) => {
    setLoading(true);
    try {
      const res = await addListing(data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    carDetails,
    fetchCarDetails,
    createNewListing,
  };
}
