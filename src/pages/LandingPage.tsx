import Hero from "../components/Hero";
import Features from "../components/Features";
 import RoleSection from "../components/RoleSection";
import Specialist from "../components/Specialist";
import DoctorSearch from "../components/DoctorSearch";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
// import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Specialist name={""} experience={""} image={""} bio={""} socialLinks={{
        facebook: "",
        twitter: "",
        youtube: ""
      }} />
      <DoctorSearch />
      <RoleSection />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
