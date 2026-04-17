import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">Last Updated: April 17, 2026</p>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="text-gray-700 leading-relaxed">
          MedCare ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your health information and personal data when you use our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Personal Details:</strong> Name, email, phone number, and date of birth.</li>
          <li><strong>Medical Information:</strong> Prescriptions, health queries, and appointment history.</li>
          <li><strong>Professional Data:</strong> (For Doctors) License numbers, specializations, and bios.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
        <p className="text-gray-700 leading-relaxed">
          We use your information to facilitate appointments, generate AI-assisted health insights, and ensure secure communication between patients, doctors, and medical shops.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
        <p className="text-gray-700 leading-relaxed">
          Your data is encrypted both in transit and at rest. We implement strict access controls to ensure only authorized personnel can access sensitive medical information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
        <p className="text-gray-700 leading-relaxed">
          You have the right to access, correct, or delete your personal data. You can also request a copy of your medical records stored on our platform.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
