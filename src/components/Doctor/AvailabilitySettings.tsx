import { Settings, Shield, Clock, Zap, Maximize, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AvailabilitySettings } from '../../types/availability';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AvailabilitySettingsProps {
  settings: AvailabilitySettings;
  onUpdate: (settings: AvailabilitySettings) => void;
  isLoading?: boolean;
}

export function AvailabilitySettingsForm({ settings, onUpdate, isLoading }: AvailabilitySettingsProps) {
  const handleChange = (field: keyof AvailabilitySettings, value: any) => {
    onUpdate({ ...settings, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* General Settings */}
      <Card className="border-primary/10 shadow-xl overflow-hidden self-start">
        <CardHeader className="bg-primary/5 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Settings size={20} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Scheduling Logic</CardTitle>
              <p className="text-sm text-muted-foreground font-medium">Configure how appointments are generated</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-muted/20 p-4 rounded-xl border border-muted/40 group hover:border-primary/20 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-bold flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" /> Auto-Approval
                </Label>
                <p className="text-sm text-muted-foreground font-medium">Instantly confirm all incoming bookings</p>
              </div>
              <Switch 
                checked={settings.autoApproval} 
                onCheckedChange={(v: boolean) => handleChange('autoApproval', v)}
                disabled={isLoading}
              />
            </div>
          </div>

          <Separator className="bg-primary/5 h-[1.5px]" />

          <div className="grid grid-cols-1 gap-8 pt-2">
            <div className="space-y-3">
              <Label className="text-sm font-bold flex items-center gap-2.5">
                  <Maximize size={16} className="text-primary/70" /> Slot Duration
              </Label>
              <Select 
                value={settings.slotDuration.toString()} 
                onValueChange={(v) => handleChange('slotDuration', parseInt(v))}
              >
                <SelectTrigger className="h-12 font-bold bg-muted/30 border-primary/10 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15" className="font-medium">15 Minutes</SelectItem>
                  <SelectItem value="30" className="font-medium">30 Minutes</SelectItem>
                  <SelectItem value="45" className="font-medium">45 Minutes</SelectItem>
                  <SelectItem value="60" className="font-medium">60 Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold flex items-center gap-2.5">
                  <Clock size={16} className="text-primary/70" /> Buffer Time
              </Label>
              <Select 
                value={settings.bufferTime.toString()} 
                onValueChange={(v) => handleChange('bufferTime', parseInt(v))}
              >
                <SelectTrigger className="h-12 font-bold bg-muted/30 border-primary/10 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" className="font-medium">No Buffer</SelectItem>
                  <SelectItem value="5" className="font-medium">5 Minutes (Short)</SelectItem>
                  <SelectItem value="10" className="font-medium">10 Minutes (Standard)</SelectItem>
                  <SelectItem value="15" className="font-medium">15 Minutes (Relaxed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 items-start">
              <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                  Changes to slot duration will affect future bookings only. Existing appointments will remain unchanged.
              </p>
          </div>
        </CardContent>
      </Card>

      {/* Security & Access */}
      <Card className="border-primary/10 shadow-xl overflow-hidden self-start">
        <CardHeader className="bg-primary/5 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sage-500/10 rounded-xl text-sage-600">
              <Shield size={20} />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Booking Limits</CardTitle>
              <p className="text-sm text-muted-foreground font-medium">Prevent scheduling fatigue</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
           <div className="space-y-3">
              <Label className="text-sm font-bold flex items-center gap-2.5">
                  Max Appointments Per Day
              </Label>
              <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input 
                        type="number" 
                        value={settings.maxAppointments || ''} 
                        onChange={(e) => handleChange('maxAppointments', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="No limit"
                        className="w-full h-12 px-4 py-2 font-bold bg-muted/30 border-primary/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <Badge variant="outline" className="h-12 px-6 font-bold uppercase tracking-widest text-[10px] text-muted-foreground border-dashed">
                      Optional
                  </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold px-1">
                  Once this limit is reached, all remaining slots for that day will be blocked automatically.
              </p>
          </div>
          
          <div className="p-6 bg-muted/40 rounded-2xl border-2 border-dashed border-muted flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-muted-foreground">
                  <Settings size={20} className="opacity-40" />
              </div>
              <div>
                  <p className="text-xs font-bold text-muted-foreground">More settings coming soon</p>
                  <p className="text-[10px] text-muted-foreground opacity-70 mt-1 uppercase tracking-wider font-bold">Integration / Sync</p>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
