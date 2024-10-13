import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
interface LoginGoogleProps {
  onLoginError: (error: string) => void;
}

const LoginGoogle: React.FC<LoginGoogleProps> = ({ onLoginError }) => {
  const onSuccess = (credentialResponse: any) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      console.log("Decoded Token: ", decodedToken);
      const successMessage = `
        🎉✨ Login Success! ✨🎉
        
        Your ID Token: ${credentialResponse.credential}
        
        Welcome to the premium experience! 🌟
        
        Enjoy exclusive features and benefits tailored just for you.
      `;
      alert(successMessage);
    } catch (error) {
      console.error("Error decoding token: ", error);
      onLoginError("Error decoding token: " + error);
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
