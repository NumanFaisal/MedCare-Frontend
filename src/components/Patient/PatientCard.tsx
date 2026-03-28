import { ChevronDown, ChevronUp, FileText, Mail, Phone, X, Pill } from "lucide-react";
import { Button } from "../ui/button";
import React from "react";
import api from "@/lib/api";
import type { PatientType } from "@/types/patient";


interface PatientCardProps {
    patient: PatientType;
    expandedPatient: string | null;
    toggleExpand: (id: string) => void;
}

interface PrescriptionDetail {
    id: number;
    prescriptionId: string;
    diagnosis: string[];
    date: string;
    validUntilDate: string;
    additionalNotes: string | null;
    prescribedMedications: Array<{
        id: number;
        dosage: string;
        frequency: string;
        medication: { name: string };
    }>;
}

function PatientCard({ patient, expandedPatient, toggleExpand }: PatientCardProps) {
    const [showPrescriptions, setShowPrescriptions] = React.useState(false);
    const [prescriptions, setPrescriptions] = React.useState<PrescriptionDetail[]>([]);
    const [loadingRx, setLoadingRx] = React.useState(false);

    const handleViewPrescriptions = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!patient.userUniqueId) return;
        
        setLoadingRx(true);
        setShowPrescriptions(true);
        try {
            const response = await api.get(`/api/prescriptions/history/${patient.userUniqueId}`);
            const rxData = response.data.data || response.data;
            setPrescriptions(Array.isArray(rxData) ? rxData : []);
        } catch {
            setPrescriptions([]);
        } finally {
            setLoadingRx(false);
        }
    };

    // Avoid direct date formatting in JSX for SSR/CSR consistency
    const [lastVisit, setLastVisit] = React.useState("");

    React.useEffect(() => {
        setLastVisit(new Date(patient.lastVisit).toLocaleDateString());
    }, [patient.lastVisit]);

    return (
        <>
        <div key={patient.id} className="border-1 border-gray-300 rounded-lg overflow-hidden">
            <div
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleExpand(patient.id)}
            >
                <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-primary bg-primary/50 font-medium">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="font-medium flex items-center gap-2">
                            {patient.name}
                            <span className="text-xs bg-blue-50 text-blue-700 font-mono font-bold px-2 py-0.5 rounded border border-blue-100">
                                {patient.userUniqueId}
                            </span>
                        </h3> 
                        <p className="text-sm text-gray-500">{patient.condition}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">Last Visit</p>
                        <p className="text-xs text-gray-500">
                            {lastVisit}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="hidden sm:flex items-center gap-1 bg-primary hover:bg-primary/50 text-white"
                            onClick={handleViewPrescriptions}
                        >
                            <FileText className="h-4 w-4" />
                            <span>Prescription</span>
                        </Button>
                        {expandedPatient === patient.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {expandedPatient === patient.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-300">
                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Age</dt>
                            <dd className="mt-1 text-sm text-gray-900">{patient.age} years</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Gender</dt>
                            <dd className="mt-1 text-sm text-gray-900">{patient.gender}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Next Appointment</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {patient.nextAppointment
                                    ? new Date(patient.nextAppointment).toLocaleDateString()
                                    : 'Not scheduled'}
                            </dd>
                        </div>
                        <div className="sm:col-span-3 border-t border-gray-300 pt-3 mt-2">
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1 border border-gray-300 hover:bg-[#FDE1D3]  text-gray-600"
                                    onClick={handleViewPrescriptions}
                                >
                                    <FileText className="h-4 w-4" />
                                    View Prescriptions
                                </Button>
                                <Button size="sm" variant="outline" className="flex items-center border border-gray-300 hover:bg-[#FDE1D3]  text-gray-600 gap-1">
                                    <Phone className="h-4 w-4" />
                                    {patient.phone}
                                </Button>
                                <Button size="sm" variant="outline" className="flex items-center border border-gray-300 hover:bg-[#FDE1D3]  text-gray-600 gap-1">
                                    <Mail className="h-4 w-4" />
                                    {patient.email}
                                </Button>
                            </div>
                        </div>
                    </dl>
                </div>
            )}
        </div>

        {/* Prescription Details Popup */}
        {showPrescriptions && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end" onClick={() => setShowPrescriptions(false)}>
                <div 
                    className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Prescriptions</h2>
                            <p className="text-sm text-gray-500">{patient.name} • <span className="font-mono font-bold text-blue-700">{patient.userUniqueId}</span></p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowPrescriptions(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="p-4 space-y-4">
                        {loadingRx ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                            </div>
                        ) : prescriptions.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p className="font-medium">No prescriptions found</p>
                            </div>
                        ) : (
                            prescriptions.map((rx) => (
                                <div key={rx.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b">
                                        <div>
                                            <span className="font-mono font-bold text-sm text-gray-800">{rx.prescriptionId}</span>
                                            <span className="text-xs text-gray-400 ml-2">{new Date(rx.date).toLocaleDateString()}</span>
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                            new Date() > new Date(rx.validUntilDate) 
                                                ? 'bg-red-100 text-red-700' 
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {new Date() > new Date(rx.validUntilDate) ? 'Expired' : 'Active'}
                                        </span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Diagnosis</p>
                                            <p className="text-sm text-gray-900">{Array.isArray(rx.diagnosis) ? rx.diagnosis.join(', ') : rx.diagnosis}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Medications</p>
                                            <div className="space-y-1">
                                                {rx.prescribedMedications.map((med) => (
                                                    <div key={med.id} className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-1.5 rounded-lg">
                                                        <Pill className="h-3 w-3 text-blue-600" />
                                                        <span className="font-medium text-gray-800">{med.medication.name}</span>
                                                        <span className="text-gray-500">• {med.dosage} • {med.frequency}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {rx.additionalNotes && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Notes</p>
                                                <p className="text-sm text-gray-600 italic">{rx.additionalNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default PatientCard;