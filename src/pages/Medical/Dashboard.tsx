import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, FileText, Package, ShoppingBag, Users } from "lucide-react";
import { NavLink } from "react-router-dom"; // Changed from next/link

const MedicalDashboard = () => {
    // Sample data for medical shop dashboard
    const recentPrescriptions = [
        { id: "P123456", patient: "Vishal Kumar", medications: ["Amoxicillin 500mg", "Ibuprofen 400mg"], date: "2025-06-03", status: "pending"},
        { id: "P123457", patient: "Prince Tiwari", medications: ["Lisinopril 10mg"], date: "2025-06-02", status: "completed"},
        { id: "P123458", patient: "Pratik Anand", medications: ["Metformin 1000mg", "Atorvastatin 20mg"], date: "2025-06-01", status: "completed"},
    ];

    const topMedications = [
        { name: "Amoxicillin", dosage: "500mg", count: 42, inStock: true },
        { name: "Lisinopril", dosage: "10mg", count: 38, inStock: true },
        { name: "Atorvastatin", dosage: "20mg", count: 35, inStock: true },
        { name: "Metformin", dosage: "1000mg", count: 29, inStock: false },
        { name: "Omeprazole", dosage: "20mg", count: 27, inStock: true }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Medical Shop Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, City Pharmacy</p>
            </div>

            {/* Stats overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Todays Prescription</p>
                                <p className="text-3xl font-bold mt-1">5</p>
                            </div>
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Medicines Dispensed</p>
                                <p className="text-3xl font-bold mt-1">28</p>
                            </div>
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Customers</p>
                                <p className="text-3xl font-bold mt-1">162</p>
                            </div>
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Low Stock Items</p>
                                <p className="text-3xl font-bold mt-1 text-red-600">12</p>
                            </div>
                            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-red-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Prescriptions */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Recent Prescriptions
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-white border-gray-300 border hover:bg-primary/70  bg-primary">
                                <NavLink to="/medical/fetch-prescriptions">
                                    View All
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </NavLink>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentPrescriptions.map(prescription => (
                                <div key={prescription.id} className="flex items-center justify-between p-3 border border-gray-100 bg-gray-50/50 rounded-xl">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-800">{prescription.patient}</h4>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                prescription.status === 'pending' 
                                                    ? 'bg-amber-100 text-amber-700' 
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {prescription.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 font-medium">
                                            ID: {prescription.id} • {prescription.medications.join(', ')}
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="border-gray-300 border text-gray-700 hover:bg-[#FDE1D3]">Details</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Medications */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Top Medications
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="text-white border-gray-300 border hover:bg-primary/70  bg-primary">
                                View Inventory
                            </Button>
                        </div>
                        <CardDescription>
                            Most frequently dispensed this month
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {topMedications.map((medication, index) => (
                                <div key={index} className="flex items-center justify-between py-2.5 border-b last:border-0 border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-8 text-center font-bold text-gray-400 text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{medication.name} {medication.dosage}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                Dispensed {medication.count} times
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                                        medication.inStock 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {medication.inStock ? 'In Stock' : 'Low Stock'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button className="h-auto py-6 flex flex-col gap-2 bg-primary text-white hover:bg-primary/90" asChild>
                            <NavLink to="/medical/fetch-prescriptions">
                                <FileText className="h-6 w-6" />
                                Fetch Prescription
                            </NavLink>
                        </Button>
                        <Button className="h-auto py-6 flex flex-col gap-2 bg-primary text-white hover:bg-primary/90">
                            <ShoppingBag className="h-6 w-6" />
                            Manage Inventory
                        </Button>
                        <Button className="h-auto py-6 flex flex-col gap-2 bg-primary text-white hover:bg-primary/90">
                            <Package className="h-6 w-6" />
                            Order Supplies
                        </Button>
                        <Button className="h-auto py-6 flex flex-col gap-2 bg-primary text-white hover:bg-primary/90">
                            <Users className="h-6 w-6" />
                            Customer Records
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default MedicalDashboard
