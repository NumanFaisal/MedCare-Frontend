import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { 
  ChevronLeft, ChevronRight, ArrowRight, MapPin, 
  Clock, IndianRupee, Stethoscope, AlertCircle 
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

// --- TYPES ---
type DoctorType = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  location: string;
  rating: number;
  totalReviews: number;
  image: string;
  hospital: string;
  consultationFee: number;
};

const PLACEHOLDER_IMAGES = [
  'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/free-photo/portrait-doctor_144627-39379.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/free-photo/doctor-offering-medical-teleconsultation_23-2149329007.jpg?w=740',
];

// --- API FETCH FUNCTION ---
const fetchDoctors = async (): Promise<DoctorType[]> => {
  const response = await axios.get("http://localhost:4000/api/users/doctors");
  
  // Map Backend Data -> UI Data
  return response.data.map((doc: any, index: number) => ({
    id: doc.id.toString(),
    name: `Dr. ${doc.user.firstName} ${doc.user.lastName}`,
    specialty: doc.specialization,
    experience: doc.yearsOfExperience,
    location: 'City Center',
    rating: 4.8,
    totalReviews: 120,
    image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
    hospital: doc.hospitalAffiliation || "Private Clinic",
    consultationFee: doc.consultationFee,
  }));
};

function DoctorSearch() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const doctorsPerView = 4;

  // --- REACT QUERY ---
  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ['top-doctors'],
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  const maxIndex = Math.max(0, doctors.length - doctorsPerView);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / doctorsPerView;
      const scrollAmount = cardWidth * doctorsPerView;

      if (direction === 'left') {
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentIndex(newIndex);
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        const newIndex = Math.min(maxIndex, currentIndex + 1);
        setCurrentIndex(newIndex);
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleViewProfile = (doctorId: string) => {
    console.log('Viewing profile for doctor:', doctorId);
  };

  // --- LOADING STATE (SKELETON CAROUSEL) ---
  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <Skeleton className="h-10 w-96 mb-10 bg-slate-200" />
          
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4">
                <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 h-full flex flex-col p-0 overflow-hidden">
                  <div className="p-3 pb-0">
                    <Skeleton className="h-56 w-full rounded-xl bg-slate-200" />
                  </div>
                  <div className="p-5 pt-4 space-y-4 flex-grow">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4 bg-slate-200" />
                      <Skeleton className="h-4 w-1/2 bg-slate-200" />
                    </div>
                    <Skeleton className="h-4 w-2/3 bg-slate-200" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 bg-slate-200" />
                      <Skeleton className="h-6 w-16 bg-slate-200" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-lg bg-slate-200 mt-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- ERROR STATE ---
  if (isError) {
    return (
      <section className="py-20 px-4 bg-white flex justify-center items-center">
         <div className="text-center text-red-500 flex flex-col items-center gap-2">
           <AlertCircle className="h-8 w-8" />
           <p>Failed to load professionals.</p>
         </div>
      </section>
    );
  }

  if (doctors.length === 0) return null;

  // --- MAIN RENDER ---
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          And other top <span className="text-[#0A6EFF]">Professionals.</span>
        </h2>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
              >
                <div className="bg-[#F8FAFC] rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">

                  {/* Image */}
                  <div className="h-56 bg-white rounded-2xl p-3 pb-0">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover rounded-xl object-top"
                    />
                  </div>

                  {/* Info Section */}
                  <div className="flex flex-col px-5 pb-5 pt-4 flex-grow">
                    
                    {/* Name & Specialty */}
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg truncate">
                        {doctor.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[#0A6EFF] text-sm font-medium">
                        <Stethoscope className="h-3 w-3" />
                        {doctor.specialty}
                      </div>
                    </div>

                    {/* Hospital & Location */}
                    <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-4">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{doctor.hospital}</span>
                    </div>

                    {/* Stats: Experience & Fee */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {doctor.experience}+ Yrs
                        </div>
                        <div className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {doctor.consultationFee}
                        </div>
                    </div>

                    {/* Book Button */}
                    <div className="mt-auto">
                      <Link to={`/book/${doctor.id}`}>
                        <button
                          onClick={() => handleViewProfile(doctor.id)}
                          className="w-full h-10 rounded-lg bg-[#0A6EFF] hover:bg-[#2563eb] flex items-center justify-center text-white text-sm font-medium transition gap-2"
                        >
                          Book Now <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          {doctors.length > doctorsPerView && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => scrollCarousel("left")}
                disabled={currentIndex === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${currentIndex === 0
                  ? "border-gray-200 text-gray-300"
                  : "border-gray-300 hover:bg-gray-100"
                  }`}
              >
                <ChevronLeft />
              </button>

              <div className="flex gap-2">
                {Array.from({
                  length: Math.ceil(doctors.length / doctorsPerView),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      if (carouselRef.current) {
                        const cardWidth =
                          carouselRef.current.offsetWidth / doctorsPerView;
                        carouselRef.current.scrollTo({
                          left: index * cardWidth * doctorsPerView,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition ${Math.floor(currentIndex) === index
                      ? "bg-[#0A6EFF]"
                      : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollCarousel("right")}
                disabled={currentIndex >= maxIndex}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${currentIndex >= maxIndex
                  ? "border-gray-200 text-gray-300"
                  : "border-gray-300 hover:bg-gray-100"
                  }`}
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DoctorSearch;