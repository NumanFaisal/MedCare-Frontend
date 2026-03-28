import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  ChevronLeft,
  Star,
  ShieldCheck,
  CheckCircle2,
  User,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// --- TYPES ---
interface DoctorData {
  id: number;
  name: string;
  specialization: string;
  clinic: string;
  experience: number;
  consultationFee: number;
  about: string;
  photo: string;
}

interface TimeSlot {
  time: string;
  dateTime: string;
  available: boolean;
}

interface ReviewData {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { firstName: string; lastName: string };
}

interface ReviewsResponse {
  reviews: ReviewData[];
  averageRating: string;
  totalReviews: number;
}

interface BookingPayload {
  doctorId: number;
  appointmentDate: string;
  status: string;
  reason: string;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop";

// --- API FUNCTIONS ---
const fetchDoctorDetails = async (id: string | undefined): Promise<DoctorData> => {
  if (!id) throw new Error("No Doctor ID provided");
  const response = await api.get(`/api/users/doctors/${id}`);
  const data = response.data;
  return {
    id: data.id,
    name: `Dr. ${data.user.firstName} ${data.user.lastName}`,
    specialization: data.specialization,
    clinic: data.hospitalAffiliation || "Private Clinic",
    experience: data.yearsOfExperience,
    consultationFee: data.consultationFee,
    about: data.professionalBio || "Experienced specialist committed to patient care.",
    photo: PLACEHOLDER_IMAGE
  };
};

const fetchDoctorReviews = async (id: string | undefined): Promise<ReviewsResponse> => {
  if (!id) return { reviews: [], averageRating: "0", totalReviews: 0 };
  const response = await api.get(`/api/reviews/doctor/${id}`);
  return response.data.data;
};

const fetchSlots = async (doctorId: string | undefined, date: string): Promise<TimeSlot[]> => {
  if (!doctorId || !date) return [];
  const response = await api.get(`/api/appointments/slots?doctorId=${doctorId}&date=${date}`);
  return response.data;
};

const bookAppointment = async (payload: BookingPayload) => {
  const response = await api.post("/api/appointments/book", payload);
  return response.data;
};

// Star rating component
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`transition-colors`}
          style={{ width: size, height: size }}
          fill={i <= rating ? "#FBBF24" : "transparent"}
          stroke={i <= rating ? "#FBBF24" : "#D1D5DB"}
        />
      ))}
    </div>
  );
}

// --- COMPONENT ---
export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");

  // Pre-fill patient info from profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/api/auth/profile");
        setPatientName(`${res.data.firstName || ""} ${res.data.lastName || ""}`.trim());
        setPatientPhone(res.data.phoneNumber || "");
      } catch { /* non-critical */ }
    };
    loadProfile();
  }, []);

  // --- REACT QUERY ---
  const { data: doctor, isLoading, isError, error } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => fetchDoctorDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["doctor-reviews", id],
    queryFn: () => fetchDoctorReviews(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: slots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ["doctor-slots", id, selectedDate],
    queryFn: () => fetchSlots(id, selectedDate),
    enabled: !!id && !!selectedDate,
    staleTime: 1000 * 60 * 1, // Re-fetch frequently
  });

  const bookingMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      toast.success("Appointment booked successfully!", {
        description: `Your appointment with ${doctor?.name} has been confirmed.`,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Booking failed. Please try again.";
      toast.error("Booking Failed", { description: message });
    }
  });

  // --- HELPERS ---
  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        monthName: date.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: date.toISOString().split('T')[0]
      });
    }
    return dates;
  };

  const handleConfirmPayment = () => {
    if (!doctor || !selectedSlot) return;
    bookingMutation.mutate({
      doctorId: doctor.id,
      appointmentDate: selectedSlot.dateTime,
      status: "PENDING",
      reason: symptoms
    });
  };

  const avgRating = reviewsData?.averageRating ? parseFloat(reviewsData.averageRating) : 0;
  const totalReviews = reviewsData?.totalReviews || 0;
  const reviews = reviewsData?.reviews || [];

  // --- SKELETON LOADER ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 pb-20">
        <div className="bg-white border-b sticky top-0 z-10 h-16">
          <div className="container mx-auto px-4 h-full flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card><Skeleton className="aspect-[4/3] w-full rounded-t-lg" /><CardContent className="pt-6 space-y-4"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card><CardContent className="pt-6 space-y-6"><Skeleton className="h-4 w-16 mb-3" /><div className="flex gap-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-[90px] w-[80px] rounded-xl shrink-0" />)}</div></CardContent></Card>
            <Card><CardContent className="pt-6 space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-20 w-full" /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <AlertCircle className="w-12 h-12 text-red-500 opacity-80" />
        <h2 className="text-xl font-semibold text-slate-800">Oops! Something went wrong</h2>
        <p className="text-slate-500 max-w-sm text-center">{(error as Error).message || "We couldn't load the doctor's details."}</p>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  // --- SUCCESS STATE (Booking Confirmed) ---
  if (bookingMutation.isSuccess && doctor) {
    return (
      <div className="container max-w-lg mx-auto py-20 px-4">
        <Card className="text-center border-green-200 bg-green-50/50 shadow-lg">
          <CardContent className="pt-10 pb-10 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">Booking Confirmed!</h2>
            <div className="space-y-2 text-slate-600">
              <p>Doctor: <strong>{doctor.name}</strong></p>
              <p>Date: <strong>{selectedDate}</strong></p>
              <p>Time: <strong>{selectedSlot?.time}</strong></p>
            </div>
            <div className="pt-6 space-y-3">
              <Button
                onClick={() => navigate('/user/appointments')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                View My Appointments
              </Button>
              <Button
                onClick={() => navigate('/user')}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!doctor) return null;

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Navbar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" className="gap-2 -ml-2 text-slate-600" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>
          <span className="font-semibold text-lg ml-2">Book Appointment</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Doctor Details + Reviews */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-2 border-slate-100 shadow-sm">
            <div className="aspect-[4/3] w-full relative">
              <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                <h2 className="text-white text-xl font-bold">{doctor.name}</h2>
                <p className="text-slate-200 text-sm">{doctor.specialization}</p>
              </div>
            </div>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{avgRating > 0 ? avgRating.toFixed(1) : 'New'}</span>
                  <span className="text-slate-400">({totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Verified</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {doctor.clinic}
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                  {doctor.experience} Years Experience
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <IndianRupee className="w-4 h-4 mt-0.5 shrink-0" />
                  ₹{doctor.consultationFee} consultation
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2 text-sm">About Doctor</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{doctor.about}</p>
              </div>
            </CardContent>
          </Card>

          {/* REVIEWS SECTION */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Patient Reviews
                {totalReviews > 0 && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-normal">
                    {totalReviews}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first!</p>
              ) : (
                <>
                  {/* Rating Summary */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="text-3xl font-bold text-slate-900">{avgRating.toFixed(1)}</div>
                    <div>
                      <StarRating rating={Math.round(avgRating)} />
                      <p className="text-xs text-slate-500 mt-0.5">{totalReviews} reviews</p>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 pb-3 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {review.reviewer.firstName[0]}
                            </div>
                            <span className="text-sm font-medium text-slate-800">
                              {review.reviewer.firstName} {review.reviewer.lastName}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="ml-9">
                          <StarRating rating={review.rating} size={12} />
                          {review.comment && (
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Booking Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Schedule Selection */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-primary" />
                Select Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Scroller */}
              <div>
                <Label className="mb-3 block text-slate-600">Date</Label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {getUpcomingDates().map((item) => (
                    <button
                      key={item.fullDate}
                      onClick={() => {
                        setSelectedDate(item.fullDate);
                        setSelectedSlot(null); // Reset slot when date changes
                      }}
                      className={`min-w-[80px] h-[90px] rounded-xl flex flex-col items-center justify-center border-2 transition-all ${selectedDate === item.fullDate
                          ? 'border-primary bg-primary text-white shadow-md transform scale-105'
                          : 'border-slate-100 bg-white hover:border-slate-300 text-slate-600'
                        }`}
                    >
                      <span className={`text-xs font-medium uppercase mb-1 ${selectedDate === item.fullDate ? 'text-blue-100' : 'text-slate-400'}`}>
                        {item.dayName}
                      </span>
                      <span className="text-2xl font-bold">
                        {item.dayNumber}
                      </span>
                      <span className={`text-[10px] ${selectedDate === item.fullDate ? 'text-blue-200' : 'text-slate-400'}`}>
                        {item.monthName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots — DYNAMIC from API */}
              <div>
                <Label className="mb-3 block text-slate-600">Available Time Slots</Label>
                {!selectedDate ? (
                  <p className="text-sm text-slate-400 py-4 text-center">Select a date to see available slots</p>
                ) : slotsLoading ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-9 w-full rounded-lg" />)}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-6 bg-orange-50 rounded-lg border border-orange-100">
                    <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-orange-700">No slots available on this date</p>
                    <p className="text-xs text-orange-500 mt-1">Try selecting another date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-1 text-xs font-medium rounded-lg border transition-all ${selectedSlot?.time === slot.time
                            ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-primary/5'
                          }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 2. Patient Details */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Ex. John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Briefly describe what you are feeling..."
                  className="min-h-[80px]"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. Payment Summary & CTA */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Bill Summary</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Consultation Fee</span>
                  <span className="font-medium text-slate-900 flex items-center">
                    <IndianRupee className="w-3 h-3" /> {doctor.consultationFee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service Tax & Booking Fee</span>
                  <span className="font-medium text-slate-900 flex items-center">
                    <IndianRupee className="w-3 h-3" /> 50
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total Payable</span>
                  <span className="flex items-center">
                    <IndianRupee className="w-4 h-4" /> {doctor.consultationFee + 50}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pb-6">
              <Button
                size="lg"
                className="w-full text-base py-6 shadow-lg shadow-primary/20"
                disabled={!selectedDate || !selectedSlot || bookingMutation.isPending}
                onClick={handleConfirmPayment}
              >
                {bookingMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-white">
                    Pay & Confirm Booking
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}