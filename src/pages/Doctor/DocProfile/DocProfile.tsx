import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Removed local Toaster to use the one in App.tsx

function DocProfile() {
    // Sample doctor data
    const doctor = {
        id: "D123456",
        firstName: "Shah",
        lastName: "Faisal",
        email: "dr.shah@example.com",
        phone: "9923423623",
        specialization: "Cardiologist",
        licenseNumber: "MED12345",
        hospitalAffiliation: "Tata Main Hospital",
        education: "Harvard Medical School, MD",
        experience: "15 years",
        languages: "English, Hindi",
        consultationFee: "Rs.500",
        bio: "Dr. Shah Faisal is a board-certified cardiologist with over 15 years of experience in treating heart conditions."
    };

    const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.success("Profile Updated", {
            description: "Your profile information has been updated successfully.",
        });
    };

    const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.success("Password Updated", {
            description: "Your password has been changed successfully.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
                <p className="text-gray-600 mt-1">View and update your professional information</p>
            </div>

            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="bg-gray-100 p-1 px-5 rounded-full">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="professional">Professional Info</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6 animate-in fade-in-50">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details and contact information</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleProfileUpdate}>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="firstName" defaultValue={doctor.firstName} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="lastName" defaultValue={doctor.lastName} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="email" type="email" defaultValue={doctor.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="phone" defaultValue={doctor.phone} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Professional Bio</Label>
                                    <Textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="bio" defaultValue={doctor.bio} rows={5} />
                                    <p className="text-xs text-gray-500">Visible to patients on your public profile</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="languages">Languages Spoken</Label>
                                    <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="languages" defaultValue={doctor.languages} />
                                </div>
                            </CardContent>
                            <CardFooter className="px-6 py-4 flex justify-end">
                                <Button className="bg-primary text-white hover:bg-primary/90" type="submit">Save Changes</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="professional" className="mt-6 animate-in fade-in-50">
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Qualifications</CardTitle>
                            <CardDescription>Manage your certifications and clinical details</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleProfileUpdate}>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="specialization">Specialization</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="specialization" defaultValue={doctor.specialization} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="licenseNumber">License Number</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="licenseNumber" defaultValue={doctor.licenseNumber} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hospitalAffiliation">Hospital Affiliation</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="hospitalAffiliation" defaultValue={doctor.hospitalAffiliation} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Years of Experience</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="experience" defaultValue={doctor.experience} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="education">Education</Label>
                                    <Textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="education" defaultValue={doctor.education} rows={3} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="consultationFee">Consultation Fee</Label>
                                    <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="consultationFee" defaultValue={doctor.consultationFee} />
                                </div>
                            </CardContent>
                            <CardFooter className=" px-6 py-4 flex justify-end">
                                <Button className="bg-primary text-white hover:bg-primary/90" type="submit">Update Professional Info</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6 animate-in fade-in-50 ">
                    <Card className="border shadow-xl">
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Keep your account secure with a strong password</CardDescription>
                        </CardHeader>
                        <form onSubmit={handlePasswordUpdate}>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="currentPassword" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="newPassword" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="confirmPassword" type="password" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className=" px-6 py-4 flex justify-end">
                                <Button className="bg-primary text-white hover:bg-primary/90" type="submit">Update Password</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default DocProfile;