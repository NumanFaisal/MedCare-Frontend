import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
type AccountType = "patient" | "doctor" | "medical";

const Login: React.FC = () => {
  const [role, setRole] = useState<AccountType>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", { email, password });
      if (response.status === 200) {
        if (role === "patient") {
          navigate("/usr");
        } else if (role === "doctor") {
          navigate("/doc");
        } else if (role === "medical") {
          navigate("/med");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-[#243352] to-[#2BB564]">
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

      {/* Login Card */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 md:p-8 mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
              Sign in to MedCare
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Welcome back! Please login to your account
            </p>
          </div>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AccountType)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="medical">Medical Shop</option>
            </select>
          </div>

          {/* Auth form goes here */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full rounded-lg border ${emailError ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Enter your email"
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
              />
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5 font-medium transition-colors cursor-pointer"
              onClick={handleLogin}>
              Sign In
            </button>
          </div>

          {/* Sign up link */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <NavLink
                to='/register'
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
