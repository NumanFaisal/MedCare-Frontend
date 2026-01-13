import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Download, FileText, Filter, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

// Define Types based on what the UI expects
interface FormattedPrescription {
  id: string;
  originalId: number;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  doctor: string;
  status: "active" | "expired";
  notes: string;
}

function Prescription() {
  const [prescriptions, setPrescriptions] = useState<FormattedPrescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<FormattedPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // --- 1. FETCH DATA FROM API ---
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/prescriptions/patient/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // --- DATA TRANSFORMATION ---
        const flattenedData: FormattedPrescription[] = response.data.flatMap((rx: any) => {
          
          // SAFETY CHECK: Ensure doctor and user exist before accessing properties
          // If doctor data is missing, use placeholders
          const doctorName = rx.doctor?.user 
            ? `Dr. ${rx.doctor.user.firstName} ${rx.doctor.user.lastName}`
            : "Unknown Doctor";

          const startDate = new Date(rx.createdAt);
          
          // SAFETY CHECK: If rx.medications is null/undefined, use empty array []
          // This fixes the "reading 'map'" error
          const medications = rx.medications || []; 

          return medications.map((med: any, index: number) => {
            const durationDays = parseInt(med.duration) || 7; 
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + durationDays);

            const isExpired = new Date() > endDate;

            return {
              id: `${rx.id}-${index}`, 
              originalId: rx.id,
              medication: med.medication,
              dosage: med.dosage,
              frequency: med.frequency,
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              doctor: doctorName,
              status: isExpired ? "expired" : "active",
              notes: rx.notes || "No additional notes provided."
            };
          });
        });

        setPrescriptions(flattenedData);
        setFilteredPrescriptions(flattenedData);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        setError("Failed to load prescriptions.");
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // --- 2. HANDLE SEARCH ---
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, filterStatus);
  };

  // --- 3. HANDLE FILTER ---
  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    applyFilters(searchQuery, status);
  };

  // Helper to apply both search and filter
  const applyFilters = (query: string, status: string) => {
    const filtered = prescriptions.filter(p => {
      const matchesSearch = 
        p.medication.toLowerCase().includes(query) || 
        p.doctor.toLowerCase().includes(query) || 
        p.id.toLowerCase().includes(query);

      const matchesFilter = status === 'all' || p.status === status;

      return matchesSearch && matchesFilter;
    });
    setFilteredPrescriptions(filtered);
  };

  const toggleExpand = (id: string) => {
    if (expandedPrescription === id) {
      setExpandedPrescription(null);
    } else {
      setExpandedPrescription(id)
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

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
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-1 text-white" onClick={() => handleFilterChange('all')}>
                <Filter className="h-4 w-4" />
                <span>All</span>
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                className={`flex items-center gap-1 ${filterStatus === 'active' ? 'text-white bg-blue-500' : 'text-black'
                  }`}
                onClick={() => handleFilterChange('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'expired' ? 'default' : 'outline'}
                className="flex items-center gap-1"
                onClick={() => handleFilterChange('expired')}
              >
                Expired
              </Button>
            </div>
          </div>
        </div>

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
                      <div className="p-4 bg-gray-50 border-t  border-gray-300">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Reference ID</dt>
                            <dd className="mt-1 text-sm text-gray-900">RX-{prescription.originalId}</dd>
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
                            <dt className="text-sm font-medium text-gray-500">End Date (Est.)</dt>
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
      </div>
    </div>
  )
}

export default Prescription;