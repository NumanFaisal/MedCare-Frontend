import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { 
  ChevronLeft, ChevronRight, ArrowRight, 
  Star, MapPin 
} from 'lucide-react';

type DoctorType = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  location: string;
  rating: number;
  totalReviews: number;
  image: string | null;
  hospital: string;
  consultationFee: number;
};

const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const fetchDoctors = async (): Promise<DoctorType[]> => {
  const response = await api.get("/api/users/doctors");
  return response.data.map((doc: any) => ({
    id: doc.id.toString(),
    name: `Dr. ${doc.user.firstName} ${doc.user.lastName}`,
    specialty: doc.specialization,
    experience: doc.yearsOfExperience,
    location: doc.hospitalAffiliation || "Private Clinic",
    rating: doc.averageRating || 0,
    totalReviews: doc.totalReviews || 0,
    image: doc.user?.profileImageDb || null,
    hospital: doc.hospitalAffiliation || "Private Clinic",
    consultationFee: doc.consultationFee,
  }));
};

function DoctorSearch() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const doctorsPerView = 4;

  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ['top-doctors'],
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 10,
  });

  const maxIndex = Math.max(0, doctors.length - doctorsPerView);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / doctorsPerView;
      if (direction === 'left') {
        setCurrentIndex(prev => Math.max(0, prev - 1));
        carouselRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      } else {
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
        carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }
  };

  if (isLoading) return <div className="h-96 flex items-center justify-center text-slate-400 font-medium">Loading Professionals...</div>;
  if (isError) return null;

  return (
    <section className="py-20 px-6 bg-white font-sans">
      <div className="container mx-auto max-w-7xl">
        
        {/* Title based on your image */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 tracking-tight">
          And other top <span className="text-[#0A6EFF]">Professionals.</span>
        </h2>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth pb-10"
          >
            {doctors.map((doctor) => (
              <div 
                key={doctor.id} 
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                {/* White Rounded Card Layout */}
                <div className="bg-[#F8FAFC] rounded-[32px] p-4 border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-300 group">
                  
                  {/* Square Image with high-quality rounded corners */}
                  <div className="aspect-square w-full rounded-[24px] overflow-hidden mb-5 shadow-sm">
                    <img
                      src={doctor.image || DEFAULT_AVATAR}
                      alt={doctor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content Area */}
                  <div className="px-1 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow pr-2">
                        <h3 className="text-[17px] font-bold text-slate-900 leading-tight truncate">
                          {doctor.name}
                        </h3>
                        <p className="text-slate-400 text-[11px] font-semibold mt-1 uppercase tracking-wider">
                          {doctor.specialty}
                        </p>
                        
                        {/* Real Details Stack */}
                        <div className="space-y-1.5 mt-3">
                           <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-[#0A6EFF] shrink-0" />
                              <span className="truncate">{doctor.hospital}</span>
                           </div>
                           <div className="flex items-center gap-3 mt-2">
                              <span className="text-[11px] font-bold bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm">
                                {doctor.experience} Yrs Exp.
                              </span>
                              <span className="text-[12px] font-bold text-[#0A6EFF]">
                                ₹{doctor.consultationFee}
                              </span>
                           </div>
                        </div>
                      </div>

                      {/* Default Blue Action Button */}
                      <Link 
                        to={`/book/${doctor.id}`}
                        className="bg-[#0A6EFF] hover:bg-[#085ad4] text-white p-3 rounded-2xl transition-all shadow-md hover:shadow-blue-200 active:scale-90 flex-shrink-0"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>

                    {/* Bottom Rating Info */}
                    <div className="flex items-center gap-1 mt-5 pt-3 border-t border-slate-100">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-[12px] font-bold text-slate-800">
                        {doctor.rating > 0 ? doctor.rating.toFixed(1) : "New"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium ml-auto">
                        {doctor.totalReviews} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls in Blue */}
          <div className="flex items-center gap-4 mt-4 px-2">
            <button 
              onClick={() => scrollCarousel('left')}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            
            {/* Pagination Dots (Blue) */}
            <div className="flex gap-2">
              {Array.from({ length: Math.min(Math.ceil(doctors.length / doctorsPerView), 5) }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'w-5 bg-[#0A6EFF]' : 'w-1.5 bg-slate-200'
                  }`} 
                />
              ))}
            </div>

            <button 
              onClick={() => scrollCarousel('right')}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorSearch;