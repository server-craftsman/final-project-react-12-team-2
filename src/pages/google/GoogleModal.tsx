import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleModalProps {
  onLoginError: (error: string) => void;
  onLoginSuccess: (token: string, googleId: string) => void;
}

const GoogleModal: React.FC<GoogleModalProps> = ({ onLoginError, onLoginSuccess }) => {
  const onSuccess = (credentialResponse: any) => {
    try {
      // Add validation for callback
      if (typeof onLoginSuccess !== "function") {
        throw new Error("onLoginSuccess callback is not properly defined");
      }

      if (!credentialResponse.credential) {
        throw new Error("No credential received");
      }

      const decodedToken: any = jwtDecode(credentialResponse.credential);
      console.log("Decoded Token: ", decodedToken);

      // Extract Google ID from the decoded token
      const googleId = decodedToken.sub; // Assuming 'sub' contains the Google ID
      console.log("Google ID: ", googleId);

      localStorage.setItem("googleToken", credentialResponse.credential);
      onLoginSuccess(credentialResponse.credential, googleId); // Pass googleId
      console.log("Google Token saved to localStorage and Google ID passed to onLoginSuccess");
    } catch (error) {
      console.error("Error decoding token: ", error);
      onLoginError("Error decoding token: " + (error as Error).message);
    }
  };

  const onError = () => {
    const errorMessage = "Google Login Failed. This may be due to ad-blocking or privacy protection software.";
    console.error(errorMessage);
    onLoginError(errorMessage + " (ERR_BLOCKED_BY_CLIENT)");
  };

  return (
    <div>
      <GoogleLogin onSuccess={onSuccess} onError={onError} useOneTap={false} auto_select={false} context="signin" />
    </div>
  );
};

export default GoogleModal;
