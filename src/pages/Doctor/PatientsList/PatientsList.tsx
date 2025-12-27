import NoPatients from "@/components/Patient/NoPatients";
import PatientCard from "@/components/Patient/PatientCard";
import PatientsFilter from "@/components/Patient/PatientsFilter";
import PatientsHeader from "@/components/Patient/PatientsHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { allPatients, filterPatients } from "@/services/patientData";
import type { PatientType } from "@/types/patient";
import { useState } from "react";

function PatientsList() {
    const [patients, setPatients] = useState<PatientType[]>(allPatients);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
    const [filterGender, setFilterGender] = useState('all');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query)
        const filtered = filterPatients(query, filterGender);
        setPatients(filtered)
    };

    const handleFilterChange = (value: string) => {
        setFilterGender(value);
        const filtered = filterPatients(searchQuery, value);
        setPatients(filtered);
    };

    const toggleExpand = (id: string) => {
        setExpandedPatient(expandedPatient === id ? null : id);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setFilterGender('all');
        setPatients(allPatients);
    };

    return (
        <div className="space-y-6">
            {/* <div>
                <h1 className="text-3xl font-bold text-gray-900">Patient Directory</h1>
                <p className="text-gray-600 mt-1">Manage and view your patient records</p>
            </div> */}

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