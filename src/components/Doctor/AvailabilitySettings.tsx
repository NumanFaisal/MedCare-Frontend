import { Clock, Zap, Shield, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import type { AvailabilitySettings } from '@/types/availability';

interface AvailabilitySettingsProps {
  settings: AvailabilitySettings;
  onUpdate: (settings: AvailabilitySettings) => void;
  isLoading?: boolean;
}

const SLOT_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

const BUFFER_OPTIONS = [
  { label: 'None', value: 0 },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
];

export function AvailabilitySettingsForm({ settings, onUpdate, isLoading }: AvailabilitySettingsProps) {
  const handleChange = (field: keyof AvailabilitySettings, value: number | boolean | null) => {
    onUpdate({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Toggles Section */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200/50 divide-y divide-gray-100">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Zap size={16} className="text-amber-500" />
            <div>
              <p className="text-sm font-medium">Auto-approve bookings</p>
              <p className="text-xs text-muted-foreground mt-0.5">Instantly confirm all incoming appointments</p>
            </div>
          </div>
          <Switch
            checked={settings.autoApproval}
            onCheckedChange={(v: boolean) => handleChange('autoApproval', v)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-red-500" />
            <div>
              <p className="text-sm font-medium">Vacation mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">Block all appointments temporarily</p>
            </div>
          </div>
          <Switch
            checked={settings.vacationMode}
            onCheckedChange={(v: boolean) => handleChange('vacationMode', v)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Slot Duration — native button group instead of broken Select */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200/50 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Appointment duration</p>
            <p className="text-xs text-muted-foreground mt-0.5">Length of each booking slot</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {SLOT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChange('slotDuration', opt.value)}
              disabled={isLoading}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                settings.slotDuration === opt.value
                  ? 'border-transparent bg-primary text-primary-foreground shadow-sm'
                  : 'border border-gray-200 bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Buffer Time — native button group */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200/50 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Buffer between appointments</p>
            <p className="text-xs text-muted-foreground mt-0.5">Break time between consecutive bookings</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BUFFER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChange('bufferTime', opt.value)}
              disabled={isLoading}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                settings.bufferTime === opt.value
                  ? 'border-transparent bg-primary text-primary-foreground shadow-sm'
                  : 'border border-gray-200 bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Appointments */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200/50 p-5 space-y-3">
        <Label className="text-sm font-medium">Daily appointment limit</Label>
        <Input
          type="number"
          value={settings.maxAppointments ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('maxAppointments', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="No limit"
          className="max-w-[200px]"
        />
        <p className="text-xs text-muted-foreground">Leave empty for unlimited. Slots will close once the limit is reached.</p>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground px-1">
        <Info size={14} className="mt-0.5 shrink-0" />
        <p>Changes apply to future appointments only. Existing bookings are not affected.</p>
      </div>
    </div>
  );
}
