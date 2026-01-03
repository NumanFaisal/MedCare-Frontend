import { Link } from "react-router-dom";
import { Stethoscope, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white pt-16 pb-10 border-t">
      <div className="container mx-auto px-4">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* BRAND */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 bg-[#0A6EFF] rounded-xl flex items-center justify-center shadow-md">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>

              <span className="text-2xl font-bold text-gray-800">
                MedCare
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              Connecting patients, doctors, and medical shops for accessible,
              compassionate healthcare.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex space-x-4">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border flex items-center justify-center 
                  text-gray-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
              <li><Link to="/features" className="hover:text-blue-600">Features</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>

          {/* USERS */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4">For Users</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/patients" className="hover:text-blue-600">For Patients</Link></li>
              <li><Link to="/doctors" className="hover:text-blue-600">For Doctors</Link></li>
              <li><Link to="/medical-shops" className="hover:text-blue-600">For Medical Shops</Link></li>
              <li><Link to="/faq" className="hover:text-blue-600">FAQs</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: info@medcare.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Healthcare Ave, Medical District</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t pt-6 text-center flex flex-col md:flex-row justify-between items-center gap-3 text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} MedCare. All rights reserved.</p>

          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-600">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
