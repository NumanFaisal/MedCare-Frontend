import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Book, Calendar, ChevronRight, Clock, Heart, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AppDialog } from "@/components/ui/shad_dialog";
import { useState } from "react";

const DocDashboard = () => {
    // Sample data for doctor dashboard
    const upcomingAppointments = [
        { id: 1, patient: "Jhon Doe", time: "10:00 Am", status: "confirmed", type: "Check-up" },
        { id: 2, patient: "Emily johnson", time: "11:30 Am", status: "confirmed", type: "Follow-up" },
        { id: 3, patient: "Michael Smith", time: "2:00 Pm", status: "pending", type: "New Patient" }
    ];

    const recentPatient = [
        {
            id: 1,
            name: "Vishal Kumar",
            age: 34,
            gender: "Male",
            bloodGroup: "O+",
            bloodPressure: "130/85",
            heartRate: 78,
            phone: "9876543210",
            lastVisit: "2025-06-01",
            reason: "Chest pain",
            status: "Follow-up scheduled",
        },
        {
            id: 2,
            name: "Prince Tiwari",
            age: 28,
            gender: "Male",
            bloodGroup: "A+",
            bloodPressure: "120/80",
            heartRate: 72,
            phone: "9123456789",
            lastVisit: "2025-05-29",
            reason: "Back pain",
            status: "No Follow-up needed",
        },
        {
            id: 3,
            name: "Pratik Anand",
            age: 41,
            gender: "Male",
            bloodGroup: "B+",
            bloodPressure: "140/90",
            heartRate: 82,
            phone: "9012345678",
            lastVisit: "2025-05-21",
            reason: "Prescription renewal",
            status: "Prescription issued",
        },
    ]


    const [selectedPatient, setSelectedPatient] = useState<typeof recentPatient[0] | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [selectedSchedule, setSelectedSchedule] = useState<typeof upcomingAppointments[0] | null>(null);
    const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

    const handleViewDetails = (patient: typeof recentPatient[0]) => {
        setSelectedPatient(patient);
        setIsDialogOpen(true);
    };

    const handleViewScheduleDetails = (schedule: typeof upcomingAppointments[0]) => {
        setSelectedSchedule(schedule);
        setIsScheduleDialogOpen(true);
    };

    return (
        <div>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, Dr. Numan Faisal</p>
                </div>



                {/* Stats overview */}
            </div>


            {/* Stats overview */}
            <div className="grid gap-4 md:grid-cols-4 mt-7">
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Todays Patients</p>
                                <p className="text-4xl font-bold mt-1">8</p>
                            </div>
                            <div className="h-12 w-12 bg-[#E5DEFF] rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending Reports</p>
                                <p className="text-4xl font-bold mt-1">3</p>
                            </div>
                            <div className="h-12 w-12 bg-[#E5DEFF] rounded-full flex items-center       justify-center">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Patients</p>
                                <p className="text-4xl font-bold mt-1">248</p>
                            </div>
                            <div className="h-12 w-12 bg-[#E5DEFF] rounded-full flex items-center       justify-center">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Prescriptions</p>
                                <p className="text-4xl font-bold mt-1">173</p>
                            </div>
                            <div className="h-12 w-12 bg-[#E5DEFF] rounded-full flex items-center       justify-center">
                                <Heart className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-10">
                {/* Today's Schedule */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Today Schedule
                            </CardTitle>
                            <Button variant={"outline"} size={"sm"} asChild className=" border text-gray-700 hover:bg-[#FDE1D3] px-6 py-4 rounded-4xl">
                                <NavLink to={"/calender"}>Full Calender</NavLink>
                            </Button>
                        </div>
                        <CardDescription>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingAppointments.map(appointment => (
                                <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                                    <div className="flex items-center">
                                        <div className={`h-10 w-1 rounded-full mr-3 ${appointment.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-400'}`} />
                                        <div>
                                            <p className="font-medium">{appointment.time}</p>
                                            <div className="flex items-center">
                                                <p className="text-sm text-gray-500">{appointment.patient}</p>
                                                <span className="mx-2 text-gray-300">•</span>
                                                <p className="text-sm text-gray-500">{appointment.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="border-gray-300 border text-gray-700 hover:bg-[#FDE1D3]"
                                        onClick={() => handleViewScheduleDetails(appointment)}
                                    >
                                        View
                                    </Button>
                                </div>
                            ))}

                            <div className="text-center pt-2">
                                <Button variant={"link"} size={"sm"} asChild>
                                    <NavLink to={"/appointments"}>View All Appointments</NavLink>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Patient */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="pd-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Recent Patients
                            </CardTitle>
                            <Button className="text-gray-700 hover:bg-[#FDE1D3] border-none shadow-sm" variant={"ghost"} size={"sm"} asChild>
                                <NavLink to={"/patients"}>
                                    View All
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </NavLink>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentPatient.map(patient => (
                            <div key={patient.id} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                                <div>
                                    <p className="font-medium">{patient.name}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <p className="text-sm">{patient.reason}</p>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <p className="text-xs">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="border-gray-300 border text-gray-700 hover:bg-[#FDE1D3]"
                                    onClick={() => handleViewDetails(patient)}
                                >
                                    View Details
                                </Button>
                            </div>
                        ))}

                        <div className="text-center pt-2">
                            <Button variant={"link"} size={"sm"} asChild>
                                <NavLink to={"/doctor/patients"}>View All Patients</NavLink>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions  */}
            <Card className="mt-7 border-none shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button className="h-auto py-4 flex flex-col " asChild>
                            <NavLink to={"/doctor/create-prescription"} className="text-white">
                                <Book className="mb-2 text-white " />
                                Create Prescription
                            </NavLink>
                        </Button>
                        <Button className="h-auto py-4 flex flex-col" asChild>
                            <NavLink to={"/doctor/patients"} className="text-white">
                                <Users className="mb-2 text-white " />
                                Add Patient
                            </NavLink>
                        </Button>
                        <Button className="h-auto py-4 flex flex-col" asChild>
                            <NavLink to={"/lab-results"} className="text-white">
                                <BarChart className="mb-2 text-white " />
                                Lab Results
                            </NavLink>
                        </Button>
                        <Button className="h-auto py-4 flex flex-col " asChild>
                            <NavLink to={"/schedule"} className="text-white">
                                <Calendar className="mb-2 text-white " />
                                Schedule
                            </NavLink>
                        </Button>
                    </div>
                </CardContent>
            </Card>



            {/* Patient Details Dialog */}
            <AppDialog
                open={isDialogOpen}
                onClose={setIsDialogOpen}
                title="Patient Details"
            >
                {selectedPatient && (
                    <div className="space-y-6 p-2">
                        <div className="flex items-center gap-4 border-b pb-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                                <p className="text-sm text-gray-500">Patient ID: #{selectedPatient.id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Age</p>
                                <p className="text-base font-medium">{selectedPatient.age} Years</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Gender</p>
                                <p className="text-base font-medium">{selectedPatient.gender}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Blood Group</p>
                                <p className="text-base font-medium">{selectedPatient.bloodGroup}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <p className="text-base font-medium">{selectedPatient.phone}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Blood Pressure</p>
                                <p className="text-base font-medium">{selectedPatient.bloodPressure}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Heart Rate</p>
                                <p className="text-base font-medium">{selectedPatient.heartRate} bpm</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedPatient.status.includes('Follow-up') ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {selectedPatient.status}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Last Visit</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <p className="text-base">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <p className="text-sm font-medium text-gray-500">Reason for Visit</p>
                                <p className="text-base bg-gray-50 p-3 rounded-md border border-gray-100">{selectedPatient.reason}</p>
                            </div>
                        </div>
                    </div>
                )}
            </AppDialog>

            {/* Schedule Details Dialog */}
            <AppDialog
                open={isScheduleDialogOpen}
                onClose={setIsScheduleDialogOpen}
                title="Appointment Details"
            >
                {selectedSchedule && (
                    <div className="space-y-6 p-2">
                        <div className="flex items-center gap-4 border-b pb-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{selectedSchedule.patient}</h3>
                                <p className="text-sm text-gray-500">{selectedSchedule.type}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Time</p>
                                <p className="text-base font-medium">{selectedSchedule.time}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedSchedule.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {selectedSchedule.status.charAt(0).toUpperCase() + selectedSchedule.status.slice(1)}
                                </div>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <p className="text-sm font-medium text-gray-500">Type</p>
                                <p className="text-base font-medium">{selectedSchedule.type}</p>
                            </div>
                        </div>
                    </div>
                )}
            </AppDialog>
        </div>
    )
}

export default DocDashboard;
