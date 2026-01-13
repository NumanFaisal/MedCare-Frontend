import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import axios from "axios";

// Types
interface PatientOption {
  id: number;
  name: string;
  userUniqueId: string;
  appointmentId: number;

}

const CreatePrescription = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingPatients, setFetchingPatients] = useState(true);
  
  // Form State
  const [patientsList, setPatientsList] = useState<PatientOption[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);

  // --- 1. FETCH PATIENTS ---
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        console.log("Fetching patient list...");
        const token = localStorage.getItem("token");
        
        // Fetch Appointments to find unique patients
        const response = await axios.get("http://localhost:4000/api/appointments/doctor/my-appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const appointments = response.data.appointments || [];
        console.log("Appointments found:", appointments.length);
        
        const uniquePatientsMap = new Map();
        
        appointments.forEach((appt: any) => {
          if (appt.patient && appt.patient.id) {
            // We overwrite so we always get the LATEST appointment for this patient
            // (Assuming backend sends them sorted, or we just take the one available)
            if (!uniquePatientsMap.has(appt.patient.id)) {
              uniquePatientsMap.set(appt.patient.id, {
                id: appt.patient.id,
                name: appt.patient.user ? `${appt.patient.user.firstName} ${appt.patient.user.lastName}` : "Unknown Patient",
                userUniqueId: appt.patient.user?.userUniqueId || `P-${appt.patient.id}`,
                appointmentId: appt.id // 👈 Capture the Appointment ID
              });
            }
          }
        });

        const list = Array.from(uniquePatientsMap.values());
        console.log("Unique Patients extracted:", list);
        setPatientsList(list);

      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patient list.");
      } finally {
        setFetchingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  const addMedicationField = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedicationField = (index: number) => {
    const updateMedications = [...medications];
    updateMedications.splice(index, 1);
    setMedications(updateMedications);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setMedications(updatedMedications);
  };

  // --- 2. SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 1. Find the selected patient object to get the 'userUniqueId'
    const selectedPatient = patientsList.find(p => String(p.id) === selectedPatientId);

    if (!selectedPatient) {
      toast.error("Please select a valid patient");
      return;
    }

    // 2. Validate Medications
    const validMedications = medications.filter(m => m.name.trim() !== "");
    if (validMedications.length === 0) {
      toast.error("Please add at least one medication");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // 3. Get Date Values from the DOM inputs directly
      const dateInput = (document.getElementById('date') as HTMLInputElement).value; 
      const validUntilInput = (document.getElementById('validity') as HTMLInputElement).value;

      if (!dateInput || !validUntilInput) {
        throw new Error("Date and Valid Until Date are required");
      }

      // 4. Construct Payload matching 'createPrescriptionSchema'
      const payload = {
        patientUserUniqueId: selectedPatient.userUniqueId, // Backend expects String ID
        diagnosis: [diagnosis], // Backend expects Array
        additionalNotes: notes, // Backend expects 'additionalNotes'
        date: new Date(dateInput).toISOString(), // Backend expects ISO Date
        validUntilDate: new Date(validUntilInput).toISOString(), // Backend expects ISO Date
        medications: validMedications
      };

      console.log("Sending Corrected Payload:", payload);

      await axios.post("http://localhost:4000/api/prescriptions/", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Prescription Created Successfully!");
      navigate('/doctor'); 

    } catch (error: any) {
      console.error("Full Error:", error);
      // Show specific validation error if available
      const serverMsg = error.response?.data?.errors?.[0]?.message || 
                        error.response?.data?.message || 
                        error.message ||
                        "Failed to create prescription";
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Prescription</h1>
          <p className="text-gray-600 mt-1">Write a new prescription for your patient</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Patient & Diagnosis Section */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Patient Details</CardTitle>
                <CardDescription className="text-gray-600">Select patient and add diagnosis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* --- PATIENT SELECT DROPDOWN --- */}
                <div className="space-y-2">
                  <Label htmlFor="patient">Select Patient</Label>
                  
                  <Select 
                    value={selectedPatientId} 
                    onValueChange={setSelectedPatientId}
                    disabled={fetchingPatients || patientsList.length === 0} // Disable if empty
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        fetchingPatients 
                          ? "Loading patients..." 
                          : patientsList.length === 0 
                            ? "No patients found from appointments" 
                            : "Select a patient"
                      } />
                    </SelectTrigger>
                    
                    <SelectContent className="bg-white border rounded-lg border-gray-100">
                      {patientsList.length > 0 ? (
                        patientsList.map(patient => (
                          <SelectItem className="hover:bg-[#FDE1D3] cursor-pointer" key={patient.id} value={String(patient.id)}>
                            {patient.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500 text-center">No patients found</div>
                      )}
                    </SelectContent>
                  </Select>
                  
                  {patientsList.length === 0 && !fetchingPatients && (
                    <p className="text-xs text-red-500">
                      * You can only prescribe to patients who have booked an appointment with you.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="patientId" 
                    value={selectedPatientId ? `ID: ${selectedPatientId}` : ''} 
                    readOnly 
                    placeholder="Select a patient above" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="diagnosis" 
                    value={diagnosis} 
                    onChange={(e) => setDiagnosis(e.target.value)} 
                    placeholder="Enter diagnosis details" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Any additional information" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Prescription Meta Data */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Prescription Details</CardTitle>
                <CardDescription className="text-gray-600">Date and reference information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="date" 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]} 
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prescriptionId">Prescription ID</Label>
                  <Input 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="prescriptionId" 
                    defaultValue={`RX-${Date.now().toString().slice(-8)}`} 
                    readOnly 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validity">Valid Until</Label>
                  <Input 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="validity" 
                    type="date" 
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medications Section */}
          <Card className="border-none shadow-lg mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Medications</CardTitle>
                  <CardDescription className="text-gray-600">Add medications to this prescription</CardDescription>
                </div>
                <Button className="border border-primary bg-primary hover:bg-primary/90 text-white" type="button" onClick={addMedicationField}>Add Medication</Button>
              </div>
            </CardHeader>
            <CardContent>
              {medications.map((medication, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg mb-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-xl">Medication #{index + 1}</h3>
                    {medications.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeMedicationField(index)} className="text-gray-600 border border-gray-200 hover:bg-[#FDE1D3] ">Remove</Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Medication Name</Label>
                      <Input 
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                        value={medication.name} 
                        onChange={(e) => updateMedication(index, 'name', e.target.value)} 
                        placeholder="e.g. Amoxicillin" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Input 
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                        value={medication.dosage} 
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)} 
                        placeholder="e.g. 500mg" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Input 
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                        value={medication.frequency} 
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)} 
                        placeholder="e.g. 3 times daily" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input 
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                        value={medication.duration} 
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)} 
                        placeholder="e.g. 7 days" 
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="border border-gray-300 hover:bg-[#FDE1D3] text-gray-600" type="button" variant="ghost">Save as Draft</Button>
              <div className="space-x-2">

                {/* PREVIEW POPUP START */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="border border-gray-300 hover:bg-[#FDE1D3] text-gray-600" type="button" variant="outline" disabled={!selectedPatientId}>Preview</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-center border-b pb-4">Medical Prescription</DialogTitle>
                    </DialogHeader>
                    <div className="p-6 space-y-6">
                      <div className="flex justify-between text-sm">
                        <div>
                          <h4 className="font-bold text-lg">Dr. (You)</h4>
                          <p>MedCare Clinic</p>
                        </div>
                        <div className="text-right">
                          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                          <p><strong>ID:</strong> PREVIEW</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Patient Name</p>
                          <p className="font-medium">{patientsList.find(p => String(p.id) === selectedPatientId)?.name || "Not Selected"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Patient ID</p>
                          <p className="font-medium">{selectedPatientId || "N/A"}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-md border-b mb-2">Diagnosis</h4>
                        <p className="text-gray-700">{diagnosis || "No diagnosis entered"}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-md border-b mb-2">Medications (Rx)</h4>
                        <div className="space-y-3">
                          {medications.map((m, i) => (
                            <div key={i} className="flex justify-between text-sm border-b pb-2">
                              <div>
                                <p className="font-bold">{m.name || "Medicine Name"}</p>
                                <p className="text-gray-500">{m.dosage} - {m.frequency}</p>
                              </div>
                              <div className="text-right italic text-gray-500">{m.duration}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-md border-b mb-2">Notes</h4>
                        <p className="text-gray-700 text-sm">{notes || "None"}</p>
                      </div>

                      <div className="pt-10 flex justify-end">
                        <div className="text-center border-t border-black w-48 pt-2">
                          <p className="text-sm font-bold">Doctor's Signature</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* PREVIEW POPUP END */}

                <Button className="border border-primary bg-primary hover:bg-primary/90 text-white" type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Prescription
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescription;