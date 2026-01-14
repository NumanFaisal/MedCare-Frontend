import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure you have this component

// --- TYPES ---
interface DoctorData {
  id: number;
  name: string;
  specialization: string;
  clinic: string;
  experience: number;
  consultationFee: number;
  rating: number;
  patients: string;
  about: string;
  photo: string;
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

  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:4000/api/users/doctors/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = response.data;

  return {
    id: data.id,
    name: `Dr. ${data.user.firstName} ${data.user.lastName}`,
    specialization: data.specialization,
    clinic: data.hospitalAffiliation || "Private Clinic",
    experience: data.yearsOfExperience,
    consultationFee: data.consultationFee,
    rating: 4.8,
    patients: "500+",
    about: data.professionalBio || "Experienced specialist committed to patient care.",
    photo: PLACEHOLDER_IMAGE
  };
};

const bookAppointment = async (payload: BookingPayload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post("http://localhost:4000/api/appointments/book", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// --- COMPONENT ---
export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");

  // --- REACT QUERY ---
  const {
    data: doctor,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => fetchDoctorDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const bookingMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (err) => {
      console.error("Booking failed:", err);
      // Ideally use a toast here
    }
  });

  // --- HELPERS ---
  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        fullDate: date.toISOString().split('T')[0]
      });
    }
    return dates;
  };

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "04:00 PM", "04:30 PM", "05:00 PM",
    "05:30 PM", "06:00 PM"
  ];

  const handleConfirmPayment = () => {
    if (!doctor || !selectedDate || !selectedTime) return;
    const appointmentDateTime = new Date(`${selectedDate} ${selectedTime}`).toISOString();
    bookingMutation.mutate({
      doctorId: doctor.id,
      appointmentDate: appointmentDateTime,
      status: "PENDING",
      reason: symptoms
    });
  };

  // --- SKELETON LOADER ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 pb-20">
        {/* Navbar Skeleton */}
        <div className="bg-white border-b sticky top-0 z-10 h-16">
          <div className="container mx-auto px-4 h-full flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Schedule Skeleton */}
            <Card>
              <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-16 mb-3" />
                  <div className="flex gap-3 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-[90px] w-[80px] rounded-xl shrink-0" />
                    ))}
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-3" />
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Skeleton key={i} className="h-9 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Form Skeleton */}
            <Card>
              <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Bill Skeleton */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  <div className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-16" /></div>
                  <div className="flex justify-between"><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-16" /></div>
                </div>
                <Separator />
                <div className="flex justify-between"><Skeleton className="h-6 w-24" /><Skeleton className="h-6 w-20" /></div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-14 w-full rounded-md" />
              </CardFooter>
            </Card>
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
              <p>Time: <strong>{selectedTime}</strong></p>
            </div>
            <div className="pt-6">
              <Button
                onClick={() => navigate('/user')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                View My Appointments
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

        {/* LEFT COLUMN: Doctor Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-2 border-slate-100 shadow-sm">
            <div className="aspect-[4/3] w-full relative">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                <h2 className="text-white text-xl font-bold">{doctor.name}</h2>
                <p className="text-slate-200 text-sm">{doctor.specialization}</p>
              </div>
            </div>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{doctor.rating}</span>
                  <span className="text-slate-400">({doctor.patients})</span>
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
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2 text-sm">About Doctor</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {doctor.about}
                </p>
              </div>
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
                      onClick={() => setSelectedDate(item.fullDate)}
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
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Grid */}
              <div>
                <Label className="mb-3 block text-slate-600">Time Slot</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all ${selectedTime === time
                          ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
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
                disabled={!selectedDate || !selectedTime || bookingMutation.isPending}
                onClick={handleConfirmPayment}
              >
                {bookingMutation.isPending ? (
                  <span className="flex items-center gap-2">Processing...</span>
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