import { useState, useRef } from "react";
import {  ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";


type DoctorType = {
    id: string;
    name: string;
    specialty: string;
    experience: string;
    location: string;
    rating: number;
    totalReviews: number;
    image: string;
    hospital: string;
    consultationFee: string;
    availability: {
        openTime: string;
        closeTime: string;
        workingDays: string[];
    };
};


function DoctorSearch() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

  // Sample doctor data - in a real app, this would come from an API
    const sampleDoctors: DoctorType[] = [
        {
            id: '1',
            name: 'Dr. Jenny Doe',
            specialty: 'Cardiologist',
            experience: '10+ years',
            location: 'Downtown',
            rating: 4.8,
            totalReviews: 127,
            image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg?semt=ais_hybrid&w=740&q=80',
            hospital: 'City General Hospital',
            consultationFee: '$150',
            availability: {
                openTime: '09:00',
                closeTime: '17:00',
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
        },
        {
            id: '2',
            name: 'Dr. Jenny Doe',
            specialty: 'Dermatologist',
            experience: '8+ years',
            location: 'Midtown',
            rating: 4.6,
            totalReviews: 89,
            image: 'https://img.freepik.com/free-photo/portrait-doctor_144627-39379.jpg?semt=ais_hybrid&w=740&q=80',
            hospital: 'Metro Health Center',
            consultationFee: '$120',
            availability: {
                openTime: '10:00',
                closeTime: '18:00',
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
        },
        {
            id: '3',
            name: 'Dr. Jenny Doe',
            specialty: 'Pediatrician',
            experience: '12+ years',
            location: 'Uptown',
            rating: 4.9,
            totalReviews: 156,
            image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg?semt=ais_hybrid&w=740&q=80',
            hospital: "Children's Medical Center",
            consultationFee: '$100',
            availability: {
                openTime: '08:00',
                closeTime: '16:00',
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
        },
        {
            id: '4',
            name: 'Dr. Jenny Doe',
            specialty: 'Neurologist',
            experience: '15+ years',
            location: 'Uptown',
            rating: 4.9,
            totalReviews: 200,
            image: 'https://img.freepik.com/free-photo/portrait-doctor_144627-39379.jpg?semt=ais_hybrid&w=740&q=80',
            hospital: "City Medical Center",
            consultationFee: '$180',
            availability: {
                openTime: '09:00',
                closeTime: '17:00',
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
        },
        {
            id: '5',
            name: 'Dr. Jenny Doe',
            specialty: 'Neurologist',
            experience: '15+ years',
            location: 'Uptown',
            rating: 4.9,
            totalReviews: 200,
            image: 'https://img.freepik.com/free-photo/portrait-doctor_144627-39379.jpg?semt=ais_hybrid&w=740&q=80',
            hospital: "City Medical Center",
            consultationFee: '$180',
            availability: {
                openTime: '09:00',
                closeTime: '17:00',
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
        },
        {
            id: '6',
            name: 'Dr. Jenny Doe',
            specialty: 'Neurologist',
            experience: '15+ years',
            location: 'Uptown',
            rating: 4.9,
            totalReviews: 200,
            image: 'https://img.freepik.com/free-photo/portrait-doctor_144627-39379.jpg?semt=ais_hybrid&w=740&q=80',
            hospital: "City Medical Center",
            consultationFee: '$180',
            availability: {
                openTime: '09:00',
                closeTime: '17:00',
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
        }
    ];

    const doctorsPerView = 4;
    const maxIndex = Math.max(0, sampleDoctors.length - doctorsPerView);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const cardWidth = carouselRef.current.offsetWidth / doctorsPerView;
            const scrollAmount = cardWidth * doctorsPerView;
            
            if (direction === 'left') {
                setCurrentIndex(Math.max(0, currentIndex - 1));
                carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
                carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

   
   

    const handleViewProfile = (doctorId: string) => {
        console.log('Viewing profile for doctor:', doctorId);
        // In a real app, this would navigate to doctor's profile page
    };

    
    return(
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
        {sampleDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
          >
            <div className="bg-[#F8FAFC] rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">

              {/* Image */}
              <div className="h-64 bg-white rounded-2xl p-3 pb-0">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Info + Button */}
              <div className="flex items-end justify-between px-5 pb-5 pt-4">

                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    MBBS / Dip in psychology
                  </p>
                </div>

                <Link to="/login">
                  <button
                    onClick={() => handleViewProfile(doctor.id)}
                    className="w-11 h-11 rounded-full bg-[#0A6EFF] hover:bg-[#2563eb] flex items-center justify-center shadow-lg transition"
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </Link>
                

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">

        {/* Left */}
        <button
          onClick={() => scrollCarousel("left")}
          disabled={currentIndex === 0}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
            currentIndex === 0
              ? "border-gray-200 text-gray-300"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {Array.from({
            length: Math.ceil(sampleDoctors.length / doctorsPerView),
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
              className={`w-3 h-3 rounded-full transition ${
                Math.floor(currentIndex) === index
                  ? "bg-[#0A6EFF]"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Right */}
        <button
          onClick={() => scrollCarousel("right")}
          disabled={currentIndex >= maxIndex}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
            currentIndex >= maxIndex
              ? "border-gray-200 text-gray-300"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  </div>
</section>

    );
}

export default DoctorSearch;