import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Loader2, ShieldCheck } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";


interface ShopProfileData {
    shopName: string;
    email: string;
    phone: string;
    userUniqueId: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    licenseNumber: string;
    operatingHours: string;
    ownerName: string;
}

function MedProfile () {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<ShopProfileData>({
        shopName: "",
        email: "",
        phone: "",
        userUniqueId: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        licenseNumber: "",
        operatingHours: "",
        ownerName: "",
    });
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Fetch real profile data from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/api/auth/profile");
                const data = response.data;
                const shop = data.medicalShop || {};

                setFormData({
                    shopName: shop.shopName || "",
                    email: data.email || "",
                    phone: shop.phoneNumber || data.phoneNumber || "",
                    userUniqueId: data.userUniqueId || "",
                    address: shop.location || "",
                    city: "",
                    state: "",
                    pincode: "",
                    licenseNumber: shop.licenseNumber || "",
                    operatingHours: "",
                    ownerName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
                });
                setProfileImage(data.profileImageDb || null);
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast("Profile Updated",{
            description: "Your shop information has been updated successfully.",
        });
    };

    const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast("Password Updated",{
            description: "Your password has been changed successfully.",
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
                        <h1 className="text-3xl font-bold">Shop Profile</h1>
                        <p className="text-gray-600 mt-1">View and update your medical shop information</p>
                    </div>
                    {/* User Unique ID Display & PFP */}
                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4">
                        {formData.userUniqueId && (
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 h-fit">
                                <ShieldCheck className="h-5 w-5 text-blue-600" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-blue-600 font-semibold uppercase">Shop ID</span>
                                    <span className="font-mono font-bold text-blue-900">{formData.userUniqueId}</span>
                                </div>
                            </div>
                        )}
                        {/* Image Upload Component */}
                        <ImageUpload currentImageUrl={profileImage} onUploadSuccess={(url) => setProfileImage(url)} />
                    </div>
                </div>


                <Tabs defaultValue="shop">
                    <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-3">
                        <TabsTrigger value="shop">Shop Information</TabsTrigger>
                        <TabsTrigger value="license">License Details</TabsTrigger>
                        <TabsTrigger value="security">Account Security</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="shop" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shop Information</CardTitle>
                                <CardDescription>
                                    Update your shop details and contact information
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleProfileUpdate}>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="shopName">Shop Name</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="shopName" value={formData.shopName} onChange={handleInputChange} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="email" type="email" value={formData.email} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="phone" value={formData.phone} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Street Address</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="address" value={formData.address} onChange={handleInputChange} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="city" value={formData.city} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="state" value={formData.state} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pincode">Zip Code</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="pincode" value={formData.pincode} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="operatingHours">Operating Hours</Label>
                                        <Textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="operatingHours" value={formData.operatingHours} onChange={handleInputChange} rows={3} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="ownerName">Owner/Manager Name</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="ownerName" value={formData.ownerName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button className="border bg-white text-primary hover:bg-primary hover:text-white mt-4 " type="submit">Save Changes</Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="license" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>License Information</CardTitle>
                                <CardDescription>
                                    View your pharmacy license details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>License Number</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={formData.licenseNumber} readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Shop ID</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono" value={formData.userUniqueId} readOnly />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Security</CardTitle>
                                <CardDescription>
                                    Update your password to keep your account secure
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handlePasswordUpdate}>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="currentPassword" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="newPassword" type="password" value={passwords.newPassword} onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="confirmPassword" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button className="border bg-white text-primary hover:bg-primary hover:text-white mt-4" type="submit">Update Password</Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default MedProfile;