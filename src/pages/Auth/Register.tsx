import React, { useState } from "react";
import { Link } from "react-router-dom";

type AccountType = "patient" | "doctor" | "medical";

const Register: React.FC = () => {
    const [role, setRole] = useState<AccountType | null>(null);
    const [tempRole, setTempRole] = useState<AccountType>("patient");
    const [isModalOpen, setIsModalOpen] = useState(true);

    // Form states
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        medicalLicense: "",
        specialization: "",
        shopName: "",
        address: "",
        phone: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProceed = () => {
        setRole(tempRole);
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Registering as:", role, formData);
        // Add registration logic here
    };

    const InputField = ({
        label,
        name,
        type = "text",
        placeholder,
        className = "",
    }: {
        label: string;
        name: string;
        type?: string;
        placeholder?: string;
        className?: string;
    }) => (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9b87f5]"
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-linear-to-br from-[#E5DEFF] to-[#FDE1D3]">
            {/* Logo */}
            <div className="w-full p-4 z-10">
                <Link to="/" className="flex items-center space-x-2 w-fit">
                    <div className="w-8 h-8 bg-[#9b87f5] rounded-lg flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            <path d="M3.22 12H9.5l.5-1 2 4 .5-1h6.78" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
                        MedCare
                    </span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
                {!isModalOpen && role && (
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 sm:p-8 animate-fade-in mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                                Create your {role === "medical" ? "Medical Shop" : role.charAt(0).toUpperCase() + role.slice(1)} Account
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                Join MedCare to manage your healthcare journey
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Patient Form */}
                            {role === "patient" && (
                                <>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <InputField label="First Name" name="firstName" placeholder="John" className="flex-1" />
                                        <InputField label="Last Name" name="lastName" placeholder="Doe" className="flex-1" />
                                    </div>
                                    <InputField label="Email" name="email" type="email" placeholder="john@example.com" />
                                    <InputField label="Password" name="password" type="password" placeholder="••••••••" />
                                    <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" />
                                </>
                            )}

                            {/* Doctor Form */}
                            {role === "doctor" && (
                                <>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <InputField label="First Name" name="firstName" placeholder="Dr. John" className="flex-1" />
                                        <InputField label="Last Name" name="lastName" placeholder="Doe" className="flex-1" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <InputField label="Email" name="email" type="email" placeholder="doctor@hospital.com" className="flex-[2]" />
                                        <InputField label="Age" name="age" type="number" placeholder="35" className="flex-1" />
                                    </div>
                                    <InputField label="Medical License Number" name="medicalLicense" placeholder="LIC-12345678" />
                                    <InputField label="Specialization" name="specialization" placeholder="Cardiologist" />
                                    <InputField label="Password" name="password" type="password" placeholder="••••••••" />
                                    <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" />
                                </>
                            )}

                            {/* Medical Shop Form */}
                            {role === "medical" && (
                                <>
                                    <InputField label="Shop Name" name="shopName" placeholder="City Pharmacy" />
                                    <InputField label="Email" name="email" type="email" placeholder="shop@pharmacy.com" />
                                    <InputField label="Address" name="address" placeholder="123 Main St, City" />
                                    <InputField label="Phone Number" name="phone" type="tel" placeholder="+1 234 567 8900" />
                                    <InputField label="Password" name="password" type="password" placeholder="••••••••" />
                                    <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" />
                                </>
                            )}

                            <button type="submit" className="w-full bg-[#9b87f5] text-white rounded-lg py-3 font-medium hover:bg-[#9b87f5]/90 transition-colors mt-6">
                                Create Account
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-[#9b87f5] hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Role Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                            Select Account Type
                        </h3>

                        <div className="space-y-3 mb-6">
                            {[
                                { id: "patient", label: "Patient", desc: "For personal health management" },
                                { id: "doctor", label: "Doctor", desc: "For medical professionals" },
                                { id: "medical", label: "Medical Shop", desc: "For pharmacy owners" },
                            ].map((type) => (
                                <label
                                    key={type.id}
                                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${tempRole === type.id
                                        ? "border-[#9b87f5] bg-[#9b87f5]/5"
                                        : "border-gray-200 hover:border-[#9b87f5]/50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={type.id}
                                        checked={tempRole === type.id}
                                        onChange={(e) => setTempRole(e.target.value as AccountType)}
                                        className="w-4 h-4 text-[#9b87f5] focus:ring-[#9b87f5]"
                                    />
                                    <div className="ml-3">
                                        <span className="block font-medium text-gray-800">{type.label}</span>
                                        <span className="block text-xs text-gray-500">{type.desc}</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <button
                            onClick={handleProceed}
                            className="w-full bg-[#9b87f5] text-white rounded-lg py-2.5 font-medium hover:bg-[#9b87f5]/90 transition-colors"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
