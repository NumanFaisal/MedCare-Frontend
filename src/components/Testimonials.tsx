function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content:
        "MedCare has transformed my healthcare experience. Having all my prescriptions and medical history in one place saves me so much time and worry. I love being able to message my doctor directly!",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop",
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content:
        "As a doctor, I've found MedCare incredibly useful for managing patient prescriptions and communications. The platform is intuitive and helps me provide more personalized care to my patients.",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1064&auto=format&fit=crop",
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content:
        "As a doctor, I've found MedCare incredibly useful for managing patient prescriptions and communications. The platform is intuitive and helps me provide more personalized care to my patients.",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1064&auto=format&fit=crop",
    },
    
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Client Testimonial:{" "}
            <span className="bg-gradient-to-r from-[#0A6EFF] to-[#0A6EFF] bg-clip-text text-transparent">Real Stories, Real Results</span>
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hear from our satisfied users about how MedCare has improved their
            healthcare experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <button
              key={i}
              className="
                bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-left
                transition-all duration-300 ease-out
                hover:-translate-y-1
                hover:shadow-[0_10px_35px_rgba(59,130,246,0.25)]
                focus:shadow-[0_10px_35px_rgba(59,130,246,0.35)]
                active:shadow-[0_5px_20px_rgba(37,99,235,0.45)]
                active:translate-y-0
                focus:outline-none
              "
            >
              <div className="bg-indigo-50 p-6 flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover"
                  loading="lazy"
                />

                <div>
                  <h4 className="font-semibold text-lg">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>

                  <div className="text-yellow-400 text-sm mt-1">
                    ★★★★★
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  {t.content}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
