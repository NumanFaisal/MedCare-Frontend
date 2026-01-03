import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Bell, ChevronRight, Activity, Pill, Bot, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { AppDialog } from "@/components/ui/shad_dialog";
import { recentPrescriptions } from "@/services/prescriptionData";


const UserDashboard = () => {
    const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    // Load appointments - Modified to handle local state or API
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // If you don't have the API yet, this will fall to the catch block
                const response = await fetch('/api/appointments');
                if (response.ok) {
                    const data = await response.json();
                    const formattedAppointments = data.appointments.map((apt: any) => ({
                        id: apt.id,
                        doctorName: apt.doctor.name,
                        specialty: apt.doctor.specialization,
                        date: new Date(apt.date).toISOString().split('T')[0],
                        time: new Date(apt.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }),
                        reason: apt.reason,
                        status: apt.status.toLowerCase()
                    }));
                    setBookedAppointments(formattedAppointments);
                }
            } catch (error) {
                console.log('API not found, using sample data');
                // Sample data to keep the UI beautiful
                setBookedAppointments([
                    {
                        id: 1,
                        doctorName: "Dr. Shah Faisal",
                        specialty: "Cardiologist",
                        date: "2025-06-15",
                        time: "10:00 AM",
                        status: "upcoming",
                        reason: "Routine heart checkup",

                        patient: {
                            id: 101,
                            name: "Vishal Kumar",
                            age: 24,
                            gender: "Male",
                            contact: "+91-9876543210"
                        },

                        notes: "Patient reported mild chest discomfort during physical activity. ECG recommended."
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const healthIndicators = [
        { name: "Blood Pressure", value: "120/80", status: "Normal" },
        { name: "Heart Rate", value: "72 bpm", status: "Normal" },
        { name: "Blood Sugar", value: "95 mg/dL", status: "Normal" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Patient DashBoard</h1>
                <p className="text-gray-600 mt-1">Welcome back, john Doe</p>
            </div>

            {/* Ai health */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader className="pb-2">
                    <CardTitle className="text-3xl flex items-center gap-2">
                        <Bot className="h-5 w-5 text-blue-600" />
                        AI Health Assistant
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Get instant health insights and reduce no-shows with AI-powered assitance
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

            {/* Health indicators */}
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
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium mb-2 ${appt.status === 'scheduled' || appt.status === 'upcoming'
                                                ? 'bg-blue-100 text-blue-800'
                                                : appt.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
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
                        {recentPrescriptions.length > 0 ? (
                            <div className="space-y-4">
                                {recentPrescriptions.map(rx => (
                                    <div key={rx.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div>
                                            <div className="flex items-center">
                                                <Pill className="h-4 w-4 mr-1 text-primary" />
                                                <h4 className="font-medium">{rx.diagnosis}</h4>
                                            </div>
                                            <p className="text-sm text-gray-500">{rx.prescribedMedications[0]?.medication} {rx.prescribedMedications.length > 1 && `+ ${rx.prescribedMedications.length - 1} more`}</p>
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
                            <p className="text-gray-500 text-sm">No recent prescriptions</p>
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
                                            You have an appointment with Dr. Shah Faisal tomorrow at 10:00 AM.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg border border-gray-200">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium">New Prescription</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Dr. Numan Faisal has issued a new prescription for you.
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
                        {/* Header Section */}
                        <div className="flex items-center gap-4 border-b pb-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{selectedAppointment.doctorName}</h3>
                                <p className="text-sm text-gray-500">{selectedAppointment.specialty}</p>
                            </div>
                        </div>

                        {/* Appointment Info Grid */}
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
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedAppointment.status === 'scheduled' || selectedAppointment.status === 'upcoming'
                                    ? 'bg-blue-100 text-blue-800'
                                    : selectedAppointment.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                                </div>
                            </div>
                        </div>

                        {/* Patient Details Section */}
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
                                        <p className="text-gray-500">Age / Gender</p>
                                        <p className="font-medium">{selectedAppointment.patient.age} / {selectedAppointment.patient.gender}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500">Contact</p>
                                        <p className="font-medium">{selectedAppointment.patient.contact}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reason & Notes */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Reason for Visit</p>
                                <p className="text-base bg-gray-50 p-3 rounded-md border border-gray-100">{selectedAppointment.reason}</p>
                            </div>

                            {selectedAppointment.notes && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Doctor's Notes</p>
                                    <p className="text-sm bg-yellow-50 p-3 rounded-md border border-yellow-100 text-yellow-800">
                                        {selectedAppointment.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </AppDialog>
            {/* Prescription Details Modal */}
            <AppDialog
                open={isPrescriptionDialogOpen}
                onClose={setIsPrescriptionDialogOpen}
                title="Prescription Details"
            >
                {selectedPrescription && (
                    <div className="space-y-6 p-2">
                        {/* Header Section */}
                        <div className="flex items-center gap-4 border-b pb-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{selectedPrescription.diagnosis}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{selectedPrescription.date}</span>
                                </div>
                            </div>
                        </div>

                        {/* Doctor Info */}
                        <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Prescribed by</p>
                                <p className="font-medium text-blue-900">{selectedPrescription.doctor.name}</p>
                                <p className="text-xs text-blue-700">{selectedPrescription.doctor.specialization}</p>
                            </div>
                        </div>

                        {/* Medications List */}
                        <div>
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Pill className="h-4 w-4 text-primary" />
                                Prescribed Medications
                            </h4>
                            <div className="space-y-3">
                                {selectedPrescription.prescribedMedications.map((med: any, idx: number) => (
                                    <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-800">{med.medication}</span>
                                            <span className="text-xs bg-white border px-2 py-1 rounded-full text-gray-600">{med.dosage}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {med.frequency}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {med.duration}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedPrescription.additionalNotes && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Doctor's Notes</p>
                                <p className="text-sm bg-yellow-50 p-3 rounded-md border border-yellow-100 text-yellow-800">
                                    {selectedPrescription.additionalNotes}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </AppDialog>
        </div >
    )
}

export default UserDashboard
