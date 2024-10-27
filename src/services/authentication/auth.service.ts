import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { RegisterGooglePublicResponse } from "../../models/api/responsive/authentication/auth.responsive.model";
import { RegisterStudentPublicParams, RegisterInstructorPublicParams, RegisterParams } from "../../models/api/request/authentication/auth.request.model";
import { ResponseSuccess } from "../../app/interface";
import { User } from "../../models/api/responsive/users/users.model"; //data user
import { GetBankResponse } from "../../models/api/responsive/authentication/auth.responsive.model";
import cloudinaryConfig from "../config/cloudinaryConfig";

export const AuthService = {
  login(params: { email: string; password: string }) {
    return BaseService.post<ResponseSuccess<{ token: string }>>({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true
    });
  },
  loginGoogle(params: { google_id: string }) {
    return BaseService.post<ResponseSuccess<{ token: string }>>({
      url: API.AUTH.LOGIN_GOOGLE,
      payload: params,
      isLoading: true
    });
  },
  registerGooglePublic(params: RegisterStudentPublicParams | RegisterInstructorPublicParams) {
    return BaseService.post<ResponseSuccess<RegisterGooglePublicResponse>>({
      url: API.AUTH.REGISTER_GOOGLE_PUBLIC,
      payload: params,
      isLoading: true
    });
  },
  logout() {
    return BaseService.get<ResponseSuccess<string>>({
      url: API.AUTH.LOGOUT,
      isLoading: true
    });
  },
  verifyToken(params: { token: string }) {
    return BaseService.post<ResponseSuccess<string>>({
      url: API.AUTH.VERIFY_TOKEN,
      payload: params,
      isLoading: true
    });
  },
  resendToken(params: { email: string }) {
    return BaseService.post<ResponseSuccess<string>>({
      url: API.AUTH.RESEND_TOKEN,
      payload: params,
      isLoading: true
    });
  },
  forgotPassword(params: { email: string }) {
    return BaseService.put<ResponseSuccess<string>>({
      url: API.AUTH.FORGOT_PASSWORD,
      payload: params,
      isLoading: true
    });
  },
  getUserRole(token: string) {
    return BaseService.get<ResponseSuccess<User>>({
      url: API.AUTH.LOGIN,
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  register(params: RegisterParams) {
    return BaseService.post<ResponseSuccess<User>>({
      url: API.AUTH.REGISTER,
      payload: params,
      isLoading: true
    });
  },
  getBank() {
    return BaseService.get<GetBankResponse>({
      url: API.BANK.GET_BANK
    });
  },
  uploadToCloudinary(file: File, type: "image" | "video") {
    const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${type}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("timestamp", String(Math.round(new Date().getTime() / 1000)));

    // Generate signature
    const params = {
      timestamp: (formData.get("timestamp") as string) || "",
      upload_preset: cloudinaryConfig.uploadPreset,
      api_key: cloudinaryConfig.apiKey
    };
    const signature = this.generateSignature(params, cloudinaryConfig.apiSecret);
    formData.append("signature", signature);

    const options = {
      method: "POST",
      body: formData,
      timeout: 300000, // 5 minute timeout
      isLoading: true
    };

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        return response;
      })
      .catch((error) => {
        console.error("Upload error:", error);
        if (error.name === "AbortError") {
          throw new Error("Upload timed out - please try uploading a smaller file");
        }
        throw new Error(`Upload failed: ${error.message}. Please try again.`);
      });
  },
  generateSignature(params: Record<string, string | undefined>, apiSecret: string): string {
    const sortedKeys = Object.keys(params).sort();
    const stringToSign = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");

    return require("crypto")
      .createHash("sha256")
      .update(stringToSign + apiSecret)
      .digest("hex");
  }
};
