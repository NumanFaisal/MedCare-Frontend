import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

import NoPatients from "@/components/Patient/NoPatients";
import PatientCard from "@/components/Patient/PatientCard";
import PatientsFilter from "@/components/Patient/PatientsFilter";
import PatientsHeader from "@/components/Patient/PatientsHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PatientType } from "@/types/patient";

// --- API FETCH FUNCTION ---
const fetchPatients = async (): Promise<PatientType[]> => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:4000/api/users/doctor/my-patients", {
    headers: { Authorization: `Bearer ${token}` }
  });

  // Map Backend Data to Frontend PatientType
  return response.data.map((p: any) => {
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
      lastVisit: p.lastVisit || new Date().toISOString(),
      status: "Active",
      address: p.streetAddress || "No address provided"
    };
  });
};

function PatientsList() {
  // Local State
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState('all');

  // --- REACT QUERY ---
  const { 
    data: allPatients = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['my-patients'],
    queryFn: fetchPatients,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // --- DERIVED STATE (FILTERING) ---
  const filteredPatients = allPatients.filter(p => {
    const query = searchQuery.toLowerCase();
    
    // Apply Search
    const matchesSearch = 
      p.name.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.phone.includes(query);

    // Apply Filter
    const matchesGender = filterGender === 'all' || p.gender.toLowerCase() === filterGender.toLowerCase();

    return matchesSearch && matchesGender;
  });

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

  // --- LOADING STATE (SKELETON) ---
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Skeleton className="h-10 w-full sm:w-1/3 bg-slate-200" />
          <Skeleton className="h-10 w-32 bg-slate-200" />
        </div>

        {/* Filter Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 bg-slate-200" />
          <Skeleton className="h-10 w-24 bg-slate-200" />
          <Skeleton className="h-10 w-24 bg-slate-200" />
        </div>

        {/* Card List Skeleton */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40 bg-slate-200" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48 bg-slate-200" />
                      <Skeleton className="h-3 w-32 bg-slate-200" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24 bg-slate-200" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-red-500">
        <AlertCircle className="h-8 w-8" />
        <p>Failed to load patient records.</p>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="space-y-6">
      <PatientsHeader
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />

      <PatientsFilter
        filterGender={filterGender}
        handleFilterChange={handleFilterChange}
        patientCount={filteredPatients.length}
      />

      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            Patient Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
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