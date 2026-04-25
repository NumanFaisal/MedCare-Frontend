import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl shadow-purple-100/50 rounded-2xl p-8 md:p-12 border border-gray-100">
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#7E69AB] to-[#0A6EFF] bg-clip-text text-transparent">Privacy Policy</h1>
        <p className="text-gray-500 mb-8 border-b pb-4">Last Updated: April 17, 2026</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            MedCare ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your health information and personal data when you use our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Information We Collect</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <h3 className="font-semibold text-indigo-900 mb-1 text-sm">Personal Details</h3>
              <p className="text-xs text-indigo-800">Name, email, phone number, and date of birth.</p>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-1 text-sm">Medical Info</h3>
              <p className="text-xs text-blue-800">Prescriptions, health queries, and history.</p>
            </div>
            <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
              <h3 className="font-semibold text-teal-900 mb-1 text-sm">Professional Data</h3>
              <p className="text-xs text-teal-800">License numbers, specializations, and bios.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">3. How We Use Your Data</h2>
          <p className="text-gray-700 leading-relaxed">
            We use your information to facilitate appointments, generate AI-assisted health insights, and ensure secure communication between patients, doctors, and medical shops. Your data helps us improve the platform's diagnostic accuracy and user experience.
          </p>
        </section>

        <section className="mb-8 bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            Your data is encrypted both in transit and at rest. We implement strict access controls (HIPAA-inspired standards) to ensure only authorized personnel can access sensitive medical information. We use industry-standard SSL encryption for all data transfers.
          </p>
        </section>

        <section className="pt-8 border-t border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You have the right to access, correct, or delete your personal data. You can also request a copy of your medical records stored on our platform. To exercise these rights, please contact our privacy officer at <span className="text-blue-600 font-medium">privacy@medcare.com</span>.
          </p>
        </section>
      </div>
    </div>

  );
};

export default PrivacyPolicy;
