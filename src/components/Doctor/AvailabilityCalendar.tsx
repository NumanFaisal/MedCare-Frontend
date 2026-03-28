import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import type { AvailabilityOverride, AvailabilityRule } from '../../types/availability';
import { cn } from '../../lib/utils';

interface AvailabilityCalendarProps {
  rules: AvailabilityRule[];
  overrides: AvailabilityOverride[];
  onDateClick: (date: Date) => void;
  selectedClinic?: number | null;
}

export function AvailabilityCalendar({ rules, overrides, onDateClick }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getDayStatus = (date: Date) => {
    const dayOfWeek = getDay(date);

    // 1. Check for specific overrides first
    const fullDayOverride = overrides.find(o => isSameDay(new Date(o.date), date) && !o.startTime);
    if (fullDayOverride) {
      return fullDayOverride.status === 'AVAILABLE' ? 'available' : 'unavailable';
    }

    const timeOverrides = overrides.filter(o => isSameDay(new Date(o.date), date) && o.startTime);
    if (timeOverrides.length > 0) {
      return timeOverrides.some(o => o.status === 'AVAILABLE') ? 'partially-available' : 'unavailable';
    }

    // 2. Check weekly rules
    const hasRule = rules.some(r => r.dayOfWeek === dayOfWeek);
    return hasRule ? 'available' : 'unavailable';
  };

  const getDayLabel = (status: string) => {
    switch (status) {
      case 'available': return <Badge className="bg-sage-100 text-sage-700 hover:bg-sage-200 border-sage-200">Available</Badge>;
      case 'unavailable': return <Badge variant="outline" className="text-muted-foreground">Off</Badge>;
      case 'partially-available': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Mixed</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="w-full shadow-lg border-primary/10 overflow-hidden">
      <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <CalendarIcon size={20} />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">Monthly Availability View</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())} className="font-semibold px-4 h-8">
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const status = getDayStatus(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelectedDay = isToday(day);

            return (
              <div
                key={day.toString()}
                onClick={() => onDateClick(day)}
                className={cn(
                  "min-h-[110px] p-2 border-r border-b cursor-pointer transition-all duration-200 hover:bg-muted/50 relative group",
                  !isCurrentMonth && "bg-muted/10 opacity-40",
                  isSelectedDay && "bg-primary/5"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-sm font-semibold flex items-center justify-center w-6 h-6 rounded-full",
                    isSelectedDay ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    isCurrentMonth && !isSelectedDay && "text-foreground"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                {isCurrentMonth && (
                    <div className="space-y-1">
                        {getDayLabel(status)}
                        {overrides.some(o => isSameDay(new Date(o.date), day)) && (
                            <Badge variant="secondary" className="text-[10px] h-4 px-1 flex gap-1 items-center bg-amber-50 text-amber-700 border-amber-200">
                                <AlertCircle size={8} /> Override
                            </Badge>
                        )}
                    </div>
                )}
                
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 pointer-events-none transition-all duration-200" />
              </div>
            );
          })}
        </div>
      </CardContent>
      <div className="p-4 bg-muted/5 border-t text-[11px] flex gap-6 font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-sage-100 border border-sage-200" /> Sage (Available)
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" /> Blue (Partially)
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-white border border-muted" /> Empty (Blocked)
          </div>
      </div>
    </Card>
  );
}
