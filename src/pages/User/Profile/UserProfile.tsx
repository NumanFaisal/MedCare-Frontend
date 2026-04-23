import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";

// Define the shape of our form data
interface UserProfileData {
  // User Table Fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userUniqueId: string;

  // Patient/Profile Table Fields
  dateOfBirth: string;
  age: string;
  gender: string;
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  currentMedications: string;
  bloodPressure: string;
  heartRate: string;
  bloodSugar: string;
}

function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize state with empty strings to avoid uncontrolled input warnings
  const [formData, setFormData] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userUniqueId: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    currentMedications: "",
    bloodPressure: "",
    heartRate: "",
    bloodSugar: ""
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // --- 1. FETCH USER DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/auth/profile");

        const data = response.data;
        const profile = data.patient || {};

        setFormData({
          // User Basic Info
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phoneNumber || "",
          userUniqueId: data.userUniqueId || "N/A",

          // Patient Profile Info
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
          age: profile.age != null ? String(profile.age) : "",
          gender: profile.gender || "",
          streetAddress: profile.streetAddress || "",
          city: profile.city || "",
          state: profile.state || "",
          pinCode: profile.zipCode || "",
          emergencyContact: profile.emergencyContact?.name || profile.emergencyContact || "",
          emergencyPhone: profile.emergencyContact?.phone || "",
          bloodType: profile.bloodType || "",
          allergies: Array.isArray(profile.allergies) ? profile.allergies.join(", ") : (profile.allergies || ""),
          medicalConditions: Array.isArray(profile.medicalConditions) ? profile.medicalConditions.join(", ") : (profile.medicalConditions || ""),
          currentMedications: Array.isArray(profile.currentMedications) ? profile.currentMedications.join(", ") : (profile.currentMedications || ""),
          bloodPressure: profile.bloodPressure || "",
          heartRate: profile.heartRate || "",
          bloodSugar: profile.bloodSugar || ""
        });

        setProfileImage(data.profileImageDb || null);

      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- 2. AUTOMATIC AGE CALCULATION ---
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      
      // Basic validation: ignore future dates
      if (birthDate > today) return;

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age >= 0 && String(age) !== formData.age) {
        setFormData(prev => ({ ...prev, age: String(age) }));
      }
    }
  }, [formData.dateOfBirth]);

  // --- 3. HANDLE INPUT CHANGE ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // --- 3. SUBMIT UPDATES ---
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {

      const payload = {
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        gender: formData.gender || undefined,
        streetAddress: formData.streetAddress,
        state: formData.state,
        city: formData.city,
        zipCode: formData.pinCode,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        bloodType: formData.bloodType,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
        medicalConditions: formData.medicalConditions ? formData.medicalConditions.split(',').map(s => s.trim()) : [],
        currentMedications: formData.currentMedications ? formData.currentMedications.split(',').map(s => s.trim()) : [],
        bloodPressure: formData.bloodPressure || undefined,
        heartRate: formData.heartRate || undefined,
        bloodSugar: formData.bloodSugar || undefined,
      };

      await api.patch("/api/profile/update", payload);

      toast.success("Profile Updated", {
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.info("Password Update", {
      description: "Password update endpoint needs to be connected.",
    });
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

   return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-gray-600 mt-1">View and update your personal information</p>
          </div>
          {/* User Unique ID Display & PFP */}
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 h-fit">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <div className="flex flex-col">
                <span className="text-xs text-blue-600 font-semibold uppercase">Patient ID</span>
                <span className="font-mono font-bold text-blue-900">{formData.userUniqueId}</span>
              </div>
            </div>
            {/* Image Upload Component */}
            <ImageUpload currentImageUrl={profileImage} onUploadSuccess={(url) => setProfileImage(url)} />
          </div>
        </div>

        <Tabs defaultValue="personal">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-3">
            <TabsTrigger className="shadow-sm" value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* --- TAB 1: PERSONAL INFO --- */}
          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Personal Information</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        className="w-full" id="firstName"
                        value={formData.firstName} disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        className="w-full" id="lastName"
                        value={formData.lastName} disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        className="w-full" id="email"
                        value={formData.email} disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        className="w-full" id="phone"
                        value={formData.phone} disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        type="date"
                        className="w-full" id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="w-full" id="age"
                        placeholder="e.g. 28"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <div className="relative">
                        <select
                          id="gender"
                          value={formData.gender}
                          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input
                        className="w-full" id="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-1 md:col-span-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          className="w-full" id="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          className="w-full" id="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pinCode">Pin Code</Label>
                        <Input
                          className="w-full" id="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-medium pb-2">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                      <div className="space-y-2 pb-2 ">
                        <Label className="text-gray-600" htmlFor="emergencyContact">Contact Name</Label>
                        <Input
                          className="w-full" id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2 ">
                        <Label className="text-gray-600" htmlFor="emergencyPhone">Contact Phone</Label>
                        <Input
                          className="w-full" id="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end mt-4">
                  <Button className="border bg-primary text-white hover:bg-primary/90" type="submit" disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* --- TAB 2: MEDICAL INFO --- */}
          <TabsContent value="medical" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>
                  Add your medical details for better healthcare
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-6">

                  {/* Vital Signs */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">Vital Signs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodPressure">Blood Pressure</Label>
                        <Input
                          className="w-full" id="bloodPressure"
                          value={formData.bloodPressure}
                          onChange={handleInputChange}
                          placeholder="e.g. 120/80"
                        />
                        <p className="text-xs text-gray-400">mmHg (systolic/diastolic)</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="heartRate">Heart Rate</Label>
                        <Input
                          className="w-full" id="heartRate"
                          value={formData.heartRate}
                          onChange={handleInputChange}
                          placeholder="e.g. 72"
                        />
                        <p className="text-xs text-gray-400">Beats per minute (bpm)</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodSugar">Blood Sugar</Label>
                        <Input
                          className="w-full" id="bloodSugar"
                          value={formData.bloodSugar}
                          onChange={handleInputChange}
                          placeholder="e.g. 90"
                        />
                        <p className="text-xs text-gray-400">mg/dL (fasting)</p>
                      </div>
                    </div>
                  </div>

                  {/* General Medical Info */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">General Medical Info</h3>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type</Label>
                        <div className="relative">
                          <select
                            id="bloodType"
                            value={formData.bloodType}
                            onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value }))}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
                          >
                            <option value="">Select blood type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        <Input
                          className="w-full" id="allergies"
                          value={formData.allergies}
                          onChange={handleInputChange}
                          placeholder="e.g. Penicillin, Peanuts"
                        />
                        <p className="text-xs text-gray-400">Separate multiple allergies with commas</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="medicalConditions">Medical Conditions</Label>
                        <Input
                          className="w-full" id="medicalConditions"
                          value={formData.medicalConditions}
                          onChange={handleInputChange}
                          placeholder="e.g. Diabetes, Hypertension"
                        />
                        <p className="text-xs text-gray-400">Separate multiple conditions with commas</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentMedications">Current Medications</Label>
                        <Input
                          className="w-full" id="currentMedications"
                          value={formData.currentMedications}
                          onChange={handleInputChange}
                          placeholder="e.g. Metformin 500mg, Aspirin"
                        />
                        <p className="text-xs text-gray-400">Separate multiple medications with commas</p>
                      </div>
                    </div>
                  </div>

                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="border bg-primary text-white hover:bg-primary/90" type="submit" disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* --- TAB 3: SECURITY --- */}
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Update your password and security preferences
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordUpdate}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input className="w-full" id="currentPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input className="w-full" id="newPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input className="w-full" id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="border bg-primary text-white mt-4 hover:bg-primary/90" type="submit">Update Password</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default UserProfile;