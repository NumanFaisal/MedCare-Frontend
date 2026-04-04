import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isToday
} from 'date-fns';
import type { AvailabilityOverride, AvailabilityRule } from '@/types/availability';
import { cn } from '@/lib/utils';

interface AvailabilityCalendarProps {
  rules: AvailabilityRule[];
  overrides: AvailabilityOverride[];
  onDateClick: (date: Date) => void;
}

export function AvailabilityCalendar({ rules, overrides, onDateClick }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const getDayStatus = (date: Date): 'available' | 'blocked' | 'override' | null => {
    const dayOfWeek = getDay(date);

    // Check overrides first
    const hasOverride = overrides.find(o => isSameDay(new Date(o.date), date));
    if (hasOverride) {
      return hasOverride.status === 'UNAVAILABLE' ? 'blocked' : 'override';
    }

    // Check weekly rules
    const hasRule = rules.some(r => r.dayOfWeek === dayOfWeek);
    return hasRule ? 'available' : null;
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm p-6 border-0">
      {/* Month header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 font-sans">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex items-center gap-1.5 bg-[#f2f4f6] rounded-xl p-1">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="h-8 w-8 rounded-lg hover:bg-white hover:text-slate-900 text-slate-500">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date())} className="h-8 text-xs font-semibold px-3 rounded-lg hover:bg-white hover:text-slate-900 text-slate-500">
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="h-8 w-8 rounded-lg hover:bg-white hover:text-slate-900 text-slate-500">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const status = getDayStatus(day);
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);

          return (
            <div
              key={day.toString()}
              onClick={() => inMonth && onDateClick(day)}
              className={cn(
                "relative min-h-[90px] p-2 rounded-xl transition-all border-0",
                inMonth ? "cursor-pointer bg-[#f7f9fb] hover:bg-[#d4e3ff] hover:shadow-sm" : "opacity-30 pointer-events-none bg-transparent",
              )}
            >
              {/* Date number */}
              <span className={cn(
                "inline-flex items-center justify-center w-7 h-7 rounded-sm text-sm font-semibold mb-1",
                today && "bg-[#005dac] text-white rounded-full shadow-sm",
                !today && inMonth && "text-slate-700",
              )}>
                {format(day, 'd')}
              </span>

              {/* Status indicator */}
              {inMonth && status && (
                <div className="mt-2 flex flex-col gap-1">
                  {status === 'available' && (
                    <div className="h-1.5 w-8 rounded-full bg-[#98f994] mx-1" />
                  )}
                  {status === 'blocked' && (
                    <div className="h-1.5 w-8 rounded-full bg-[#ffdad6] mx-1" />
                  )}
                  {status === 'override' && (
                    <div className="h-1.5 w-8 rounded-full bg-[#a5c8ff] mx-1" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mt-8 pt-4 border-t border-dashed border-[#c1c6d4] text-sm text-slate-500 font-medium">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#98f994]" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#ffdad6]" /> Blocked
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#a5c8ff]" /> Override
        </span>
        <span className="ml-auto text-slate-400 text-xs">Click a date to add an override</span>
      </div>
    </div>
  );
}
