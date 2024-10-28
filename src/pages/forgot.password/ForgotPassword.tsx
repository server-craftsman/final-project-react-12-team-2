import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { ROUTER_URL } from "../../const/router.path";

const ForgotPassword: React.FC = () => {
  const { forgotPassword, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error);
    } else if (success) {
      toast.success(success);
      setTimeout(() => {
        setCountdown(3); // Start 3 second countdown after showing toast
      }, 1000); // Delay starting countdown to allow toast to display
    }
  }, [error, success]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && success) {
      logout(); // Clear unnecessary data by logging out
      navigate(ROUTER_URL.LOGIN);
    }
    return () => clearTimeout(timer);
  }, [countdown, navigate, success, logout]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await forgotPassword({ email });
        setSuccess("Password reset email sent successfully");
        setEmail("");
      } catch (err) {
        setError("Failed to send password reset email");
      } finally {
        setIsLoading(false);
      }
    },
    [email, forgotPassword]
  );

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-[400px] rounded-lg p-8">
        <div className="mb-8 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-11 rounded-full border-2 border-gray-300 p-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
        </div>
        <h1 className="mb-2 text-center text-2xl font-semibold">Forgot password?</h1>
        <p className="mb-8 text-center text-sm text-gray-500">No worries, we'll send you reset instructions.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-purple-500 focus:outline-none" required />
          </div>
          <button type="submit" disabled={isLoading} className="bg-gradient-tone w-full rounded-lg py-2.5 text-white hover:bg-purple-700 disabled:bg-purple-400">
            {isLoading ? "Sending..." : "Reset password"}
          </button>
        </form>
        {success && countdown > 0 && <div className="mt-4 animate-pulse text-center text-sm text-gray-600">Redirecting to login in {countdown} seconds...</div>}
        <div className="mt-6 text-center">
          <Link to={ROUTER_URL.LOGIN} className="text-sm text-[#02005dc6] hover:text-gray-700">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ForgotPassword);
