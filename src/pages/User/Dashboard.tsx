import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Bell, ChevronRight, Activity, Pill, Bot, User, Clock, MapPin, ClipboardList, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { AppDialog } from "@/components/ui/shad_dialog";

const UserDashboard = () => {
  // --- STATE ---
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  // State for Modals
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);

  const handleViewAppointmentDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDialogOpen(true);
  };

  const handleViewPrescriptionDetails = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsPrescriptionDialogOpen(true);
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [apptRes, rxRes] = await Promise.allSettled([
          axios.get("http://localhost:4000/api/appointments/my-appointments", config),
          axios.get("http://localhost:4000/api/prescriptions/patient/me", config)
        ]);

        // --- PROCESS APPOINTMENTS ---
        if (apptRes.status === "fulfilled") {
          const appts = apptRes.value.data.map((apt: any) => ({
            id: apt.id,
            doctorName: `Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`,
            specialty: apt.doctor.specialization,
            date: new Date(apt.appointmentDate).toLocaleDateString(),
            time: new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reason: apt.notes,
            status: apt.status.toLowerCase(),
            patient: {
              name: `${apt.patient.user.firstName} ${apt.patient.user.lastName}`,
              contact: apt.patient.user.phoneNumber,
              age: apt.patient.dateOfBirth ? new Date().getFullYear() - new Date(apt.patient.dateOfBirth).getFullYear() : 'N/A',
              gender: apt.patient.bloodType || 'N/A'
            }
          }));
          setBookedAppointments(appts);

          if (appts.length > 0) setUserName(appts[0].patient.name);
        }

        // --- PROCESS PRESCRIPTIONS (Enhanced Data Mapping) ---
        if (rxRes.status === "fulfilled") {
          const rxs = rxRes.value.data.map((rx: any) => {
            const validUntil = new Date(rx.validUntilDate);
            const isExpired = new Date() > validUntil;

            return {
              id: rx.id,
              uniqueId: rx.prescriptionId || `RX-${rx.id}`, // Fallback ID
              diagnosis: Array.isArray(rx.diagnosis) ? rx.diagnosis.join(", ") : rx.diagnosis,
              date: new Date(rx.date).toLocaleDateString(),
              validUntil: validUntil.toLocaleDateString(),
              isExpired: isExpired,
              doctor: {
                name: `Dr. ${rx.doctor.user.firstName} ${rx.doctor.user.lastName}`,
                specialization: rx.doctor.specialization || "General Physician",
                hospital: rx.doctor.hospitalAffiliation || "Private Clinic"
              },
              prescribedMedications: rx.prescribedMedications.map((m: any) => ({
                medication: m.medication.name,
                dosage: m.dosage,
                frequency: m.frequency,
                // If duration isn't in DB, handle gracefully
                duration: m.duration || "As advised" 
              })),
              additionalNotes: rx.additionalNotes
            };
          });
          setRecentPrescriptions(rxs);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const healthIndicators = [
    { name: "Blood Pressure", value: "120/80", status: "Normal" },
    { name: "Heart Rate", value: "72 bpm", status: "Normal" },
    { name: "Blood Sugar", value: "95 mg/dL", status: "Normal" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {userName}</p>
      </div>

      {/* AI Health Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Health Assistant
          </CardTitle>
          <CardDescription className="text-gray-600">
            Get instant health insights and reduce no-shows with AI-powered assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 ">
            <Button asChild className="bg-blue-700 text-white" >
              <NavLink to={"/user/ai-health"} >
                Analyze Symptoms
              </NavLink>
            </Button>
            <Button asChild variant={"outline"} className="border-none bg-white">
              <NavLink to={"/user/ai-health"}>
                Get Medicine Suggestions
              </NavLink>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health Indicators */}
      <div className="grid gap-4 md:grid-cols-3">
        {healthIndicators.map((indicator, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{indicator.name}</p>
                  <p className="text-2xl font-bold mt-1">{indicator.value}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${indicator.status === "Normal" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {indicator.status}
                </div>
                <Activity className="text-primary h-10 w-10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Booked Appointments */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                My Appointments
              </CardTitle>
              <Button size="sm" asChild className="bg-primary text-white hover:bg-primary/90 rounded-full px-4">
                <NavLink to="/user/appointments/book-new">Book New</NavLink>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading appointments...</p>
              </div>
            ) : bookedAppointments.length > 0 ? (
              <div className="space-y-4">
                {bookedAppointments.map(appt => (
                  <div key={appt.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <h4 className="font-medium">{appt.doctorName}</h4>
                      <p className="text-sm text-gray-500">{appt.specialty}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {appt.date} at {appt.time}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                        appt.status === 'booked' || appt.status === 'upcoming' ? 'bg-blue-100 text-blue-800'
                          : appt.status === 'completed' ? 'bg-green-100 text-green-800'
                            : appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </div>
                      <Button size="sm" variant="outline" className="border-gray-300 border text-gray-700 hover:bg-[#FDE1D3]" onClick={() => handleViewAppointmentDetails(appt)}>
                        Details
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm mb-3">No appointments booked yet</p>
                <Button size="sm" asChild className="rounded-full px-6 bg-primary text-white">
                  <NavLink to="/user/appointments/book-new">Book Your First Appointment</NavLink>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Prescriptions
              </CardTitle>
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-full px-4" asChild>
                <NavLink to="/user/prescriptions">View All</NavLink>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
              </div>
            ) : recentPrescriptions.length > 0 ? (
              <div className="space-y-4">
                {recentPrescriptions.map(rx => (
                  <div key={rx.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <div className="flex items-center">
                        <Pill className="h-4 w-4 mr-1 text-primary" />
                        <h4 className="font-medium">{rx.diagnosis}</h4>
                      </div>
                      <p className="text-sm text-gray-500">
                        {rx.prescribedMedications[0]?.medication}
                        {rx.prescribedMedications.length > 1 && ` + ${rx.prescribedMedications.length - 1} more`}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {rx.date} by {rx.doctor.name}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-gray-300 border text-gray-700 hover:bg-[#FDE1D3]" onClick={() => handleViewPrescriptionDetails(rx)}>
                      Details
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No recent prescriptions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-full px-4">
                Mark All as Read
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-[#E5DEFF]/50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Appointment Reminder</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Don't forget to check your upcoming appointments!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Details Modal */}
      <AppDialog
        open={isAppointmentDialogOpen}
        onClose={setIsAppointmentDialogOpen}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-6 p-2">
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedAppointment.doctorName}</h3>
                <p className="text-sm text-gray-500">{selectedAppointment.specialty}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-base font-medium">{selectedAppointment.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p className="text-base font-medium">{selectedAppointment.time}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedAppointment.status === 'booked' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedAppointment.status.toUpperCase()}
                </div>
              </div>
            </div>

            {selectedAppointment.patient && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Patient Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{selectedAppointment.patient.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contact</p>
                    <p className="font-medium">{selectedAppointment.patient.contact}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Reason for Visit</p>
                <p className="text-base bg-gray-50 p-3 rounded-md border border-gray-100">{selectedAppointment.reason}</p>
              </div>
            </div>
          </div>
        )}
      </AppDialog>

      {/* Prescription Details Modal (ENHANCED) */}
      <AppDialog
        open={isPrescriptionDialogOpen}
        onClose={setIsPrescriptionDialogOpen}
        title="Prescription Details"
      >
        {selectedPrescription && (
          <div className="space-y-6 p-1">
            
            {/* Header with ID and Date */}
            <div className="flex justify-between items-start border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Diagnosis: {selectedPrescription.diagnosis}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded border text-gray-600">
                      ID: {selectedPrescription.uniqueId}
                    </span>
                    {selectedPrescription.isExpired ? (
                       <span className="text-xs bg-red-100 px-2 py-0.5 rounded border border-red-200 text-red-700 flex items-center gap-1">
                         <AlertCircle className="w-3 h-3" /> Expired
                       </span>
                    ) : (
                       <span className="text-xs bg-green-100 px-2 py-0.5 rounded border border-green-200 text-green-700 flex items-center gap-1">
                         <CheckCircle2 className="w-3 h-3" /> Active
                       </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Issued: <span className="font-medium text-gray-800">{selectedPrescription.date}</span></p>
                <p>Valid Until: <span className={`font-medium ${selectedPrescription.isExpired ? "text-red-600" : "text-green-600"}`}>{selectedPrescription.validUntil}</span></p>
              </div>
            </div>

            {/* Doctor & Hospital Info */}
            <div className="bg-blue-50/80 p-4 rounded-lg border border-blue-100 flex items-center gap-4">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-blue-500 uppercase font-semibold">Prescribed By</p>
                <p className="font-bold text-blue-900">{selectedPrescription.doctor.name}</p>
                <p className="text-xs text-blue-700">{selectedPrescription.doctor.specialization}</p>
              </div>
              <div className="text-right">
                 <div className="flex items-center justify-end gap-1 text-blue-800 text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedPrescription.doctor.hospital}
                 </div>
              </div>
            </div>

            {/* Medications List */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-800">
                <Pill className="h-4 w-4 text-primary" />
                Prescribed Medications
              </h4>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {selectedPrescription.prescribedMedications.map((med: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-800 text-base">{med.medication}</span>
                      <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded shadow-sm text-gray-700 font-medium">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {med.frequency}
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {med.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            {selectedPrescription.additionalNotes && (
              <div className="mt-4">
                <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-800">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Doctor's Notes
                </h4>
                <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md text-sm text-gray-700 italic">
                  "{selectedPrescription.additionalNotes}"
                </div>
              </div>
            )}

          </div>
        )}
      </AppDialog>
    </div>
  )
}

export default UserDashboard;