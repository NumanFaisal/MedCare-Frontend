import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon, 
  Repeat, 
  MapPin, 
  Plus, 
  Save, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AvailabilityCalendar } from '@/components/Doctor/AvailabilityCalendar';
import { WeeklySchedule } from '@/components/Doctor/WeeklySchedule';
import { AvailabilitySettingsForm } from '@/components/Doctor/AvailabilitySettings';
import { availabilityService } from '@/services/availabilityService';
import type { AvailabilityRule } from '@/types/availability';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';

export default function DoctorAvailabilityPage() {
  const queryClient = useQueryClient();
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('calendar');
  
  // Override Modal State
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [overrideData, setOverrideData] = useState<{
      status: 'AVAILABLE' | 'UNAVAILABLE';
      startTime: string;
      endTime: string;
      mode: 'ALL_DAY' | 'TIME_BLOCK';
  }>({
      status: 'UNAVAILABLE',
      startTime: '09:00',
      endTime: '17:00',
      mode: 'ALL_DAY'
  });

  const { data: context, isLoading, error } = useQuery({
    queryKey: ['availability', selectedClinic],
    queryFn: () => availabilityService.getAvailabilityContext(selectedClinic === 'all' ? undefined : selectedClinic)
  });

  const updateRules = useMutation({
    mutationFn: (rules: AvailabilityRule[]) => availabilityService.updateWeeklySchedule(rules, selectedClinic === 'all' ? undefined : parseInt(selectedClinic)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Weekly schedule updated');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update schedule')
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
      setIsOverrideModalOpen(false);
      toast.success('Date override applied');
    }
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsOverrideModalOpen(true);
  };

  const handleApplyOverride = () => {
    if (!selectedDate) return;
    
    addOverride.mutate({
      date: format(selectedDate, 'yyyy-MM-dd'),
      status: overrideData.status,
      startTime: overrideData.mode === 'TIME_BLOCK' ? overrideData.startTime : null,
      endTime: overrideData.mode === 'TIME_BLOCK' ? overrideData.endTime : null,
      clinicId: selectedClinic === 'all' ? null : parseInt(selectedClinic)
    });
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Syncing availability patterns...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto mt-20 p-8 rounded-3xl bg-red-50 border border-red-100 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertCircle size={32} />
        </div>
        <CardTitle className="text-2xl text-red-900">Failed to load schedule</CardTitle>
        <p className="text-red-700 font-medium">There was an error connecting to the availability service. Please check your connection and try again.</p>
        <Button variant="outline" className="mt-4 border-red-200 text-red-700 bg-white hover:bg-red-50" onClick={() => window.location.reload()}>Retry Connection</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
              <div className="h-10 w-1 pt-[2px] bg-primary rounded-full" />
              <h1 className="text-4xl font-extrabold tracking-tight text-primary">Schedule & Clinics</h1>
          </div>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            Manage your professional availability across different locations, set recurring patterns, and define scheduling constraints.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 min-w-[300px]">
          <Label className="text-sm font-bold flex items-center gap-2 px-1">
              <MapPin size={14} className="text-primary" /> Active Practice Location
          </Label>
          <Select value={selectedClinic} onValueChange={setSelectedClinic}>
            <SelectTrigger className="h-12 bg-white shadow-sm border-primary/10 font-bold text-primary focus:ring-primary/20 transition-all">
              <SelectValue placeholder="Select Clinic" />
            </SelectTrigger>
            <SelectContent className="border-primary/10">
              <SelectItem value="all" className="font-bold">All Practice Locations</SelectItem>
              {context?.clinics.map(({ clinic }) => (
                <SelectItem key={clinic.id} value={clinic.id.toString()} className="font-medium">
                  {clinic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-primary/5 shadow-2xl/5 inline-block">
            <TabsList className="bg-transparent h-12 gap-2">
                <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10 px-6 rounded-xl font-bold transition-all gap-2">
                    <CalendarIcon size={16} /> Calendar View
                </TabsTrigger>
                <TabsTrigger value="recurring" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10 px-6 rounded-xl font-bold transition-all gap-2">
                    <Repeat size={16} /> Weekly Pattern
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-10 px-6 rounded-xl font-bold transition-all gap-2">
                    <SettingsIcon size={16} /> Settings
                </TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="calendar" className="focus-visible:outline-none">
          <AvailabilityCalendar 
            rules={context?.availability || []} 
            overrides={context?.overrides || []}
            onDateClick={handleDateClick}
            selectedClinic={selectedClinic === 'all' ? null : parseInt(selectedClinic)}
          />
        </TabsContent>

        <TabsContent value="recurring" className="focus-visible:outline-none">
          <WeeklySchedule 
            rules={context?.availability || []} 
            onUpdate={(rules) => updateRules.mutate(rules)}
            isLoading={updateRules.isPending}
          />
        </TabsContent>

        <TabsContent value="settings" className="focus-visible:outline-none">
          <AvailabilitySettingsForm 
            settings={context?.settings || { slotDuration: 30, bufferTime: 5, autoApproval: true }} 
            onUpdate={(settings) => updateSettings.mutate(settings)}
            isLoading={updateSettings.isPending}
          />
        </TabsContent>
      </Tabs>

      {/* Override Dialog */}
      <Dialog open={isOverrideModalOpen} onOpenChange={setIsOverrideModalOpen}>
        <DialogContent className="sm:max-w-[450px] overflow-hidden p-0 rounded-3xl border-0 shadow-2xl">
          <div className="bg-primary/5 p-8 border-b border-primary/5">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <CalendarIcon size={18} />
                    </div>
                    <DialogTitle className="text-2xl font-black text-primary">Date Override</DialogTitle>
                </div>
                <DialogDescription className="text-primary/70 font-semibold text-base">
                  Changing availability for {selectedDate && format(selectedDate, 'EEEE, MMMM do')}
                </DialogDescription>
              </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Status</Label>
              <RadioGroup 
                value={overrideData.status} 
                onValueChange={(v) => setOverrideData({...overrideData, status: v as any})}
                className="grid grid-cols-2 gap-4"
              >
                  <div className="relative">
                      <RadioGroupItem value="UNAVAILABLE" id="status-unavailable" className="peer sr-only" />
                      <Label 
                        htmlFor="status-unavailable"
                        className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-popover p-6 hover:bg-muted/50 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50/50 cursor-pointer transition-all"
                      >
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                              <AlertCircle size={20} />
                          </div>
                        <span className="font-bold text-red-900">Blocked</span>
                      </Label>
                  </div>
                  <div className="relative">
                      <RadioGroupItem value="AVAILABLE" id="status-available" className="peer sr-only" />
                      <Label 
                        htmlFor="status-available"
                        className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-popover p-6 hover:bg-muted/50 peer-data-[state=checked]:border-sage-500 peer-data-[state=checked]:bg-sage-50/50 cursor-pointer transition-all"
                      >
                          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 mb-2">
                              <Plus size={20} />
                          </div>
                        <span className="font-bold text-sage-900">Available</span>
                      </Label>
                  </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
               <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Override Range</Label>
               <Select value={overrideData.mode} onValueChange={(v) => setOverrideData({...overrideData, mode: v as any})}>
                   <SelectTrigger className="h-14 font-bold border-muted/60 bg-muted/20">
                       <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                       <SelectItem value="ALL_DAY" className="font-medium">Full Day (No slots)</SelectItem>
                       <SelectItem value="TIME_BLOCK" className="font-medium">Specific Time Block</SelectItem>
                   </SelectContent>
               </Select>
            </div>

            {overrideData.mode === 'TIME_BLOCK' && (
              <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Start Time</Label>
                  <Input 
                    type="time" 
                    value={overrideData.startTime} 
                    onChange={(e) => setOverrideData({...overrideData, startTime: e.target.value})}
                    className="h-12 font-bold bg-muted/10 border-primary/5 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">End Time</Label>
                  <Input 
                    type="time" 
                    value={overrideData.endTime} 
                    onChange={(e) => setOverrideData({...overrideData, endTime: e.target.value})}
                    className="h-12 font-bold bg-muted/10 border-primary/5 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-muted/5 flex justify-end gap-3 border-t border-primary/5">
              <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold" onClick={() => setIsOverrideModalOpen(false)}>Cancel</Button>
              <Button className="h-12 px-8 rounded-xl font-black shadow-lg hover:shadow-primary/20 transition-all gap-2" onClick={handleApplyOverride} disabled={addOverride.isPending}>
                {addOverride.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Apply Change
              </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
