import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, FileText, Package, ShoppingBag, Users, Pill, AlertCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// --- TYPES ---
interface DashboardStats {
    totalPrescriptions: number;
    todayPrescriptions: number;
    totalPatients: number;
    totalMedicationsDispensed: number;
}

interface RecentPrescription {
    id: number;
    prescriptionId: string;
    diagnosis: string[];
    date: string;
    validUntilDate: string;
    patient: {
        user: {
            firstName: string;
            lastName: string;
            userUniqueId: string;
        };
    };
    prescribedMedications: Array<{
        dosage: string;
        frequency: string;
        medication: { name: string };
    }>;
}

interface TopMedication {
    name: string;
    count: number;
}

interface DashboardData {
    stats: DashboardStats;
    recentPrescriptions: RecentPrescription[];
    topMedications: TopMedication[];
}

// --- API ---
const fetchDashboardData = async (): Promise<DashboardData> => {
    const response = await api.get("/api/prescriptions/medical/dashboard");
    return response.data;
};

const MedicalDashboard = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['medical-dashboard'],
        queryFn: fetchDashboardData,
        staleTime: 1000 * 60 * 2, // 2 min cache
    });

    const stats = data?.stats;
    const recentPrescriptions = data?.recentPrescriptions || [];
    const topMedications = data?.topMedications || [];

    // Skeleton loader
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-9 w-72 bg-slate-200" />
                    <Skeleton className="h-5 w-48 mt-2 bg-slate-200" />
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="border-none shadow-lg">
                            <CardContent className="p-6">
                                <Skeleton className="h-10 w-20 bg-slate-200" />
                                <Skeleton className="h-4 w-32 mt-2 bg-slate-200" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-60 bg-slate-200 rounded-lg" />
                    <Skeleton className="h-60 bg-slate-200 rounded-lg" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-red-500">
                <AlertCircle className="h-8 w-8" />
                <p>Failed to load dashboard data.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Medical Shop Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of prescriptions and medications</p>
            </div>

            {/* Stats overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Today's Prescriptions</p>
                                <p className="text-3xl font-bold mt-1">{stats?.todayPrescriptions ?? 0}</p>
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
                                <p className="text-3xl font-bold mt-1">{stats?.totalMedicationsDispensed ?? 0}</p>
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
                                <p className="text-sm text-gray-500 font-medium">Total Patients</p>
                                <p className="text-3xl font-bold mt-1">{stats?.totalPatients ?? 0}</p>
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
                                <p className="text-sm text-gray-500 font-medium">Total Prescriptions</p>
                                <p className="text-3xl font-bold mt-1">{stats?.totalPrescriptions ?? 0}</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Prescriptions — REAL DATA */}
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
                            {recentPrescriptions.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">No prescriptions yet</p>
                            ) : (
                                recentPrescriptions.slice(0, 5).map(prescription => {
                                    const isExpired = new Date() > new Date(prescription.validUntilDate);
                                    const patientName = `${prescription.patient.user.firstName} ${prescription.patient.user.lastName}`;
                                    const medications = prescription.prescribedMedications.map(m => `${m.medication.name} ${m.dosage}`);

                                    return (
                                        <div key={prescription.id} className="flex items-center justify-between p-3 border border-gray-100 bg-gray-50/50 rounded-xl">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-800">{patientName}</h4>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                        isExpired 
                                                            ? 'bg-red-100 text-red-700' 
                                                            : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {isExpired ? 'expired' : 'active'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 font-medium">
                                                    ID: {prescription.prescriptionId} • {medications.join(', ')}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(prescription.date).toLocaleDateString()}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Medications — REAL DATA */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Pill className="h-5 w-5 text-primary" />
                                Top Medications
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Most frequently prescribed medications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {topMedications.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">No medication data yet</p>
                            ) : (
                                topMedications.map((medication, index) => (
                                    <div key={index} className="flex items-center justify-between py-2.5 border-b last:border-0 border-gray-100">
                                        <div className="flex items-center">
                                            <div className="w-8 text-center font-bold text-gray-400 text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{medication.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">
                                                    Prescribed {medication.count} times
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-100 text-blue-700">
                                            {medication.count}x
                                        </div>
                                    </div>
                                ))
                            )}
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
