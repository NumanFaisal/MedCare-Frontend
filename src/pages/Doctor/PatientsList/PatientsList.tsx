import NoPatients from "@/components/Patient/NoPatients";
import PatientCard from "@/components/Patient/PatientCard";
import PatientsFilter from "@/components/Patient/PatientsFilter";
import PatientsHeader from "@/components/Patient/PatientsHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { PatientType } from "@/types/patient";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

function PatientsList() {
    // Store the full list from API
    const [allPatients, setAllPatients] = useState<PatientType[]>([]);
    // Store the filtered list for display
    const [patients, setPatients] = useState<PatientType[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
    const [filterGender, setFilterGender] = useState('all');

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:4000/api/users/doctor/my-patients", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Map Backend Data to Frontend PatientType
                // Adjust fields based on your actual API response structure
                const formattedPatients: PatientType[] = response.data.map((p: any) => {
                    // Calculate Age
                    const dob = new Date(p.dateOfBirth);
                    const age = p.dateOfBirth 
                        ? new Date().getFullYear() - dob.getFullYear() 
                        : "N/A";

                    return {
                        id: p.id.toString(),
                        name: `${p.user.firstName} ${p.user.lastName}`,
                        age: age,
                        gender: p.gender || p.user.gender || "Unknown", 
                        phone: p.user.phoneNumber || "N/A",
                        email: p.user.email || "N/A",
                        bloodGroup: p.bloodType || "N/A",
                        lastVisit: p.lastVisit || new Date().toISOString(), // Mock if not in API
                        status: "Active", // You can derive this from data if available
                        address: p.streetAddress || "No address provided"
                    };
                });

                setAllPatients(formattedPatients);
                setPatients(formattedPatients);
            } catch (error) {
                console.error("Error fetching patients:", error);
                toast.error("Failed to load patient records");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    // --- 2. FILTER LOGIC (Runs whenever Search, Filter, or Data changes) ---
    useEffect(() => {
        let result = allPatients;

        // Apply Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.email.toLowerCase().includes(query) ||
                p.phone.includes(query)
            );
        }

        // Apply Gender Filter
        if (filterGender !== 'all') {
            result = result.filter(p => p.gender.toLowerCase() === filterGender.toLowerCase());
        }

        setPatients(result);
    }, [searchQuery, filterGender, allPatients]);


    // --- HANDLERS ---
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (value: string) => {
        setFilterGender(value);
    };

    const toggleExpand = (id: string) => {
        setExpandedPatient(expandedPatient === id ? null : id);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setFilterGender('all');
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PatientsHeader 
                searchQuery={searchQuery}
                handleSearch={handleSearch}
            />

            <PatientsFilter
                filterGender={filterGender}
                handleFilterChange={handleFilterChange}
                patientCount={patients.length}
            />

            <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                        Patient Records
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {patients.length > 0 ? (
                            patients.map(patient => (
                                <PatientCard
                                    key={patient.id}
                                    patient={patient}
                                    expandedPatient={expandedPatient}
                                    toggleExpand={toggleExpand}
                                />
                            ))
                        ) : (
                            <NoPatients resetFilters={resetFilters} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PatientsList;