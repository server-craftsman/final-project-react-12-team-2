import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleModalProps {
  onLoginError: (error: string) => void;
  onLoginSuccess: (token: string, googleId: string) => void;
  context: "login" | "register"; // Add context prop
}

const GoogleModal: React.FC<GoogleModalProps> = ({ onLoginError, onLoginSuccess, context }) => {
  const onSuccess = (credentialResponse: any) => {
    try {
      if (typeof onLoginSuccess !== "function") {
        throw new Error("onLoginSuccess callback is not properly defined");
      }

      if (!credentialResponse.credential) {
        throw new Error("No credential received");
      }

      const decodedToken: any = jwtDecode(credentialResponse.credential);
      const googleId = decodedToken.sub; // Assuming 'sub' contains the Google ID

      localStorage.setItem("googleToken", credentialResponse.credential);
      onLoginSuccess(credentialResponse.credential, googleId); // Pass googleId
    } catch (error) {
      onLoginError("Error decoding token: " + (error as Error).message);
    }
  };

  const onError = () => {
    const errorMessage = "Google Login Failed. This may be due to ad-blocking or privacy protection software.";
    onLoginError(errorMessage + " (ERR_BLOCKED_BY_CLIENT)");
  };

  return (
    <div>
      {/* <h3>{context === "login" ? "Login with Google" : "Register with Google"}</h3> */}
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap={false}
        auto_select={false}
        context="signin"
        text={context === "login" ? "signin_with" : "signup_with"} // Customize button text
      />
    </div>
  );
};

export default GoogleModal;
