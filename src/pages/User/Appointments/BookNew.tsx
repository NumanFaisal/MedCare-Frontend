import { useState } from "react";
import { doctors } from "../../../services/doctorData";
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
import { Search, Filter, MapPin, Clock, IndianRupee } from "lucide-react";

export default function BookNew() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSpecialization, setFilterSpecialization] = useState("all");

    // Get unique specializations for the filter
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
            <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search doctors, specializations, clinics..."
                        className="pl-9"
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
                        <SelectContent className="bg-white border rounded-lg border-gray-100">
                            {specializations.map((spec) => (
                                <SelectItem key={spec} value={spec}>
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
                        <Card key={doctor.id} className="overflow-hidden flex flex-col">
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
                                <Button className="w-full" size="lg">
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
