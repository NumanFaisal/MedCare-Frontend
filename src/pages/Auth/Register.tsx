import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AuthLayout from './../../components/layouts/AuthLayout.tsx';
import { signUpSchema, type SignUpFormValues } from '@/schemas/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function SignUp() {
  const [activeTab, setActiveTab] = useState("USER");
  const navigate = useNavigate();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "USER",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      specialization: "",
      licenseNumber: "", // Shared field name, used by both Doctor and Medical
      facilityName: "",
      address: "",
    },
  });

  const onTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("role", value as "USER" | "MEDICAL" | "DOCTOR");
    form.clearErrors();
    // Optional: Reset role-specific fields when switching tabs
    form.setValue("licenseNumber", "");
    form.setValue("specialization", "");
    form.setValue("facilityName", "");
    form.setValue("address", "");
  };

  const onSubmit = async (data: SignUpFormValues) => {
    console.log("Submitting to Backend:", data);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/register", data);
      console.log("Registration success:", response.data);
      toast.success("Account created successfully!");

      if (response.data.user.role === "USER") {
        navigate("/usr");
      } else if (response.data.user.role === "DOCTOR") {
        navigate("/doc");
      } else if (response.data.user.role === "MEDICAL") {
        navigate("/med");
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Select your role to get started">
      <Card className="border-none shadow-xl w-full">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">

            <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/5 h-11">
              {["USER", "MEDICAL", "DOCTOR"].map((role) => (
                <TabsTrigger
                  key={role}
                  value={role}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium capitalize"
                >
                  {role.toLowerCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* First Name & Last Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} className="rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} className="rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="m@example.com" {...field} className="rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="1234567890" {...field} className="rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* --- DOCTOR SECTION --- */}
                {activeTab === "DOCTOR" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-semibold text-primary">Doctor Details</h3>

                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:ring-offset-0">
                                <SelectValue placeholder="Select Specialization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="cardiology">Cardiology</SelectItem>
                              <SelectItem value="dermatology">Dermatology</SelectItem>
                              <SelectItem value="neurology">Neurology</SelectItem>
                              <SelectItem value="general">General Physician</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor's License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="DOC-LIC-12345" {...field} className="rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* --- MEDICAL SECTION --- */}
                {activeTab === "MEDICAL" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 bg-green-50/50 rounded-lg border border-green-100">
                    <h3 className="text-sm font-semibold text-third">Pharmacy / Store Details</h3>

                    <FormField
                      control={form.control}
                      name="facilityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facility Name</FormLabel>
                          <FormControl>
                            <Input placeholder="City Care Pharmacy" {...field} className="rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} className="rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Shop License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="SHOP-LIC-98765" {...field} className="rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="rounded-lg border-gray-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold mt-6 h-11 text-base cursor-pointer">
                  Create Account
                </Button>

              </form>
            </Form>

          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 bg-gray-50/50">
          <button onClick={() => navigate("/login")} className="text-sm text-muted-foreground">
            Already have an account? <span className="text-primary hover:underline cursor-pointer font-medium">Sign in</span>
          </button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}