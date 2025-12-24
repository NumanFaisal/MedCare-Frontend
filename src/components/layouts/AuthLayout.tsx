import React from 'react';
import { NavLink } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-20 md:justify-center md:pt-4 bg-gradient-to-br from-[#243352] to-[#2BB564] p-4">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-10">
        <NavLink to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#2BB564] rounded-lg flex items-center justify-center">
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
          <span className="text-lg font-bold text-white">
            MedCare
          </span>
        </NavLink>
      </div>
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          {/* Logo Icon using your new 'primary' color */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12" /><path d="M6 12h12" /></svg>
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