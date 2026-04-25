import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";

function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
            
            toast.success("Message sent!", {
                description: response.data.message || "We'll get back to you as soon as possible.",
            });
            
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (error: any) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message", {
                description: error.response?.data?.error || "Please try again later.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Contact <span className="bg-gradient-to-r from-[#0A6EFF] to-[#7E69AB] bg-clip-text text-transparent">Us</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have questions about MedCare? We're here to help you navigate your healthcare journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="md:col-span-2">
                            <div className="bg-white shadow-xl shadow-blue-100/50 rounded-2xl p-6 md:p-10 border border-gray-100">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                                            <Input 
                                                id="firstName" 
                                                placeholder="John" 
                                                required 
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                                            <Input 
                                                id="lastName" 
                                                placeholder="Doe" 
                                                required 
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            placeholder="john.doe@example.com" 
                                            required 
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</Label>
                                        <Input 
                                            id="subject" 
                                            placeholder="How can we help you?" 
                                            required 
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                                        <Textarea
                                            id="message" 
                                            placeholder="Please describe your question or issue in detail..." 
                                            className="min-h-[150px] focus:ring-2 focus:ring-blue-500"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-[#0A6EFF] to-[#2563eb] text-white py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-200"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-5 w-5" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center group hover:border-blue-200 transition-colors">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Phone className="text-blue-600 w-7 h-7"/>
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-gray-900">Call Us</h3>
                                <p className="text-gray-600">+1 (555) 123-4567</p>
                                <p className="text-sm text-gray-400 mt-1">Mon-Fri: 9am - 6pm</p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center group hover:border-purple-200 transition-colors">
                                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Mail className="text-purple-600 w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-gray-900">Email Us</h3>
                                <p className="text-gray-600">support@medcare.com</p>
                                <p className="text-sm text-gray-400 mt-1">24/7 Response Time</p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center group hover:border-green-200 transition-colors">
                                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <MapPin className="text-green-600 w-7 h-7"/>
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-gray-900">Visit Us</h3>
                                <p className="text-gray-600">123 Health Street<br />Medical District, CA 90210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;