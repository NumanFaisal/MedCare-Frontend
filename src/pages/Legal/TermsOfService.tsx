import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl shadow-blue-100/50 rounded-2xl p-8 md:p-12 border border-gray-100">
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#0A6EFF] to-[#7E69AB] bg-clip-text text-transparent">Terms of Service</h1>
        <p className="text-gray-500 mb-8 border-b pb-4">Last Updated: April 17, 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using MedCare, you agree to be bound by these Terms of Service. Our platform is designed to revolutionize healthcare connectivity, and your compliance ensures a safe environment for all users.
          </p>
        </section>

        <section className="mb-8 bg-amber-50/50 border-l-4 border-amber-500 p-6 rounded-r-xl">
          <h2 className="text-xl font-bold mb-3 text-amber-900 flex items-center gap-2">
            <span className="bg-amber-500 text-white p-1 rounded-full text-[10px]">!</span>
            2. Medical Disclaimer
          </h2>
          <p className="text-amber-800 font-medium leading-relaxed">
            IMPORTANT: MedCare is a platform to facilitate healthcare services. AI-generated insights are for informational purposes only and do not replace professional medical advice, diagnosis, or treatment.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">3. User Responsibilities</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Account Integrity</h3>
              <p className="text-sm text-blue-800">You must provide accurate information during registration and maintain credential confidentiality.</p>
            </div>
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-2">Platform Use</h3>
              <p className="text-sm text-purple-800">Users must not use the platform for any illegal or unauthorized purpose or violate community standards.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Professional Services</h2>
          <p className="text-gray-700 leading-relaxed">
            Doctors and Medical Shops using the platform are independent professionals. MedCare facilitates the connection but is not responsible for the specific medical advice or products provided by these third parties.
          </p>
        </section>

        <section className="pt-8 border-t border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            MedCare shall not be liable for any indirect, incidental, or consequential damages arising out of your use or inability to use the platform. We strive for 100% uptime but cannot guarantee uninterrupted service.
          </p>
        </section>
      </div>
    </div>

  );
};

export default TermsOfService;
