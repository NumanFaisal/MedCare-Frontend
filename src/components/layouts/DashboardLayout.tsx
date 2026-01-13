import { NavLink, useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button"; 
import { toast } from "sonner";
import { Book, FileText, Home, LogOut, Menu, RedoDot, Rocket, ShoppingBag, User, UserCircle, X } from "lucide-react";
import { useState } from "react";

type RoleType = 'USER' | 'DOCTOR' | 'MEDICAL';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: RoleType;
}

// 1. Update Interface to allow the 'end' prop
interface SidebarLink {
    icon: React.ElementType;
    label: string;
    href: string;
    end?: boolean; // New optional property
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const getUserLinks = (): SidebarLink[] => {
        switch (role) {
            case 'USER':
                return [
                    // 2. Add 'end: true' to the Dashboard links (the root paths)
                    { icon: Home, label: 'Dashboard', href: '/user', end: true },
                    { icon: Book, label: 'Book Appointment', href: '/user/appointments/book-new' },
                    { icon: FileText, label: 'Prescriptions', href: '/user/prescriptions' },
                    { icon: Rocket, label: 'AI Health Assistant', href: '/user/ai-health' },
                    { icon: UserCircle, label: 'My Profile', href: '/user/profile' },
                ];
            case 'DOCTOR':
                return [
                    { icon: Home, label: 'Dashboard', href: '/doctor', end: true },
                    { icon: FileText, label: 'Create Prescription', href: '/doctor/create-prescription' },
                    { icon: User, label: 'Patients', href: '/doctor/patients' },
                    { icon: UserCircle, label: 'My Profile', href: '/doctor/profile' },
                ];
            case 'MEDICAL':
                return [
                    { icon: Home, label: 'Dashboard', href: '/medical', end: true },
                    { icon: ShoppingBag, label: 'Fetch Prescriptions', href: '/medical/fetch-prescriptions' },
                    { icon: UserCircle, label: 'Shop Profile', href: '/medical/profile' },
                ];
            default:
                return [];
        }
    };

    const links = getUserLinks();

    const roleTitles = {
        USER: 'Patient',
        DOCTOR: 'Doctor',
        MEDICAL: 'Medical Shop'
    };

    // 3. Updated NavLinks Component using standard NavLink
    const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            {links.map((link) => {
                const Icon = link.icon;
                
                return (
                    <NavLink
                        key={link.href}
                        to={link.href}
                        end={link.end} // This prevents "Dashboard" from lighting up on other pages
                        onClick={() => isMobile && setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `
                            flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                            ${isActive 
                                ? 'bg-primary text-white shadow-md' 
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }
                        `}
                    >
                        {/* We use a function for className to access 'isActive' automatically */}
                        {({ isActive }) => (
                            <>
                                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                {link.label}
                            </>
                        )}
                    </NavLink>
                );
            })}
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse">
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                                    MedCare
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex px-3 py-1 bg-secondary text-white text-xs rounded-full font-medium tracking-wide">
                                {roleTitles[role]} Portal
                            </div>
                            <div className="hidden md:flex items-center gap-2 ml-2 border-l pl-4 border-gray-200">
                                <Button variant="ghost" onClick={handleLogout} className="text-gray-500 hover:text-red-600 hover:bg-red-50 ">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                            <Button variant="ghost" size="icon" className="md:hidden text-secondary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-grow flex h-[calc(100vh-64px)] overflow-hidden">
                <aside className="hidden md:flex md:w-64 bg-secondary text-white flex-shrink-0 flex-col justify-between shadow-xl z-10">
                    <div className="h-full w-full py-6 px-4 overflow-y-auto">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Menu</p>
                        <nav className="space-y-1">
                            <NavLinks />
                        </nav>
                    </div>
                    <div className="p-4 border-t border-gray-700 bg-black/20">
                        <div className="flex items-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                                {role?.charAt(0)}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">My Account</p>
                                <p className="text-xs text-gray-400 truncate capitalize">{role.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="fixed inset-y-0 left-0 w-64 bg-secondary shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
                            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700">
                                <span className="font-bold text-lg text-white">MedCare</span>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                            <nav className="px-4 py-6 space-y-2 flex-grow">
                                <NavLinks isMobile={true} />
                            </nav>
                            <div className="p-4 border-t border-gray-700">
                                <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-white/5" onClick={handleLogout}>
                                    <LogOut className="h-5 w-5 mr-3" /> Sign Out
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50/50">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;