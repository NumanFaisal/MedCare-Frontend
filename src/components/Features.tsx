function Features() {

    const features = [
    {
        title: "Digital Prescriptions",
        description: "Seamlessly manage prescriptions online. Doctors can issue and patients can access their prescriptions digitally, while medical shops can verify and fulfill them instantly.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M8 13h8" />
            <path d="M8 17h8" />
            <path d="M8 9h2" />
            </svg>
        ),
        iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
        iconColor: "text-white"
    },
    {
        title: "Unique User ID",
        description: "Connect instantly with a unique ID that links patients, doctors, and medical shops. Simplified communication and record-keeping across the healthcare ecosystem.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
        ),
        iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
        iconColor: "text-white"
    },
    {
        title: "Role-Based Access",
        description: "Tailored experiences for patients, doctors, and medical shops. Each user sees only what's relevant to them, with appropriate permissions and interfaces.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
        iconColor: "text-white"
    },
    {
        title: "Instant Communication",
        description: "Built-in messaging system allows direct communication between patients and healthcare providers. Get your questions answered without unnecessary appointments.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
        iconColor: "text-white"
    },
    {
        title: "Medical History",
        description: "Keep your complete medical history in one place. Access past prescriptions, diagnoses, and treatment plans anytime, anywhere.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
        ),
        iconBg: "bg-gradient-to-br from-orange-500 to-amber-600",
        iconColor: "text-white"
    },
    {
        title: "Secure & Private",
        description: "Your health data is protected with industry-leading security measures. We prioritize privacy and confidentiality in all interactions.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
        iconColor: "text-white"
    }
];

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        Features that <span className="bg-gradient-to-r from-[#0A6EFF] to-[#7E69AB] bg-clip-text text-transparent">Care</span> for You
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                        MedCare brings innovative solutions to make healthcare more accessible, 
                        connected, and compassionate for everyone involved.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div 
                        key={index} 
                        className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-2"
                        >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-blue-50/50 group-hover:to-purple-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10">
                            {/* Icon with colored background */}
                            <div className={`${feature.iconBg} ${feature.iconColor} p-4 rounded-xl mb-6 w-fit shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            
                            {/* Content */}
                            <h3 className="text-xl lg:text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#0A6EFF] transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-base">
                                {feature.description}
                            </p>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features