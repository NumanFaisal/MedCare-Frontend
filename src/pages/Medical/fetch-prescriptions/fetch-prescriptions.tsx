import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle, FileText, Package, Search, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

// --- TYPES ---
// Type matching your UI structure
interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number | string;
}

interface PrescriptionData {
  id: string;
  patientName: string;
  patientId: string;
  doctor: string;
  date: string;
  medications: Medication[];
  diagnosis: string;
  notes: string;
}

// --- API FUNCTION ---
const searchPrescriptions = async ({ patientId, prescriptionId }: { patientId: string, prescriptionId: string }) => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  let response;
  let data;

  // Scenario A: Search by Prescription ID (Single View)
  if (prescriptionId) {
    response = await axios.get(`http://localhost:4000/api/prescriptions/view/${prescriptionId}`, { headers });
    data = response.data;
  } 
  // Scenario B: Search by Patient ID (History)
  else if (patientId) {
    response = await axios.get(`http://localhost:4000/api/prescriptions/history/${patientId}`, { headers });
    // If history returns an array, we take the latest one for this UI view
    // (Since the current UI only supports showing one detailed card)
    if (Array.isArray(response.data) && response.data.length > 0) {
      data = response.data[0]; 
      toast.info("Patient found", { description: "Showing most recent prescription." });
    } else {
      throw new Error("No prescriptions found for this patient.");
    }
  } else {
    throw new Error("Invalid search parameters");
  }

  if (!data) throw new Error("Prescription not found");

  // --- DATA TRANSFORMATION ---
  // Map backend fields to UI fields
  return {
    id: data.prescriptionId || String(data.id),
    patientName: data.patient?.user ? `${data.patient.user.firstName} ${data.patient.user.lastName}` : "Unknown",
    patientId: data.patient?.user?.userUniqueId || patientId || "N/A",
    doctor: data.doctor?.user ? `Dr. ${data.doctor.user.firstName} ${data.doctor.user.lastName}` : "Unknown Doctor",
    date: data.date || data.createdAt,
    medications: (data.prescribedMedications || []).map((med: any) => ({
      name: med.medication?.name || "Unknown Med",
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
      quantity: med.quantity || "N/A" // Assuming backend might send quantity, else placeholder
    })),
    diagnosis: Array.isArray(data.diagnosis) ? data.diagnosis.join(", ") : (data.diagnosis || "N/A"),
    notes: data.additionalNotes || "No notes provided."
  } as PrescriptionData;
};

function FetchPrescriptions() {
  const [patientId, setPatientId] = useState('');
  const [prescriptionId, setPrescriptionId] = useState('');

  // --- REACT QUERY MUTATION ---
  const mutation = useMutation({
    mutationFn: searchPrescriptions,
    onSuccess: () => {
      toast.success("Prescription Found", {
        description: "Successfully retrieved details",
      });
    },
    onError: (error: any) => {
      console.error("Search error:", error);
      toast.error("Not Found", {
        description: error.message || "No matching prescription found",
      });
    }
  });

  const handleFetchPrescription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patientId && !prescriptionId) {
      toast.error("Error", {
        description: "Please enter either a Patient ID or Prescription ID",
      });
      return;
    }

    // Trigger the search
    mutation.mutate({ patientId, prescriptionId });
  };

  const handleDispenseMedication = () => {
    toast.success("Prescription Fulfilled", {
      description: "Medications have been marked as dispensed",
    });
    // Add specific API call for dispensing here if needed later
  };

  const prescription = mutation.data;
  const isLoading = mutation.isPending;

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fetch Prescriptions</h1>
          <p className="text-gray-600 mt-1">Look up patient prescriptions by ID</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search for Prescription</CardTitle>
            <CardDescription>
              Enter a patient ID or prescription ID to find their active prescriptions
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleFetchPrescription}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="patientId"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10 pl-9"
                      placeholder="Enter patient ID..."
                      value={patientId}
                      onChange={(e) => {
                        setPatientId(e.target.value);
                        if (e.target.value) setPrescriptionId(""); // Clear other input for clarity
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Example: PT78901</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prescriptionId">Prescription ID</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="prescriptionId"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10 pl-9"
                      placeholder="Enter prescription ID..."
                      value={prescriptionId}
                      onChange={(e) => {
                        setPrescriptionId(e.target.value);
                        if (e.target.value) setPatientId(""); // Clear other input
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Example: P123456</p>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <p className="text-sm text-primary/80">
                  <span className="font-medium">Note:</span> You need either a Patient ID or Prescription ID to fetch prescription details.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="border border-primary hover:bg-primary/90 bg-primary text-white min-w-[140px]">
                {isLoading ? (
                  <>Searching...</>
                ) : (
                  <>Find Prescription</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* LOADING SKELETON */}
        {isLoading && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48 bg-slate-200" />
                <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />
              </div>
              <Skeleton className="h-4 w-32 mt-2 bg-slate-200" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-slate-200" />
                  <Skeleton className="h-20 w-full bg-slate-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-slate-200" />
                  <Skeleton className="h-20 w-full bg-slate-200 rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-slate-200" />
                <Skeleton className="h-32 w-full bg-slate-200 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ERROR STATE */}
        {mutation.isError && !isLoading && (
          <div className="text-center py-8 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-red-900">No Prescription Found</h3>
            <p className="text-red-600">We couldn't find any records matching that ID.</p>
          </div>
        )}

        {/* RESULT CARD */}
        {prescription && !isLoading && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Prescription Details</CardTitle>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </div>
              </div>
              <CardDescription>
                Prescription ID: {prescription.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Patient Information</h3>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                    <p className="font-medium text-lg">{prescription.patientName}</p>
                    <p className="text-sm text-gray-500">Patient ID: {prescription.patientId}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Prescription Information</h3>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                    <p className="font-medium">{prescription.doctor}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(prescription.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 font-medium text-primary">Diagnosis: {prescription.diagnosis}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-1">Medications</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {prescription.medications.map((med, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="px-4 py-3 text-sm font-medium">{med.name}</td>
                          <td className="px-4 py-3 text-sm">{med.dosage}</td>
                          <td className="px-4 py-3 text-sm">{med.frequency}</td>
                          <td className="px-4 py-3 text-sm">{med.duration}</td>
                          <td className="px-4 py-3 text-sm">{med.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {prescription.notes && (
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <h3 className="font-medium mb-1 text-yellow-800 text-sm">Notes</h3>
                  <p className="text-sm text-yellow-700">{prescription.notes}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 items-center bg-gray-50/50 pt-6">
              <div className="flex items-center text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                <Package className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">All medications in stock</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  Print Details
                </Button>
                <Button onClick={handleDispenseMedication} className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white">
                  <CheckCircle className="h-4 w-4" />
                  Mark as Dispensed
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

export default FetchPrescriptions;