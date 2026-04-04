import { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AvailabilityRule } from '@/types/availability';

interface WeeklyScheduleProps {
  rules: AvailabilityRule[];
  onUpdate: (rules: AvailabilityRule[]) => void;
  isLoading?: boolean;
}

const DAYS = [
  { label: 'Sun', full: 'Sunday', value: 0 },
  { label: 'Mon', full: 'Monday', value: 1 },
  { label: 'Tue', full: 'Tuesday', value: 2 },
  { label: 'Wed', full: 'Wednesday', value: 3 },
  { label: 'Thu', full: 'Thursday', value: 4 },
  { label: 'Fri', full: 'Friday', value: 5 },
  { label: 'Sat', full: 'Saturday', value: 6 },
];

export function WeeklySchedule({ rules, onUpdate, isLoading }: WeeklyScheduleProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleAdd = () => {
    if (startTime && endTime) {
      onUpdate([...rules, { dayOfWeek: selectedDay, startTime, endTime } as AvailabilityRule]);
    }
  };

  const handleRemove = (idx: number) => {
    const next = [...rules];
    next.splice(idx, 1);
    onUpdate(next);
  };

  const handleBulkAdd = (days: number[]) => {
    const newRules = days.map(d => ({ dayOfWeek: d, startTime, endTime } as AvailabilityRule));
    onUpdate([...rules, ...newRules]);
  };

  // Group rules by day
  const sortedRules = [...rules].sort((a, b) => (a.dayOfWeek || 0) - (b.dayOfWeek || 0));

  return (
    <div className="space-y-6">
      {/* Add Shift Form */}
      <div className="rounded-2xl bg-white p-6 space-y-6 shadow-sm border-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 leading-none mb-1.5">Add Working Hours</h3>
            <p className="text-sm text-slate-500">These will repeat weekly on your calendar.</p>
          </div>
        </div>

        {/* Day Picker — native buttons, no dropdown */}
        <div className="space-y-2">
          <Label className="text-sm">Day</Label>
          <div className="flex gap-1.5">
            {DAYS.map(d => (
              <button
                key={d.value}
                type="button"
                onClick={() => setSelectedDay(d.value)}
                className={`flex-1 rounded-xl px-1 py-3 text-xs font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1976d2]/20 border-0 ${
                  selectedDay === d.value
                    ? 'bg-[#d4e3ff] text-[#001c3a] shadow-sm ring-1 ring-[#d4e3ff]'
                    : 'bg-[#f2f4f6] text-slate-500 hover:bg-[#e6e8ea]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Start</Label>
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">End</Label>
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleAdd} disabled={isLoading} className="flex-1 gap-2 rounded-xl bg-gradient-to-br from-[#005dac] to-[#1976d2] text-white hover:opacity-90 shadow-sm border-0 border-transparent py-6">
            <Plus size={16} /> Add Day Requirement
          </Button>
          <Button variant="ghost" className="rounded-xl flex-1 bg-[#f2f4f6] text-slate-500 hover:bg-[#e6e8ea] hover:text-slate-900 border-0" size="sm" onClick={() => handleBulkAdd([1,2,3,4,5])} disabled={isLoading}>
            Mon–Fri
          </Button>
          <Button variant="ghost" className="rounded-xl flex-1 bg-[#f2f4f6] text-slate-500 hover:bg-[#e6e8ea] hover:text-slate-900 border-0" size="sm" onClick={() => handleBulkAdd([0,1,2,3,4,5,6])} disabled={isLoading}>
            All Days
          </Button>
        </div>
      </div>

      {/* Active Rules */}
      <div className="rounded-2xl bg-white shadow-sm border-0 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Current Schedule</h3>
          <span className="text-xs bg-[#e0e3e5] px-2.5 py-1 rounded-full text-slate-600 font-semibold">{rules.length} rule{rules.length !== 1 ? 's' : ''}</span>
        </div>

        {sortedRules.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center bg-[#f7f9fb] rounded-xl border border-dashed border-[#c1c6d4]">
            <Clock size={28} className="text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-700">No hours set</p>
            <p className="text-sm text-slate-500 mt-1">Add your working hours above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedRules.map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between px-5 py-4 bg-[#f7f9fb] hover:bg-[#eceef0] rounded-xl transition-colors group border-0">
                <div className="flex items-center gap-4">
                  <span className="text-[15px] font-semibold text-slate-900 w-28">
                    {DAYS.find(d => d.value === rule.dayOfWeek)?.full}
                  </span>
                  <span className="text-sm text-slate-600 tabular-nums">
                    {rule.startTime} — {rule.endTime}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(idx)}
                  className="h-8 w-8 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[#93000a] hover:bg-[#ffdad6] shadow-sm border border-[#e0e3e5] hover:border-transparent"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
