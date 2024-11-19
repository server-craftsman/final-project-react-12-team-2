interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
}

const cloudinaryConfig: CloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUD_NAME || "",
  apiKey: import.meta.env.VITE_API_KEY || "",
  apiSecret: import.meta.env.VITE_API_SECRET || "",
  uploadPreset: import.meta.env.VITE_UPLOAD_PRESET || ""
};

export default cloudinaryConfig;
