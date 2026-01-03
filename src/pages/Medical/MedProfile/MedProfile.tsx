import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";


function MedProfile () {

    //Sample medical shop data
    const shop = {
        id: "MS123456",
        name: "City Pharamcy",
        email: "thor.citypyharmacy@gmail.com",
        phone: "995289****",
        address: "Road no 14",
        city: "Jamshedpur",
        state: "Jharkhand",
        pincode: "832110",
        licenseNumber: "PL78901234",
        licenseExpiry: "2026-12-31",
        operatingHours: "Mon-Sat: 8:00 AM - 9:00 PM, Sun: 10:00 AM - 6:00 PM",
        ownerName: "Thor Kumar",
        established: "2010"
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

    return (
        <div>
            <Toaster />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Shop Profile</h1>
                    <p className="text-gray-600 mt-1">View and update your medical shop information</p>
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
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"  id="shopName" defaultValue={shop.name} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="email" type="email" defaultValue={shop.email} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="phone" defaultValue={shop.phone} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Street Address</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="address" defaultValue={shop.address} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="city" defaultValue={shop.city} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="state" defaultValue={shop.state} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipCode">Zip Code</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="zipCode" defaultValue={shop.pincode} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="operatingHours">Operating Hours</Label>
                                        <Textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="operatingHours" defaultValue={shop.operatingHours} rows={3} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="ownerName">Owner/Manager Name</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="ownerName" defaultValue={shop.ownerName} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="established">Year Established</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="established" defaultValue={shop.established} />
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
                                <CardTitle>License Details</CardTitle>
                                <CardDescription>
                                Update your pharmacy license information
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleProfileUpdate}>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="licenseNumber">License Number</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="licenseNumber" defaultValue={shop.licenseNumber} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                                            <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="licenseExpiry" type="date" defaultValue={shop.licenseExpiry} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="licenseDocument">Upload License Document</Label>
                                        <Input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" id="licenseDocument" type="file" />
                                        <p className="text-sm text-gray-500 mt-1">Upload a scanned copy of your pharmacy license (PDF or image file)</p>
                                    </div>
                                    
                                    <div className="bg-primary-light/30 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">License Requirements</h4>
                                        <ul className="space-y-1 text-sm list-disc list-inside">
                                            <li>Valid pharmacy license issued by state board</li>
                                            <li>License must be current and non-expired</li>
                                            <li>License holder name must match shop owner/manager</li>
                                            <li>Address on license must match shop address</li>
                                        </ul>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button className="border bg-white text-primary hover:bg-primary hover:text-white mt-4 " type="submit">Update License Information</Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="security" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Security</CardTitle>
                                <CardDescription>
                                    Update your password and security preferences
                                </CardDescription>
                            </CardHeader>
                                <form onSubmit={handlePasswordUpdate}>
                                    <CardContent className="space-y-6">
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
                                        
                                        <div className="bg-primary-light/30 p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">Password Requirements</h4>
                                            <ul className="space-y-1 text-sm list-disc list-inside">
                                                <li>Minimum 8 characters</li>
                                                <li>At least one uppercase letter</li>
                                                <li>At least one number</li>
                                                <li>At least one special character (!@#$%^&*)</li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button className="border bg-white text-primary hover:bg-primary hover:text-white mt-4 " type="submit">Update Password</Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>
                    </Tabs>
            </div>
        </div>
    )
}

export default MedProfile;