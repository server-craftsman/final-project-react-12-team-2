import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { HTTP_STATUS } from "../../app/enums";
import { HttpException } from "../../app/exceptions";
import { ROUTER_URL } from "../../const/router.path";
import { helpers } from "../../utils";

const VerifyEmail: React.FC = () => {
  const { token } = useParams();
  const { verifyToken, resendToken } = useAuth();
  const [status, setStatus] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const verify = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await verifyToken({ token });
        setStatus(true);
        setIsExpired(false);
        helpers.notificationMessage(response.data || "Email verified successfully!", "success");

        timeoutId = setTimeout(() => {
          navigate(ROUTER_URL.LOGIN);
        }, 5000);
      } catch (error) {
        setStatus(false);
        if (error instanceof HttpException) {
          if (error.status === HTTP_STATUS.NOT_FOUND) {
            setIsExpired(true);
            helpers.notificationMessage("Token has expired. Please request a new verification link.", "error");
            timeoutId = setTimeout(() => {
              navigate(ROUTER_URL.COMMON.HOME);
            }, 3000);
          } else {
            setIsExpired(false);
            helpers.notificationMessage(error.message || "Verification failed. Please try again.", "error");
            timeoutId = setTimeout(() => {
              navigate(ROUTER_URL.COMMON.HOME);
            }, 3000);
          }
        } else {
          setIsExpired(false);
          helpers.notificationMessage("Verification failed. Please try again or request a new verification link.", "error");
          timeoutId = setTimeout(() => {
            navigate(ROUTER_URL.COMMON.HOME);
          }, 3000);
        }
      } finally {
        setIsLoading(false);
      }
    };
    verify();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, verifyToken, navigate]);

  const handleResend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await resendToken({ email });
        helpers.notificationMessage(response.data || "New verification link has been sent to your email.", "success");
      } catch (error) {
        if (error instanceof HttpException) {
          helpers.notificationMessage(error.message || "Failed to resend verification link.", "error");
        } else {
          helpers.notificationMessage("Failed to resend verification link. Please try again.", "error");
        }
        setTimeout(() => {
          navigate(ROUTER_URL.COMMON.HOME);
        }, 3000);
      }
    },
    [email, resendToken, navigate]
  );

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const renderVerifying = useMemo(
    () => (
      <div className="animate-pulse">
        <h1 className="mb-5 text-3xl font-bold text-[#1a237e]">Verifying email...</h1>
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#1a237e] border-t-transparent"></div>
      </div>
    ),
    []
  );

  const renderSuccess = useMemo(
    () => (
      <div className="animate-float">
        <h1 className="mb-5 text-3xl font-bold text-[#1a237e]">Email verified successfully!</h1>
        <svg className="mx-auto h-20 w-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <p className="mt-4 text-gray-600">Redirecting to login page in 5 seconds...</p>
      </div>
    ),
    []
  );

  const renderExpired = useMemo(
    () => (
      <div>
        <h1 className="mb-5 text-3xl font-bold text-[#1a237e]">Verification Failed</h1>
        {/* <p className="mb-6 text-lg text-gray-600">{message}</p> */}
        <form onSubmit={handleResend} className="flex flex-col gap-4">
          <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" required className="rounded-lg border-2 border-gray-300 p-4 text-lg transition-all focus:border-[#1a237e] focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:ring-opacity-50" />
          <button type="submit" className="bg-gradient-tone transform cursor-pointer rounded-lg px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            Resend Verification Link
          </button>
        </form>
      </div>
    ),
    [email, handleResend, handleEmailChange]
  );

  return (
    <div className="mx-auto my-[60px] max-w-[500px] rounded-lg border border-gray-200 bg-white p-8 text-center shadow-lg">
      {isLoading && renderVerifying}
      {!isLoading && status && renderSuccess}
      {!isLoading && !status && isExpired && renderExpired}
    </div>
  );
};

export default React.memo(VerifyEmail);
