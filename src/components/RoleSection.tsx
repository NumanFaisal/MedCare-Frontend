import { Button } from "../components/ui/button"
import { ArrowRight } from "lucide-react"

function RoleSection() {
    const roles = [
        {
            title: "For Patients",
            heading: "Empowering Patients",
            description: "Access your medical records, receive digital prescriptions, and connect with healthcare providers all in one place. Our platform puts you in control of your health journey with easy-to-use tools designed for modern healthcare needs.",
            overlayTitle: "Your Health, Your Control",
            overlayDescription: "MedCare empowers patients with seamless access to medical records, digital prescriptions, and direct communication with healthcare providers.",
            features: [
                "Store and access mmedical history",
                "Recive digital prescriptions",
                "Message your doctors directly",
                "Find nearby medical shops"
            ],
            buttonText: "Join as Patient",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1780&auto=format&fit=crop"
        },
        {
            title: "For Doctors",
            heading: "Streamline Your Practice",
            description: "Manage your patients, issue digital prescriptions, and streamline your practice with advanced tools. Our platform helps you deliver exceptional care while reducing administrative burden and improving patient outcomes.",
            overlayTitle: "Practice Made Simple",
            overlayDescription: "MedCare provides doctors with powerful tools to manage patients, issue prescriptions, and enhance care delivery efficiency.",
            buttonText: "Register as Doctor",
            image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=2072&auto=format&fit=crop"
        },
        {
            title: "For Medical Shops",
            heading: "Connect & Serve Better",
            description: "Receive digital prescriptions, verify authenticity, and provide better service to your customers. Our platform connects you directly with doctors and patients, streamlining your operations and improving customer satisfaction.",
            overlayTitle: "Seamless Pharmacy Integration",
            overlayDescription: "MedCare connects medical shops with doctors and patients, enabling digital prescription verification and streamlined operations.",
            buttonText: "Register Medical Shop",
            image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2069&auto=format&fit=crop"
        }
    ]

    return (
        <section className="py-12 px-4 bg-white">
            <div className="container mx-auto max-w-7xl">
                <div className="space-y-24">
                    <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-5">
                        <span className="bg-gradient-to-r from-[#0A6EFF] to-[#0A6EFF] bg-clip-text text-transparent">Join</span> in MedCare
                    </h1>
                    <p className="text-lg  text-gray-600 mb-8">
                        MedCare offers customized experiences for patients, doctors, and medical shops,<br /> each with features designed specifically for their needs.
                    </p>
                </div>
                    {roles.map((role, index) => (
                        <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Column - Text Content */}
                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    {role.heading}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                    {role.description}
                                </p>
                            </div>

                            {/* Right Column - Image Card */}
                            <div className="relative">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                    {/* Image */}
                                    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
                                        <img 
                                            src={role.image} 
                                            alt={role.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                        
                                        {/* Overlay Text */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                                {role.overlayTitle}
                                            </h3>
                                            <p className="text-white/90 text-base md:text-lg mb-6 max-w-lg">
                                                {role.overlayDescription}
                                            </p>
                                            
                                            {/* Button */}
                                            <div className="flex justify-end">
                                                
                                                <Button 
                                                    className="bg-[#0A6EFF] hover:bg-[#2563eb] text-white px-6 py-6 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                                >
                                                    {role.buttonText}
                                                    <ArrowRight className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}



export default RoleSection