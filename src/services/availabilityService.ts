import api from '@/lib/api';
import type { AvailabilityContext, AvailabilityRule, AvailabilityOverride, AvailabilitySettings, AvailableSlot } from '../types/availability';

export const availabilityService = {
  getAvailabilityContext: async (locationId?: string): Promise<AvailabilityContext> => {
    const params = locationId ? { locationId } : {};
    const { data } = await api.get<AvailabilityContext>('/api/availability/context', { params });
    return data;
  },

  updateWeeklySchedule: async (rules: AvailabilityRule[], clinicId?: number) => {
    const { data } = await api.post('/api/availability/rules', { rules, clinicId });
    return data;
  },

  addDateOverride: async (override: Omit<AvailabilityOverride, 'id'>) => {
    const { data } = await api.post('/api/availability/overrides', override);
    return data;
  },

  updateSettings: async (settings: AvailabilitySettings) => {
    const { data } = await api.put('/api/availability/settings', settings);
    return data;
  },

  getAvailableSlots: async (doctorId: number, date: string, locationId?: number): Promise<AvailableSlot[]> => {
    const params = { doctorId, date, locationId };
    const { data } = await api.get<AvailableSlot[]>('/api/availability/slots', { params });
    return data;
  }
};
