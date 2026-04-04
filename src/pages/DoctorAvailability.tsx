import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar as CalendarIcon, Settings2, Repeat, Loader2, Ban, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AvailabilityCalendar } from '@/components/Doctor/AvailabilityCalendar';
import { WeeklySchedule } from '@/components/Doctor/WeeklySchedule';
import { AvailabilitySettingsForm } from '@/components/Doctor/AvailabilitySettings';
import { availabilityService } from '@/services/availabilityService';
import type { AvailabilityRule } from '@/types/availability';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export default function DoctorAvailabilityPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('weekly');

  // Override Modal
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<'UNAVAILABLE' | 'AVAILABLE'>('UNAVAILABLE');
  const [overrideMode, setOverrideMode] = useState<'ALL_DAY' | 'TIME_BLOCK'>('ALL_DAY');
  const [overrideStart, setOverrideStart] = useState('09:00');
  const [overrideEnd, setOverrideEnd] = useState('17:00');

  const { data: context, isLoading, error } = useQuery({
    queryKey: ['availability'],
    queryFn: () => availabilityService.getAvailabilityContext()
  });

  const updateRules = useMutation({
    mutationFn: (rules: AvailabilityRule[]) => availabilityService.updateWeeklySchedule(rules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Schedule updated');
    },
    onError: () => toast.error('Failed to update schedule')
  });

  const updateSettings = useMutation({
    mutationFn: availabilityService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Settings saved');
    }
  });

  const addOverride = useMutation({
    mutationFn: availabilityService.addDateOverride,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      setIsOverrideOpen(false);
      toast.success('Override saved');
    }
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setOverrideStatus('UNAVAILABLE');
    setOverrideMode('ALL_DAY');
    setOverrideStart('09:00');
    setOverrideEnd('17:00');
    setIsOverrideOpen(true);
  };

  const handleSaveOverride = () => {
    if (!selectedDate) return;
    addOverride.mutate({
      date: format(selectedDate, 'yyyy-MM-dd'),
      status: overrideStatus,
      startTime: overrideMode === 'TIME_BLOCK' ? overrideStart : null,
      endTime: overrideMode === 'TIME_BLOCK' ? overrideEnd : null,
      clinicId: null
    });
  };

  // --- Loading ---
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-muted-foreground" size={32} />
    </div>
  );

  // --- Error ---
  if (error) return (
    <div className="max-w-md mx-auto mt-24 text-center space-y-4">
      <p className="text-lg font-medium">Unable to load availability</p>
      <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 bg-[#f7f9fb] min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 font-sans">Availability</h1>
        <p className="text-base text-slate-500 mt-2">
          Manage your working hours, set exceptions, and configure booking preferences.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto p-1 bg-[#f2f4f6] border-0 rounded-xl inline-flex mb-8">
          <TabsTrigger value="weekly" className="text-sm gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all text-slate-500">
            <Repeat size={16} /> Weekly Hours
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-sm gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all text-slate-500">
            <CalendarIcon size={16} /> Exceptions Calendar
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-sm gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all text-slate-500">
            <Settings2 size={16} /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-6">
          <WeeklySchedule
            rules={context?.availability || []}
            onUpdate={(rules) => updateRules.mutate(rules)}
            isLoading={updateRules.isPending}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <AvailabilityCalendar
            rules={context?.availability || []}
            overrides={context?.overrides || []}
            onDateClick={handleDateClick}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <AvailabilitySettingsForm
            settings={context?.settings || { slotDuration: 30, bufferTime: 5, autoApproval: true, vacationMode: false }}
            onUpdate={(s) => updateSettings.mutate(s)}
            isLoading={updateSettings.isPending}
          />
        </TabsContent>
      </Tabs>

      {/* Override Dialog */}
      <Dialog open={isOverrideOpen} onOpenChange={setIsOverrideOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Date Override</DialogTitle>
            <DialogDescription>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Status Toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOverrideStatus('UNAVAILABLE')}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-0 p-4 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                    overrideStatus === 'UNAVAILABLE'
                      ? 'bg-[#ffdad6] text-[#93000a] shadow-sm ring-1 ring-[#ffdad6]'
                      : 'bg-[#f2f4f6] text-slate-500 hover:bg-[#e6e8ea]'
                  }`}
                >
                  <Ban size={14} /> Block
                </button>
                <button
                  type="button"
                  onClick={() => setOverrideStatus('AVAILABLE')}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-0 p-4 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                    overrideStatus === 'AVAILABLE'
                      ? 'bg-[#d4e3ff] text-[#001c3a] shadow-sm ring-1 ring-[#d4e3ff]'
                      : 'bg-[#f2f4f6] text-slate-500 hover:bg-[#e6e8ea]'
                  }`}
                >
                  <Plus size={14} /> Available
                </button>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Duration</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOverrideMode('ALL_DAY')}
                  className={`rounded-xl border-0 px-4 py-3 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/20 flex items-center justify-center ${
                    overrideMode === 'ALL_DAY'
                      ? 'bg-[#d4e3ff] text-[#001c3a] shadow-sm'
                      : 'bg-[#f2f4f6] text-slate-500 hover:bg-[#e6e8ea]'
                  }`}
                >
                  Entire Day
                </button>
                <button
                  type="button"
                  onClick={() => setOverrideMode('TIME_BLOCK')}
                  className={`rounded-xl border-0 px-4 py-3 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/20 flex items-center justify-center ${
                    overrideMode === 'TIME_BLOCK'
                      ? 'bg-[#d4e3ff] text-[#001c3a] shadow-sm'
                      : 'bg-[#f2f4f6] text-slate-500 hover:bg-[#e6e8ea]'
                  }`}
                >
                  Time Range
                </button>
              </div>
            </div>

            {/* Time inputs */}
            {overrideMode === 'TIME_BLOCK' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Start</Label>
                  <Input type="time" value={overrideStart} onChange={(e) => setOverrideStart(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">End</Label>
                  <Input type="time" value={overrideEnd} onChange={(e) => setOverrideEnd(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-6 sm:justify-between w-full">
            <Button variant="ghost" onClick={() => setIsOverrideOpen(false)} className="rounded-xl text-slate-500 hover:text-slate-900">Cancel</Button>
            <Button onClick={handleSaveOverride} disabled={addOverride.isPending} className="rounded-xl bg-gradient-to-br from-[#005dac] to-[#1976d2] text-white hover:opacity-90 shadow-sm border-0">
              {addOverride.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
