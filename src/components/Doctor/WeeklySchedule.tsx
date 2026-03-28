import { useState } from 'react';
import { Plus, Trash2, Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AvailabilityRule } from '../../types/availability';
import { Badge } from '@/components/ui/badge';

interface WeeklyScheduleProps {
  rules: AvailabilityRule[];
  onUpdate: (rules: AvailabilityRule[]) => void;
  isLoading?: boolean;
}

const DAYS = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

export function WeeklySchedule({ rules, onUpdate, isLoading }: WeeklyScheduleProps) {
  const [newRule, setNewRule] = useState<Partial<AvailabilityRule>>({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00'
  });

  const handleAdd = () => {
    if (newRule.startTime && newRule.endTime && newRule.dayOfWeek !== undefined) {
      onUpdate([...rules, newRule as AvailabilityRule]);
      setNewRule({ ...newRule });
    }
  };

  const handleRemove = (idx: number) => {
    const next = [...rules];
    next.splice(idx, 1);
    onUpdate(next);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Add New Rule */}
      <Card className="lg:col-span-4 self-start border-primary/20 shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Plus size={18} />
            </div>
            <CardTitle className="text-lg font-bold tracking-tight">Add Recurring Shift</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 px-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
                <Calendar size={14} className="text-primary/70" /> Select Day
            </Label>
            <Select 
              value={newRule.dayOfWeek?.toString()} 
              onValueChange={(v) => setNewRule({ ...newRule, dayOfWeek: parseInt(v) })}
            >
              <SelectTrigger className="h-11 font-medium bg-muted/30 hover:bg-muted/50 border-primary/10 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map(d => (
                  <SelectItem key={d.value} value={d.value.toString()} className="font-medium">{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                  <Clock size={14} className="text-primary/70" /> Starts
              </Label>
              <Input 
                type="time" 
                value={newRule.startTime} 
                onChange={(e) => setNewRule({ ...newRule, startTime: e.target.value })}
                className="h-11 font-medium bg-muted/30 border-primary/10 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                  <Clock size={14} className="text-primary/70" /> Ends
              </Label>
              <Input 
                type="time" 
                value={newRule.endTime} 
                onChange={(e) => setNewRule({ ...newRule, endTime: e.target.value })}
                className="h-11 font-medium bg-muted/30 border-primary/10 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAdd} 
            className="w-full h-11 text-sm font-bold shadow-md hover:shadow-lg transition-all gap-2" 
            disabled={isLoading}
          >
            <Plus size={16} /> Add Rule
          </Button>
          
          <div className="flex gap-2 p-3 bg-muted/20 border border-muted/30 rounded-lg">
              <AlertCircle size={14} className="text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                  Recurring rules apply every week. You can block specific dates later in the calendar view.
              </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Rules List */}
      <Card className="lg:col-span-8 shadow-md border-primary/5">
        <CardHeader className="py-5 flex flex-row items-center justify-between border-b bg-muted/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sage-500/10 rounded-lg text-sage-600">
              <Check size={18} />
            </div>
            <CardTitle className="text-lg font-bold tracking-tight">Active Working Hours</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-sage-100 text-sage-800 border-sage-200">
            {rules.length} Rules Active
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {rules.length === 0 ? (
              <div className="p-16 text-center text-muted-foreground bg-muted/5">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-muted/30">
                    <Calendar size={24} className="opacity-40" />
                </div>
                <p className="font-semibold text-base mb-1">No schedule rules defined</p>
                <p className="text-sm font-medium opacity-70">Add your weekly clinic hours to get started.</p>
              </div>
            ) : (
              rules.sort((a,b) => (a.dayOfWeek || 0) - (b.dayOfWeek || 0)).map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 hover:bg-muted/10 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="min-w-[120px]">
                      <span className="font-bold text-base h-full flex items-center text-primary/80">
                        {DAYS.find(d => d.value === rule.dayOfWeek)?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-full border border-primary/10 transition-colors group-hover:bg-primary/5">
                      <Clock size={14} className="text-primary/60" />
                      <span className="font-bold text-sm tracking-tight text-primary/90">
                        {rule.startTime} - {rule.endTime}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemove(idx)}
                    className="h-9 w-9 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-100"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
