import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface LoginGoogleProps {
  onLoginError: (error: string) => void;
  onLoginSuccess: (token: string) => void;
}

const LoginGoogle: React.FC<LoginGoogleProps> = ({
  onLoginError,
  onLoginSuccess,
}) => {
  const onSuccess = (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received");
      }
      const decodedToken: any = jwtDecode(credentialResponse.credential);
      console.log("Decoded Token: ", decodedToken);

      // Save the token to localStorage
      localStorage.setItem("googleToken", credentialResponse.credential);

      // Pass the token to the onLoginSuccess callback
      onLoginSuccess(credentialResponse.credential);
      console.log("Google Token saved to localStorage");
    } catch (error) {
      console.error("Error decoding token: ", error);
      onLoginError("Error decoding token: " + (error as Error).message);
    }
  };

  const onError = () => {
    const errorMessage =
      "Google Login Failed. This may be due to ad-blocking or privacy protection software.";
    console.error(errorMessage);
    onLoginError(errorMessage + " (ERR_BLOCKED_BY_CLIENT)");
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap={false}
        auto_select={false}
        context="signin"
      />
    </div>
  );
};

export default LoginGoogle;
