import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Cookie className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900">We use cookies</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            We use cookies to enhance your experience, analyze site traffic, and support our medical services. Read our <a href="/privacy-policy" className="text-primary hover:underline underline-offset-4">Privacy Policy</a> for more details.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
