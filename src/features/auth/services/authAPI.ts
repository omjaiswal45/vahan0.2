import axios from 'axios';
const API_BASE = 'https://your-backend.com/api'; // replace with your backend

export const emailLogin = (email: string, password: string) =>
  axios.post(`${API_BASE}/auth/login`, { email, password });

export const emailSignup = (name: string, email: string, password: string) =>
  axios.post(`${API_BASE}/auth/signup`, { name, email, password });

export const sendOtp = (phone: string) =>
  axios.post(`${API_BASE}/auth/send-otp`, { phone });

export const verifyOtp = (phone: string, otp: string) =>
  axios.post(`${API_BASE}/auth/verify-otp`, { phone, otp });
