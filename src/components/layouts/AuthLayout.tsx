import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20 md:justify-center md:pt-4 bg-gradient-to-br from-[#FAF9F6] to-[#EFE9E3] p-4">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-10">
        <NavLink to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl text-[#0A6EFF] font-bold ">
            MedCare
          </span>
        </NavLink>
      </div>
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          {/* Logo Icon using your new 'primary' color */}
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>

          {/* Title using your 'secondary' (Dark Navy) color */}
          <h1 className="text-3xl font-bold tracking-tight text-secondary">{title}</h1>
          <p className="text-gray-500">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}