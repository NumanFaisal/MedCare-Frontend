import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Sparkles, ArrowRight, Shield, Users } from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-14 md:py-24 px-4 bg-white relative overflow-hidden">

      {/* Light Blue Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10  bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 flex justify-center">

        {/* MAIN HERO BOX */}
        <div
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 
          bg-[#0A6EFF] rounded-[3rem] p-10 md:p-16 
          shadow-2xl border border-blue-400/20 min-h-[480px]
          transition-all duration-300 ease-out transform 
          hover:scale-[1.03] hover:shadow-blue-300/40 hover:shadow-2xl
          active:scale-[1.01] w-full"
        >

          {/* LEFT CONTENT */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-8">
           

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
              Your health is our{" "}
              <span className="">
                First Priority.
              </span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl max-w-xl leading-relaxed mx-auto lg:mx-0">
              A complete healthcare platform connecting patients, doctors and
              pharmacies — all in one place.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-5 mt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Shield className="w-5 h-5 " />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Users className="w-5 h-5 " />
                <span>24/7 Support</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row mt-8 gap-4 justify-center lg:justify-start">
              <Button 
                variant="outline"
                className="group bg-white hover:bg-blue-50 text-[#0A6EFF] font-semibold py-6 px-8 rounded-xl border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/login" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Make Appointment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/user/ai-health")}
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                <span>Try AI Health Assistant</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE CARD */}
          <div className="lg:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-2xl">

              {/* Blue Rounded Card */}
              <div className="bg-[#1F6BFF] rounded-[3.5rem] p-12 md:p-16 shadow-2xl relative overflow-hidden min-h-[460px]">

                {/* Inner Soft Panel */}
                <div className="absolute inset-y-16 right-10 left-32 bg-[#0B44C7]/35 rounded-[2.5rem] shadow-xl" />

                {/* Doctor PNG */}
                <img
                  src="https://pngimg.com/uploads/doctor/doctor_PNG16040.png"
                  alt="Doctor"
                  className="relative z-10 w-[82%] ml-auto drop-shadow-2xl"
                />

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
