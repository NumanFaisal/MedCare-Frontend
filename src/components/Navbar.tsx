import { Link } from "react-router-dom";
import { Stethoscope, User, X, Menu, ChevronDown, UserCircle, Pill } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useState } from 'react';

function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b-2 border-gray-100">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center">
                
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0A6EFF] to-[#2563eb] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <Stethoscope className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#0A6EFF] to-[#7E69AB] bg-clip-text text-transparent">
                            MedCare
                        </span>
                        <span className="text-xs text-gray-500 -mt-1">Healthcare Platform</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex justify-around items-center space-x-8">
                    <Link to="/about" className="relative inline-block text-gray-700 font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0A6EFF] after:transition-all after:duration-300 hover:after:w-full hover:text-[#0A6EFF]">
                        About
                    </Link>
                    <Link to="/features" className="relative inline-block text-gray-700 font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0A6EFF] after:transition-all after:duration-300 hover:after:w-full hover:text-[#0A6EFF]">
                        Features
                    </Link>
                    <Link to="/contact" className="relative inline-block text-gray-700 font-medium after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#0A6EFF] after:transition-all after:duration-300 hover:after:w-full hover:text-[#0A6EFF]">
                        Contact
                    </Link>

                    {/* Sign In Dropdown */}
                    <div className="relative">
                        <Button 
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0A6EFF] to-[#2563eb] hover:from-[#2563eb] hover:to-[#0A6EFF] text-white rounded-lg shadow-md transition-all duration-300"
                            onClick={() => setIsUserDropdownOpen(prev => !prev)}
                        >
                            <User className="w-4 h-4" />
                            <span className="font-medium">Sign In</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                        </Button>

                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl overflow-hidden shadow-2xl z-50 border border-gray-100">
                                <div className="py-2">
                                    <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50">
                                        Choose Portal
                                    </div>

                                    <Link 
                                        to="/login"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    >
                                        <UserCircle className="w-4 h-4 text-[#0A6EFF]" />
                                        <div>
                                            <div className="font-medium">Patient Portal</div>
                                            <div className="text-xs text-gray-500">Access your health records</div>
                                        </div>
                                    </Link>

                                    <Link 
                                        to="/login"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-all"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    >
                                        <Stethoscope className="w-4 h-4 text-green-600" />
                                        <div>
                                            <div className="font-medium">Doctor Portal</div>
                                            <div className="text-xs text-gray-500">Manage your practice</div>
                                        </div>
                                    </Link>

                                    <Link 
                                        to="/login"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-all"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    >
                                        <Pill className="w-4 h-4 text-purple-600" />
                                        <div>
                                            <div className="font-medium">Medical Shop Portal</div>
                                            <div className="text-xs text-gray-500">Verify prescriptions</div>
                                        </div>
                                    </Link>
                                </div>

                                <div className="border-t border-gray-100 bg-gray-50 py-2">
                                    <div className="px-4 py-2 text-xs text-gray-500 mb-1">Don't have an account?</div>
                                    <Link 
                                        to="/register"
                                        className="block px-4 py-2 text-sm font-medium text-[#0A6EFF] hover:bg-blue-50 transition-all"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    >
                                        Register Now →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="p-2 text-gray-600 hover:text-[#0A6EFF] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
                    <div className="flex flex-col space-y-3">
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-blue-50 rounded-lg">About</Link>
                        <Link to="/features" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-blue-50 rounded-lg">Features</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-blue-50 rounded-lg">Contact</Link>

                        <div className="pt-2 border-t border-gray-100">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Sign In</div>

                            <Link to="/sign-in/patient" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-lg">
                                <UserCircle className="w-4 h-4 text-[#0A6EFF]" />
                                <span>Patient Portal</span>
                            </Link>

                            <Link to="/sign-in/doctor" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 rounded-lg">
                                <Stethoscope className="w-4 h-4 text-green-600" />
                                <span>Doctor Portal</span>
                            </Link>

                            <Link to="/sign-in/medical" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 rounded-lg">
                                <Pill className="w-4 h-4 text-purple-600" />
                                <span>Medical Shop Portal</span>
                            </Link>

                            <Link to="/sign-up/patient" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 mt-2 text-sm font-medium text-[#0A6EFF] hover:bg-blue-50 rounded-lg">
                                Register Now →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop (always BEHIND dropdown) */}
            {isUserDropdownOpen && (
                <div className="fixed inset-0 z-0" onClick={() => setIsUserDropdownOpen(false)} />
            )}
        </nav>
    );
}

export default Navbar;
