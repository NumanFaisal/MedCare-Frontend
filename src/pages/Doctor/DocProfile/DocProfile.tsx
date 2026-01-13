import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

// Define the shape of the profile data
interface DoctorProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  hospitalAffiliation: string;
  education: string;
  experience: string;
  languages: string;
  consultationFee: string;
  bio: string;
}

function DocProfile() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<DoctorProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    hospitalAffiliation: "",
    education: "",
    experience: "",
    languages: "",
    consultationFee: "",
    bio: "",
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // --- 1. FETCH PROFILE DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        // Assuming there is a GET endpoint to retrieve the current profile
        const response = await axios.get("http://localhost:4000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = response.data.user || {};
        const doctor = response.data.doctor || {};

        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          specialization: doctor.specialization || "",
          licenseNumber: doctor.licenseNumber || "",
          hospitalAffiliation: doctor.hospitalAffiliation || "",
          education: doctor.education || "", // Ensure backend sends this or create a field
          experience: doctor.experience || "",
          languages: doctor.languages || "",
          consultationFee: doctor.consultationFee || "",
          bio: doctor.bio || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- 2. INPUT HANDLERS ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswords(prev => ({ ...prev, [id]: value }));
  };

  // --- 3. SUBMIT HANDLERS ---
  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch("http://localhost:4000/api/profile/update", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Profile Updated", {
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/users/change-password", {
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Password Updated", {
        description: "Your password has been changed successfully.",
      });
      
      // Clear password fields
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

        {/* --- PERSONAL INFO TAB --- */}
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
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10 bg-gray-50" 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      readOnly // Usually email changes require separate verification
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="bio" 
                    value={formData.bio} 
                    onChange={handleInputChange} 
                    rows={5} 
                  />
                  <p className="text-xs text-gray-500">Visible to patients on your public profile</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages Spoken</Label>
                  <Input 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="languages" 
                    value={formData.languages} 
                    onChange={handleInputChange} 
                  />
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 flex justify-end">
                <Button className="bg-primary text-white hover:bg-primary/90" type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* --- PROFESSIONAL INFO TAB --- */}
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
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="specialization" 
                      value={formData.specialization} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="licenseNumber" 
                      value={formData.licenseNumber} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalAffiliation">Hospital Affiliation</Label>
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="hospitalAffiliation" 
                      value={formData.hospitalAffiliation} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="experience" 
                      value={formData.experience} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Textarea 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="education" 
                    value={formData.education} 
                    onChange={handleInputChange} 
                    rows={3} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationFee">Consultation Fee</Label>
                  <Input 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                    id="consultationFee" 
                    value={formData.consultationFee} 
                    onChange={handleInputChange} 
                  />
                </div>
              </CardContent>
              <CardFooter className=" px-6 py-4 flex justify-end">
                <Button className="bg-primary text-white hover:bg-primary/90" type="submit">Update Professional Info</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* --- SECURITY TAB --- */}
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
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="currentPassword" 
                      type="password" 
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="newPassword" 
                      type="password" 
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" 
                      id="confirmPassword" 
                      type="password" 
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                    />
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