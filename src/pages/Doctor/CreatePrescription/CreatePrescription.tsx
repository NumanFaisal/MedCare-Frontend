import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CreatePrescription = () => {
    const navigate = useNavigate();
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");
    const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);

    const patientsList = [
        { id: "P001", name: "Vishal Kumar" },
        { id: "P002", name: "Prince Tiwari" },
        { id: "P003", name: "Pratik Anand" },
        { id: "P004", name: "Praveen Kumar" },
        { id: "P005", name: "Utsarg Tiwari" },
    ];

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.success("Prescription Created", { description: "Prescription has been created successfully." });
        navigate('/doctor'); 
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
              <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Patient Details</CardTitle>
                    <CardDescription className="text-gray-600">Select patient and add diagnosis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient">Select Patient</Label>
                        <Select onValueChange={(val) => setSelectedPatientId(val)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a patient" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border rounded-lg border-gray-100">
                                {patientsList.map(patient => (
                                  <SelectItem className="hover:bg-[#FDE1D3]" key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </div>
                                
                      <div className="space-y-2">
                          <Label htmlFor="patientId">Patient ID</Label>
                          <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="patientId" value={selectedPatientId} readOnly placeholder="Enter Patient ID" />
                      </div>
                                
                      <div className="space-y-2">
                          <Label htmlFor="diagnosis">Diagnosis</Label>
                          <Textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Enter diagnosis details" />
                      </div>
                                
                      <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional information" />
                      </div>
                  </CardContent>
              </Card>
                        
              <Card className="border-none shadow-lg">
                  <CardHeader>
                      <CardTitle className="text-2xl">Prescription Details</CardTitle>
                      <CardDescription className="text-gray-600">Date and reference information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                      </div>
                                
                      <div className="space-y-2">
                          <Label htmlFor="prescriptionId">Prescription ID</Label>
                          <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="prescriptionId" defaultValue={`RX-${Date.now().toString().slice(-8)}`} readOnly />
                      </div>
                                
                      <div className="space-y-2">
                          <Label htmlFor="validity">Valid Until</Label>
                          <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="validity" type="date" />
                      </div>
                  </CardContent>
              </Card>
          </div>
                    
            <Card className="border-none  shadow-lg mt-6">
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
                                <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" value={medication.name} onChange={(e) => updateMedication(index, 'name', e.target.value)} placeholder="e.g. Amoxicillin" />
                              </div>
                              <div className="space-y-2">
                                <Label>Dosage</Label>
                                <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" value={medication.dosage} onChange={(e) => updateMedication(index, 'dosage', e.target.value)} placeholder="e.g. 500mg" />
                              </div>
                              <div className="space-y-2">
                                <Label>Frequency</Label>
                                <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" value={medication.frequency} onChange={(e) => updateMedication(index, 'frequency', e.target.value)} placeholder="e.g. 3 times daily" />
                              </div>
                              <div className="space-y-2">
                              	<Label>Duration</Label>
                              	<Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" value={medication.duration} onChange={(e) => updateMedication(index, 'duration', e.target.value)} placeholder="e.g. 7 days" />
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
                            <Button className="border border-gray-300 hover:bg-[#FDE1D3] text-gray-600" type="button" variant="outline">Preview</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-center border-b pb-4">Medical Prescription</DialogTitle>
                              </DialogHeader>
                              <div className="p-6 space-y-6">
                                  <div className="flex justify-between text-sm">
                                      <div>
                                          <h4 className="font-bold text-lg">Dr. Numan Faisal</h4>
                                          <p>MedCare Clinic</p>
                                          <p>Contact: +91 98765 43210</p>
                                      </div>
                                      <div className="text-right">
                                          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                                          <p><strong>ID:</strong> RX-{Date.now().toString().slice(-8)}</p>
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                      <div>
                                          <p className="text-xs text-gray-500 uppercase">Patient Name</p>
                                          <p className="font-medium">{patientsList.find(p => p.id === selectedPatientId)?.name || "Not Selected"}</p>
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

                      <Button className="border border-primary bg-primary hover:bg-primary/90 text-white" type="submit">Create Prescription</Button>
                  </div>
            </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    );
};

export default CreatePrescription;