import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Changed from next/navigation

// Assuming you have this type defined, otherwise use an interface
export interface DoctorType {
    id: string;
    name: string;
    specialty: string;
    experience: string;
    location: string;
    hospital: string;
    rating: number;
    totalReviews: number;
    imageUrl?: string;
}

interface DoctorCardProps {
    doctor: DoctorType;
    onBookAppointment?: (doctorId: string) => void;
    onViewProfile?: (doctorId: string) => void;
}

function DoctorCard({ doctor, onBookAppointment, onViewProfile }: DoctorCardProps) {
    const navigate = useNavigate();

    const handleBookAppointment = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event
        if (onBookAppointment) {
            onBookAppointment(doctor.id);
        } else {
            // Updated to use React Router navigation
            navigate(`/user/book-appointment/${doctor.id}`);
        }
    };

    const handleViewProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onViewProfile) {
            onViewProfile(doctor.id);
        } else {
            // Updated to use React Router navigation
            navigate(`/user/doctor-profile/${doctor.id}`);
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <img
                        src={doctor.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=2070&auto=format&fit=crop"}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/10"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {doctor.name}
                        </h3>
                        <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
                        
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{doctor.experience}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{doctor.location}</span>
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-1">{doctor.hospital}</p>
                        
                        <div className="flex items-center mt-3">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                            star <= Math.floor(doctor.rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600 font-medium">
                                {doctor.rating.toFixed(1)} <span className="text-gray-400 font-normal">({doctor.totalReviews})</span>
                            </span>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                            <Button
                                size="sm"
                                onClick={handleViewProfile}
                                variant="outline"
                                className="border-gray-300 hover:bg-secondary/10 flex-1 sm:flex-none"
                            >
                                View Profile
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleBookAppointment}
                                className="bg-primary text-white hover:bg-primary/90 flex-1 sm:flex-none"
                            >
                                Book Now
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default DoctorCard;