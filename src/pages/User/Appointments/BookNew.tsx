import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
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
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Clock,
  IndianRupee,
  AlertCircle,
  Star,
  SlidersHorizontal,
  UserRound,
  CalendarPlus,
} from "lucide-react";

// --- TYPES ---
interface Doctor {
  id: number;
  name: string;
  specialization: string;
  clinic: string;
  experience: number;
  consultationFee: number;
  availability: string;
  photo: string | null;
  averageRating: number;
  totalReviews: number;
}

interface BackendDoctor {
  id: number;
  specialization: string | null;
  hospitalAffiliation: string | null;
  yearsOfExperience: number | null;
  consultationFee: number | null;
  availabilitySchedule: any;
  availability?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  averageRating: number;
  totalReviews: number;
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    profileImageDb: string | null;
  };
}

const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

// --- API FUNCTION ---
const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get<BackendDoctor[]>("/api/users/doctors");
  const todayDayOfWeek = new Date().getDay();

  return response.data.map((doc) => {
    const isAvailableToday = doc.availability?.some((slot) => slot.dayOfWeek === todayDayOfWeek);

    return {
      id: doc.id,
      name: `Dr. ${doc.user.firstName} ${doc.user.lastName}`,
      specialization: doc.specialization || "General Physician",
      clinic: doc.hospitalAffiliation || "Private Clinic",
      experience: doc.yearsOfExperience || 0,
      consultationFee: doc.consultationFee || 0,
      availability: isAvailableToday ? "Available Today" : "Unavailable Today",
      photo: doc.user.profileImageDb || null,
      averageRating: doc.averageRating || 0,
      totalReviews: doc.totalReviews || 0,
    };
  });
};

// --- SKELETON CARD ---
function DoctorCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-200">
      <div className="flex justify-center pt-4">
        <Skeleton className="h-20 w-20 rounded-full border-4 border-white bg-slate-200" />
      </div>
      <CardContent className="px-4 pt-2 pb-3 space-y-2">
        <div className="text-center space-y-1">
          <Skeleton className="h-4 w-32 mx-auto bg-slate-200 rounded" />
          <Skeleton className="h-3 w-20 mx-auto bg-slate-200 rounded" />
          <Skeleton className="h-3 w-12 mx-auto bg-slate-200 rounded-full" />
        </div>
        <div className="border-t border-gray-100 pt-2 space-y-1.5">
          <Skeleton className="h-3 w-full bg-slate-200 rounded" />
          <Skeleton className="h-3 w-3/4 bg-slate-200 rounded" />
          <Skeleton className="h-3 w-1/2 bg-slate-200 rounded" />
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Skeleton className="h-8 w-full bg-slate-200 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export default function BookNew() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all");

  const { data: doctors = [], isLoading, isError, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 1000 * 30,
  });

  const specializations = ["all", ...new Set(doctors.map((d) => d.specialization))];

  const filteredDoctors = doctors.filter((doctor) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      doctor.name.toLowerCase().includes(q) ||
      doctor.specialization.toLowerCase().includes(q) ||
      doctor.clinic.toLowerCase().includes(q);
    const matchesFilter =
      filterSpecialization === "all" || doctor.specialization === filterSpecialization;
    return matchesSearch && matchesFilter;
  });

  // --- ERROR STATE ---
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800">Failed to load doctors</p>
          <p className="text-sm text-gray-500 mt-1">
            {(error as any)?.response?.status === 401
              ? "Session expired. Please login again."
              : "Something went wrong. Please try again later."}
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold">Book Appointment</h1>
          <p className="text-gray-600 mt-1">Find and book your preferred doctor instantly.</p>
        </div>
        {!isLoading && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium shrink-0">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {/* ── Search & Filter ── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, specialization or clinic…"
                className="pl-9 border-gray-200 bg-gray-50 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-56">
              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger className="h-10 border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500">
                    <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                    <SelectValue placeholder="All Specializations" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white shadow-xl rounded-xl border-gray-100">
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec} className="text-sm cursor-pointer">
                      {spec === "all" ? "All Specializations" : spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Cards Grid ── 4 cols on xl, 3 on lg, 2 on md, 1 on sm */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <DoctorCardSkeleton key={i} />)}
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDoctors.map((doctor) => {
            const isAvailable = doctor.availability === "Available Today";
           

            return (
              <Card
                key={doctor.id}
                className="overflow-hidden border border-gray-200 flex flex-col hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                {/* Avatar — clean top, no banner */}
                <div className="flex justify-center pt-4 px-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm bg-white shrink-0">
                    <img
                     src={doctor.photo || DEFAULT_AVATAR}
                      alt={doctor.name}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                         DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                </div>

                {/* Card body */}
                <CardContent className="px-4 pt-2 pb-3 flex flex-col gap-2 flex-1">
                  {/* Name + specialization + availability centered */}
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
                      {doctor.name}
                    </p>
                    <p className="text-xs text-primary font-medium mt-0.5 line-clamp-1">
                      {doctor.specialization}
                    </p>
                    <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isAvailable ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      {isAvailable ? "● Available" : "○ Unavailable"}
                    </span>
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700">
                        {doctor.averageRating > 0 ? doctor.averageRating.toFixed(1) : "New"}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        ({doctor.totalReviews})
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Info rows */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{doctor.experience} yrs experience</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="line-clamp-1">{doctor.clinic}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                      <IndianRupee className="h-3 w-3" />
                      <span>{doctor.consultationFee}</span>
                      <span className="text-gray-400 font-normal">/ visit</span>
                    </div>
                  </div>
                </CardContent>

                {/* CTA */}
                <CardFooter className="px-4 pb-4 pt-0">
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-white text-xs gap-1.5 rounded-lg"
                    onClick={() => navigate(`/book/${doctor.id}`)}
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="h-16 w-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
            <UserRound className="h-8 w-8 text-gray-300" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700 text-sm">No doctors found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different name or clear your filters.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-5 border-gray-300"
            onClick={() => { setSearchTerm(""); setFilterSpecialization("all"); }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}