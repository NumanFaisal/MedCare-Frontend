import axios from 'axios';
import type { AvailabilityContext, AvailabilityRule, AvailabilityOverride, AvailabilitySettings, AvailableSlot } from '../types/availability';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add interceptor to include token (if stored in localStorage, usually it's in cookies for this project)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const availabilityService = {
  getAvailabilityContext: async (locationId?: string): Promise<AvailabilityContext> => {
    const params = locationId ? { locationId } : {};
    const { data } = await api.get<AvailabilityContext>('/availability/context', { params });
    return data;
  },

  updateWeeklySchedule: async (rules: AvailabilityRule[], clinicId?: number) => {
    const { data } = await api.post('/availability/rules', { rules, clinicId });
    return data;
  },

  addDateOverride: async (override: Omit<AvailabilityOverride, 'id'>) => {
    const { data } = await api.post('/availability/overrides', override);
    return data;
  },

  updateSettings: async (settings: AvailabilitySettings) => {
    const { data } = await api.put('/availability/settings', settings);
    return data;
  },

  getAvailableSlots: async (doctorId: number, date: string, locationId?: number): Promise<AvailableSlot[]> => {
    const params = { doctorId, date, locationId };
    const { data } = await api.get<AvailableSlot[]>('/availability/slots', { params });
    return data;
  }
};
