import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Book, Calendar, ChevronRight, Clock, Heart, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const DocDashboard = () => {
   // Sample data for doctor dashboard
    const upcomingAppointments =[
        { id: 1, patient: "Jhon Doe" , time: "10:00 Am", status: "confirmed", type: "Check-up"},
        { id: 2, patient: "Emily johnson" , time: "11:30 Am", status: "confirmed", type: "Follow-up"},
        { id: 3, patient: "Michael Smith" , time: "2:00 Pm", status: "pending", type: "New Patient"}
    ];

    const recentPatient = [
        { id: 1, name: "Vishal Kumar", lastVisit: "2025-06-01", reason: "Chest pain", status: "Follow-up scheduled"},
        { id: 2, name: "Prince Tiwari", lastVisit: "2025-05-29", reason: "Back pain", status: "No Follow-up needed"},
        { id: 3, name: "Pratik Anand", lastVisit: "2025-05-21", reason: "Prescription renewal", status: "Prescription issued"},
    ];

    return (
        <div>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, Dr. Numan Faisal</p>
                </div>
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
                                <Calendar className="h-5 w-5 text-primary"/>
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
                                    <Button size="sm" variant="ghost" className="border-gray-300 border text-gray-700 hover:bg-[#FDE1D3]">View</Button>
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
                                <Button size="sm" variant="ghost" className="border-gray-300 border text-gray-700 hover:bg-[#FDE1D3]">View Details</Button>
                            </div>
                        ))}

                        <div className="text-center pt-2">
                            <Button variant={"link"} size={"sm"} asChild>
                                <NavLink to={"/patients"}>View All Patients</NavLink>
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
                                <Book className="mb-2 text-white "/>
                                Create Prescription
                            </NavLink>
                        </Button>
                        <Button className="h-auto py-4 flex flex-col" asChild>
                            <NavLink to={"/doctor/patients"} className="text-white">
                                <Users className="mb-2 text-white "/>
                                Add Patient
                            </NavLink>
                        </Button>
                        <Button className="h-auto py-4 flex flex-col" asChild>
                            <NavLink to={"/lab-results"} className="text-white">
                                <BarChart className="mb-2 text-white "/>
                                Lab Results
                            </NavLink>
                        </Button>
                        <Button className="h-auto py-4 flex flex-col " asChild>
                            <NavLink to={"/schedule"} className="text-white">
                                <Calendar className="mb-2 text-white "/>
                                Schedule
                            </NavLink>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DocDashboard;
