import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';
import { HTTP_STATUS } from '../../app/enums';
import { HttpException } from '../../app/exceptions';

const VerifyEmail: React.FC = () => {
  const { token } = useParams();
  const { verifyToken, resendToken } = useAuth();
  const [status, setStatus] = useState(false);  // Changed to boolean
  const [isExpired, setIsExpired] = useState(false);  // New state for expired status
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) return;
      
      try {
        await verifyToken(token);
        setStatus(true);  // Success case
        setIsExpired(false);
      } catch (error) {
        setStatus(false);
        setIsExpired(true);
        if (error instanceof HttpException && error.status === HTTP_STATUS.NOT_FOUND) {
          setMessage('Token has expired. Please request a new verification link.');
        } else {
          setMessage('Verification failed. Please try again or request a new verification link.');
        }
      }
    };
    verify();
  }, [token, verifyToken]);

  const handleResend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resendToken({ email });
      setMessage('New verification link has been sent to your email.');
    } catch (error) {
      if (error instanceof HttpException) {
        setMessage(`Failed to resend verification link: ${error.message}`);
      } else {
        setMessage('Failed to resend verification link. Please try again.');
      }
    }
  }, [email, resendToken]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const renderVerifying = () => (
    <div className="animate-pulse">
      <h1 className="text-[#1a237e] text-3xl font-bold mb-5">Verifying email...</h1>
      <div className="w-12 h-12 mx-auto border-4 border-[#1a237e] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const renderSuccess = () => (
    <div className="animate-float">
      <h1 className="text-[#1a237e] text-3xl font-bold mb-5">Email verified successfully!</h1>
      <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
  );

  const renderExpired = () => (
    <div>
      <h1 className="text-[#1a237e] text-3xl font-bold mb-5">Verification Failed</h1>
      <p className="text-gray-600 mb-6 text-lg">{message}</p>
      <form onSubmit={handleResend} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          required
          className="p-4 border-2 border-gray-300 rounded-lg text-lg focus:border-[#1a237e] focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-50 transition-all"
        />
        <button 
          type="submit" 
          className="bg-gradient-tone text-white py-4 px-8 rounded-lg text-lg font-semibold cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
        >
          Resend Verification Link
        </button>
      </form>
    </div>
  );

  return (
    <div className="max-w-[500px] mx-auto my-[60px] p-8 text-center rounded-lg shadow-lg bg-white border border-gray-200">
      {!status && !isExpired && renderVerifying()}
      {status && renderSuccess()}
      {!status && isExpired && renderExpired()}
    </div>
  );
};

export default React.memo(VerifyEmail)
