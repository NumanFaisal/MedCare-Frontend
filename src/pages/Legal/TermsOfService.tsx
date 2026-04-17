import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-600 mb-4">Last Updated: April 17, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-700 leading-relaxed">
          By accessing or using MedCare, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Medical Disclaimer</h2>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
          <p className="text-amber-800 font-medium">
            IMPORTANT: MedCare is a platform to facilitate healthcare services. AI-generated insights are for informational purposes only and do not replace professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>You must provide accurate information during registration.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>Users must not use the platform for any illegal or unauthorized purpose.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Professional Services</h2>
        <p className="text-gray-700 leading-relaxed">
          Doctors and Medical Shops using the platform are independent professionals and are solely responsible for the medical advice and services they provide.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
        <p className="text-gray-700 leading-relaxed">
          MedCare shall not be liable for any indirect, incidental, or consequential damages arising out of your use or inability to use the platform.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
