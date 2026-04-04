export interface AvailabilityRule {
  id?: number;
  dayOfWeek: number; // 0-6
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  clinicId?: number | null;
}

export type OverrideStatus = 'AVAILABLE' | 'UNAVAILABLE';

export interface AvailabilityOverride {
  id?: number;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  status: OverrideStatus;
  clinicId?: number | null;
}

export interface AvailabilitySettings {
  slotDuration: number;
  bufferTime: number;
  maxAppointments?: number | null;
  autoApproval: boolean;
  vacationMode: boolean;
}

export interface Clinic {
  id: number;
  name: string;
  address?: string;
  phoneNumber?: string;
}

export interface AvailabilityContext {
  id: number;
  availability: AvailabilityRule[];
  overrides: AvailabilityOverride[];
  settings: AvailabilitySettings | null;
  clinics: { clinic: Clinic }[];
}

export interface AvailableSlot {
  time: string;
  endTime: string;
  dateTime: string;
  available: boolean;
}
