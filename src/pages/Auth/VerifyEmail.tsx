import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verify = async () => {
      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/auth/verify-email`, {
          params: { token, email }
        });
        setStatus('success');
        setMessage(response.data.message);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may be expired.');
      }
    };

    verify();
  }, [token, email]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Verifying Email...</h1>
            <p className="text-gray-600 mt-2">Please wait while we confirm your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Email Verified!</h1>
            <p className="text-gray-600 mt-2">{message}</p>
            <Link
              to="/login"
              className="mt-8 inline-block w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
            <p className="text-gray-600 mt-2">{message}</p>
            <div className="flex flex-col gap-3 mt-8 w-full">
               <Link
                to="/register"
                className="inline-block w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Try Registering Again
              </Link>
              <Link to="/" className="text-primary text-sm hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
