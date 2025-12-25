import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // Assuming sonner, or use your toast library
import { Eye, EyeOff } from "lucide-react"; // Import icons
import AuthLayout from "@/components/layouts/AuthLayout";

// type AccountType = "USER" | "DOCTOR" | "MEDICAL";

const Login: React.FC = () => {
  // const [role, setRole] = useState<AccountType>("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New State
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!email || !password) {
      toast.error("Missing Fields", { description: "Please fill in both email and password." });
      return;
    }
    if (emailError) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", { 
        email, 
        password,
        // role 
      });

      if (response.status === 200) {
        // 3. Get the REAL role from the backend
        const { role, token } = response.data;

        // Optional: Save token to localStorage here
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        toast.success("Login successful!", {
          description: `Welcome back to MedCare`,
        });

        // 4. Redirect based on the role we received
        setTimeout(() => {
          if (role === "USER") {
            navigate("/user");
          } else if (role === "DOCTOR") {
            navigate("/doctor");
          } else if (role === "MEDICAL") {
            navigate("/medical");
          } else {
            navigate("/");
          }
        }, 500);
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong.";
      toast.error("Login Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back!" subtitle="Please sign in to your account">
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

          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AccountType)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="USER">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="MEDICAL">Medical Shop</option>
            </select>
          </div> */}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full rounded-lg border ${emailError ? "border-red-500" : "border-gray-300"} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Enter your email"
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {/* PASSWORD FIELD SECTION STARTS HERE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Dynamic type
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" // added pr-10 for space
                  placeholder="Enter your password"
                />
                <button
                  type="button" // Important to prevent form submission
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* PASSWORD FIELD SECTION ENDS HERE */}

            <button
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5 font-medium transition-colors cursor-pointer disabled:opacity-50"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <NavLink to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;