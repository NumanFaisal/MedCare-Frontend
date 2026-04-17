import { useState } from "react";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  FileText, 
  Filter, 
  Search, 
  AlertCircle,
  Upload,
  ImageIcon,
  Maximize2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- TYPES ---
interface FormattedPrescription {
  id: string;
  originalId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  doctor: string;
  status: "active" | "expired";
  notes: string;
}

// --- API FETCH FUNCTION ---
const fetchPrescriptions = async (): Promise<FormattedPrescription[]> => {
  const response = await api.get("/api/prescriptions/patient/me");

  // Backend returns paginated { data: [...], meta: {...} }
  const prescriptions = response.data.data || response.data;

  // Data Transformation
  return prescriptions.flatMap((rx: any) => {
    const doctorName = rx.doctor?.user 
      ? `Dr. ${rx.doctor.user.firstName} ${rx.doctor.user.lastName}`
      : "Unknown Doctor";

    const startDate = new Date(rx.date || rx.createdAt);
    const validUntil = rx.validUntilDate ? new Date(rx.validUntilDate) : null;
    const medications = rx.prescribedMedications || []; 

    return medications.map((med: any, index: number) => {
      let endDate = validUntil;
      if (!endDate) {
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
      }

      const isExpired = new Date() > endDate;

      return {
        id: `${rx.id}-${index}`, 
        originalId: rx.prescriptionId || String(rx.id),
        medication: med.medication?.name || "Unknown Med",
        dosage: med.dosage,
        frequency: med.frequency,
        startDate: format(startDate, 'dd-MM-yy'),
        endDate: format(endDate, 'dd-MM-yy'),
        doctor: doctorName,
        status: isExpired ? "expired" : "active",
        notes: rx.additionalNotes || "No additional notes provided."
      };
    });
  });
};

// --- MANUAL PRESCRIPTION FETCH FUNCTION ---
const fetchMyUploads = async () => {
  const response = await api.get("/api/upload/prescriptions");
  return response.data.prescriptions || [];
};

function Prescription() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // --- 1. REACT QUERY ---
  const { data: prescriptions = [], isLoading, isError } = useQuery({
    queryKey: ['my-prescriptions'],
    queryFn: fetchPrescriptions,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: myUploads = [], isLoading: isLoadingUploads } = useQuery({
    queryKey: ['my-uploaded-prescriptions'],
    queryFn: fetchMyUploads,
  });

  const uploadMutation = useMutation({
    mutationFn: async (payload: { imageBase64: string; notes: string }) => {
      const response = await api.post("/api/upload/prescription", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Prescription uploaded successfully!");
      setUploadFile(null);
      setUploadNotes("");
      queryClient.invalidateQueries({ queryKey: ['my-uploaded-prescriptions'] });
    },
    onError: () => {
      toast.error("Failed to upload prescription.");
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setUploadFile(file);
    }
  };

  const submitUpload = () => {
    if (!uploadFile) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      uploadMutation.mutate({ imageBase64: base64String, notes: uploadNotes });
    };
    reader.readAsDataURL(uploadFile);
  };

  // --- 2. DERIVED STATE (FILTERING) ---
  const filteredPrescriptions = prescriptions.filter(p => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      p.medication.toLowerCase().includes(query) || 
      p.doctor.toLowerCase().includes(query) || 
      p.id.toLowerCase().includes(query);

    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedPrescription(prev => prev === id ? null : id);
  };

  // --- 3. LOADING STATE (SKELETON) ---
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-slate-200" />
            <Skeleton className="h-4 w-64 bg-slate-200" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-48 bg-slate-200" />
            <Skeleton className="h-10 w-20 bg-slate-200" />
            <Skeleton className="h-10 w-20 bg-slate-200" />
          </div>
        </div>

        {/* List Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 bg-slate-200" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Skeleton className="h-2 w-2 rounded-full bg-slate-200" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-slate-200" />
                    <Skeleton className="h-4 w-24 bg-slate-200" />
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="hidden sm:block space-y-2 text-right">
                    <Skeleton className="h-4 w-24 bg-slate-200 ml-auto" />
                    <Skeleton className="h-3 w-16 bg-slate-200 ml-auto" />
                  </div>
                  <Skeleton className="h-9 w-24 bg-slate-200 rounded-md" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- 4. ERROR STATE ---
  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-red-500 gap-2">
        <AlertCircle className="h-8 w-8" />
        <p className="font-medium">Failed to load prescriptions.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // --- 5. MAIN RENDER ---
  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">
              My Prescriptions
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your prescriptions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-9"
                placeholder="Search prescriptions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-1 text-white" onClick={() => setFilterStatus('all')}>
                <Filter className="h-4 w-4" />
                <span>All</span>
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                className={`flex items-center gap-1 ${filterStatus === 'active' ? 'text-white bg-blue-500' : 'text-black'}`}
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'expired' ? 'default' : 'outline'}
                className="flex items-center gap-1"
                onClick={() => setFilterStatus('expired')}
              >
                Expired
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="doctor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto mt-4 px-2 py-0 border-b-2 rounded-none border-gray-200  !bg-transparent h-auto mb-6 gap-6">
            <TabsTrigger 
              value="doctor" 
              className="text-base px-1 pb-3 text-gray-500 rounded-none border-b-2 border-transparent data-[state=active]:!text-primary data-[state=active]:!border-primary data-[state=active]:font-semibold data-[state=active]:!bg-transparent data-[state=active]:!shadow-none transition-all hover:text-gray-900"
            >
              Doctor Issued
            </TabsTrigger>
            <TabsTrigger 
              value="my-uploads" 
              className="text-base px-1 pb-3 text-gray-500 rounded-none border-b-2 border-transparent data-[state=active]:!text-primary data-[state=active]:!border-primary data-[state=active]:font-semibold data-[state=active]:!bg-transparent data-[state=active]:!shadow-none transition-all hover:text-gray-900"
            >
              My Uploads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctor">
            <Card>
              <CardHeader className="pd-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Prescription History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map(prescription => (
                  <div
                    key={prescription.id}
                    className="border border-gray-300 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpand(prescription.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${prescription.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <div>
                          <h3 className="font-medium">{prescription.medication}</h3>
                          <p className="text-sm text-gray-500">{prescription.dosage}, {prescription.frequency}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium">{prescription.doctor}</p>
                          <p className="text-xs text-gray-500">Issued: {prescription.startDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="hidden sm:flex items-center gap-1 bg-primary hover:text-black hover:bg-[#E5DEFF]/50 rounded-lg border border-gray-300 text-white">
                            <Download className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:inline-block ">
                              Download
                            </span>
                          </Button>
                          {expandedPrescription === prescription.id ?
                            <ChevronUp className="h-5 w-5 text-gray-400" /> :
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          }
                        </div>
                      </div>
                    </div>
                    {expandedPrescription === prescription.id && (
                      <div className="p-4 bg-gray-50 border-t border-gray-300">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Reference ID</dt>
                            <dd className="mt-1 text-sm text-gray-900">{prescription.originalId}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Prescribed By</dt>
                            <dd className="mt-1 text-sm text-gray-900">{prescription.doctor}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">{prescription.startDate}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                            <dd className="mt-1 text-sm text-gray-900">{prescription.endDate}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Instructions / Notes</dt>
                            <dd className="mt-1 text-sm text-gray-900">{prescription.notes}</dd>
                          </div>
                          <div className="sm:col-span-2 pt-2">
                            <Button size="sm" variant="outline" className="flex items-center gap-1 bg-primary hover:text-black hover:bg-[#E5DEFF]/50 text-white">
                              <Download className="h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No prescriptions found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No prescriptions match your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="my-uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload New Prescription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Image (Max 5MB)</label>
                    <Input type="file" accept="image/*" onChange={handleFileUpload} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <Input placeholder="E.g., Dermatologist prescription from Jan 2024" value={uploadNotes} onChange={e => setUploadNotes(e.target.value)} />
                  </div>
                </div>
                <div className="w-full md:w-auto h-full flex items-end pt-6 md:pt-0 pb-1 align-bottom self-end">
                   <Button onClick={submitUpload} disabled={!uploadFile || uploadMutation.isPending} className="w-full text-white bg-primary">
                    {uploadMutation.isPending ? "Uploading..." : "Upload Prescription"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Prescription Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {isLoadingUploads ? (
                  <div className="col-span-3 py-8 text-center text-gray-500">Loading uploads...</div>
                ) : myUploads.length > 0 ? (
                  myUploads.map((upload: any) => (
                    <div 
                      key={upload.id} 
                      className="border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => setSelectedImageUrl(upload.imageBase64)}
                    >
                      <div className="h-48 bg-gray-100 flex items-center justify-center p-2 relative">
                        <img src={upload.imageBase64} alt="Prescription" className="max-h-full object-contain transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <Maximize2 className="text-white h-8 w-8" />
                        </div>
                      </div>
                      <div className="p-4 border-t flex flex-col justify-between flex-1">
                        <p className="text-sm text-gray-700 w-full mb-2 line-clamp-2">{upload.notes || "No notes provided"}</p>
                        <p className="text-xs text-gray-400 font-mono mt-auto">{new Date(upload.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <h3 className="text-sm font-semibold text-gray-900">No uploads yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Images you manually upload will appear here.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
      <Dialog open={!!selectedImageUrl} onOpenChange={() => setSelectedImageUrl(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>View Prescription</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-black/90 min-h-[50vh]">
            <img 
              src={selectedImageUrl || ''} 
              alt="Uploaded Prescription" 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl" 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Prescription;