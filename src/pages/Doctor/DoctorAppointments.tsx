import { useState } from "react";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, Clock, User, Phone, 
   Search, AlertCircle 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  notes: string;
  patient: {
    user: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      userUniqueId: string;
    };
  };
}

const fetchAllAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get("/api/appointments/doctor/my-appointments");
  return response.data.appointments;
};

export default function DoctorAppointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODAY");

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['doctor-all-appointments'],
    queryFn: fetchAllAppointments
  });

  const filteredAppointments = appointments.filter(app => {
    const appDate = new Date(app.appointmentDate).toLocaleDateString();
    const today = new Date().toLocaleDateString();

    const matchesSearch = `${app.patient.user.firstName} ${app.patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      app.patient.user.userUniqueId.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "TODAY") {
      matchesStatus = appDate === today;
    } else if (statusFilter !== "ALL") {
      matchesStatus = app.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 bg-slate-200" />
        <div className="grid gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full bg-slate-200" />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-red-500">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>Failed to load appointments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
          <p className="text-gray-500">Manage your complete appointment history</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by patient name or ID..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={statusFilter === "TODAY" ? "default" : "outline"}
                onClick={() => setStatusFilter("TODAY")}
                size="sm"
              >
                Today
              </Button>
              <Button 
                variant={statusFilter === "ALL" ? "default" : "outline"}
                onClick={() => setStatusFilter("ALL")}
                size="sm"
              >
                All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app) => (
            <Card key={app.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        {app.patient.user.firstName} {app.patient.user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {app.patient.user.userUniqueId}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(app.appointmentDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(app.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {app.patient.user.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Badge className={
                      app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                      app.status === 'CANCELLED' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                      'bg-green-100 text-green-800 hover:bg-green-100'
                    }>
                      {app.status}
                    </Badge>
                    <p className="text-sm text-gray-500 italic mt-2">
                      "{app.notes || 'No notes provided'}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Calendar className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
            <p className="text-gray-500">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
