import React from 'react';
import { Facebook, Twitter, Youtube, ArrowRight, Award, CheckCircle2 } from 'lucide-react';

interface SpecialistProps {
    name: string;
    experience: string;
    image: string;
    bio: string;
    socialLinks: {
        facebook: string;
        twitter: string;
        youtube: string;
    };
    credentials?: string;
}

export const Specialist: React.FC<SpecialistProps> = ({
    name,

    image,
 
    socialLinks,
    credentials,
}) => {
    

    return (
        <section className="w-full py-16 md:py-24 px-4 relative overflow-hidden">
            

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 p-6 md:p-8 lg:p-12">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Doctor Image - Left Side */}
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-gray-400 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            
                            <div className="relative overflow-hidden rounded-2xl transform group-hover:scale-[1.02] transition-all duration-500">
                                <img
                                    src={image || "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg?semt=ais_hybrid&w=740&q=80"}
                                    alt={name}
                                    className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-2xl"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent rounded-2xl"></div>
                                
                                {/* Floating Badge */}
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 backdrop-blur-sm">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Verified Expert</span>
                                </div>
                            </div>
                        </div>

                        {/* Content - Right Side */}
                        <div className="relative">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Social Media Icons - Vertical Stack */}
                                <div className="flex flex-col gap-6 pt-2 from black">
                                    {[
                                        { icon: Facebook, url: socialLinks.facebook, label: 'Facebook', color: 'hover:text-black ' },
                                        { icon: Twitter, url: socialLinks.twitter, label: 'Twitter', color: ' hover:text-black' },
                                        { icon: Youtube, url: socialLinks.youtube, label: 'YouTube', color: ' hover:text-black' },
                                    ].map((social, idx) => (
                                        <a
                                            key={idx}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gray-100 text-gray-700 transition-all duration-300 ${social.color} shadow-md hover:shadow-lg hover:scale-110 group`}
                                            aria-label={social.label}
                                        >
                                            <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </a>
                                    ))}
                                      {/* Bio with Vertical Separator */}
                                            <div className="flex gap-4 md:gap-6 mb-6 items-center justify-center">
                                                    <div className="w-1 bg-gradient-to-b from-black to-gray-800 min-h-[200px] rounded-full shadow-lg"></div>
                                            </div>

                                      {/* Navigation Button */}
                                    <button className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 mb-6">
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                </div>
                                
                                {/* Main Content */}
                                <div className="flex-1 relative min-h-[500px] gap-4 flex flex-col justify-start pt-4">
                                    {/* Heading */}
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 leading-tight">
                                        Our <span className="bg-gradient-to-r from-blue-600  to-blue-600 bg-clip-text text-transparent">expert</span> <br /> Specialist.
                                    </h2>

                                    {/* Doctor Name */}
                                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-500 mb-2 mt-2">
                                        Dr. Sarah Johnson
                                    </h4>
                                    {/* Bio with Vertical Separator */}
                                            <div className="flex gap-4 md:gap-2 mb-6 items-center text-gray-500 justify-center">
                                                               <div className="w-1 bg-gradient-to-b  min-h-[100px] rounded-full shadow-lg"></div>
                                                        <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti possimus numquam dolore voluptatem exercitationem, voluptate eum reprehenderit sapiente tenetur porro enim expedita odio provident doloribus at perspiciatis illum neque officia!</p>

                                            </div>

                                    {/* Credentials */}
                                    {credentials && (
                                        <p className="text-blue-600 text-base md:text-lg font-semibold mb-5 flex items-center gap-2">
                                            <Award className="w-4 h-4" />
                                            {credentials}
                                        </p>
                                    )}
                                

                                    {/* Experience Box - Enhanced */}
                                    <div className="absolute bottom-0 right-0 bg-gradient-to-br from-[#0A6EFF]  to-[#0A6EFF] rounded-2xl p-6 md:p-8 text-white shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-3xl cursor-pointer group border-2 border-blue-400/30 hover:border-blue-300/50">
                                        <div className="flex items-center gap-4">
                                            {/* Years Number */}
                                            <div className="text-5xl md:text-4xl lg:text-7xl font-bold group-hover:scale-110 transition-transform">
                                                30+
                                            </div>
                                            {/* Years of Experience Text */}
                                            <div className="text-sm md:text-base lg:text-lg font-semibold text-white leading-tight">
                                                Years of<br />Experience
                                            </div>
                                        </div>
                                        
                                        {/* Decorative element */}
                                        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Specialist;