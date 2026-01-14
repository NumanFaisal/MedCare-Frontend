import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, MapPin, Clock, IndianRupee, AlertCircle } from "lucide-react";

// --- TYPES ---
interface Doctor {
  id: number;
  name: string;
  specialization: string;
  clinic: string;
  experience: number;
  consultationFee: number;
  availability: string;
  photo: string;
}

interface BackendDoctor {
  id: number;
  specialization: string;
  hospitalAffiliation: string | null;
  yearsOfExperience: number;
  consultationFee: number;
  availabilitySchedule: any;
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
  };
}

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop",
];

// --- API FUNCTION ---
const fetchDoctors = async (): Promise<Doctor[]> => {
  const token = localStorage.getItem("token");
  const response = await axios.get<BackendDoctor[]>("http://localhost:4000/api/users/doctors", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.map((doc, index) => ({
    id: doc.id,
    name: `Dr. ${doc.user.firstName} ${doc.user.lastName}`,
    specialization: doc.specialization,
    clinic: doc.hospitalAffiliation || "Private Clinic",
    experience: doc.yearsOfExperience,
    consultationFee: doc.consultationFee,
    availability: doc.availabilitySchedule ? "Available Today" : "Check Availability",
    photo: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
  }));
};

export default function BookNew() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all");

  // --- REACT QUERY ---
  const { data: doctors = [], isLoading, isError, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  // --- FILTER LOGIC ---
  const specializations = [
    "all",
    ...new Set(doctors.map((doctor) => doctor.specialization)),
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.clinic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterSpecialization === "all" ||
      doctor.specialization === filterSpecialization;

    return matchesSearch && matchesFilter;
  });

  // --- LOADING STATE (SKELETON) ---
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-slate-200" />
          <Skeleton className="h-4 w-96 bg-slate-200" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border-2 border-slate-100">
          <Skeleton className="h-10 w-full md:w-1/2 bg-slate-200 rounded-md" />
          <Skeleton className="h-10 w-full md:w-1/4 bg-slate-200 rounded-md" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-2 border-slate-100 overflow-hidden flex flex-col">
              {/* Image Skeleton */}
              <Skeleton className="aspect-video w-full bg-slate-200" />
              
              <CardHeader className="pb-2 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-6 w-3/4 bg-slate-200" />
                    <Skeleton className="h-4 w-1/2 bg-slate-200" />
                  </div>
                  <Skeleton className="h-8 w-16 bg-slate-200 rounded-md" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 flex-1">
                <Skeleton className="h-4 w-1/3 bg-slate-200" />
                <Skeleton className="h-4 w-2/3 bg-slate-200" />
              </CardContent>
              
              <CardFooter className="pt-2">
                <Skeleton className="h-10 w-full bg-slate-200 rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500 opacity-80" />
        <p className="text-lg font-medium text-slate-800">Failed to load doctors</p>
        <p className="text-slate-500 text-sm">{(error as any)?.response?.status === 401 ? "Session expired. Please login again." : "Something went wrong. Please try again later."}</p>
        <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book Appointment</h1>
          <p className="text-muted-foreground mt-1">
            Find the best doctors and book your appointment instantly.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border-2 border-gray-200 shadow-sm">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors, specializations, clinics..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/4">
          <Select
            value={filterSpecialization}
            onValueChange={setFilterSpecialization}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by Specialization" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-none shadow-xl rounded-lg border-gray-100">
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec} className="hover:bg-gray-100 cursor-pointer">
                  {spec === "all" ? "All Specializations" : spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="border-2 border-gray-200 overflow-hidden flex flex-col hover:border-blue-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden bg-muted relative">
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      doctor.availability.includes("Available")
                        ? "default"
                        : "secondary"
                    }
                    className={
                      doctor.availability.includes("Available")
                        ? "bg-green-500/90 hover:bg-green-500"
                        : "bg-red-500/90 hover:bg-red-500 text-white"
                    }
                  >
                    {doctor.availability}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{doctor.name}</CardTitle>
                    <CardDescription className="text-primary font-medium mt-1">
                      {doctor.specialization}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold flex items-center text-green-600">
                      <IndianRupee className="h-3 w-3 mr-0.5" />
                      {doctor.consultationFee}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Consultation
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  <span>{doctor.experience} Years Experience</span>
                </div>
                <div className="flex items-start text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{doctor.clinic}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full text-white"
                  size="lg"
                  onClick={() => navigate(`/book/${doctor.id}`)}
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No doctors found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}