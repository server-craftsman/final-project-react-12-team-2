import { message } from "antd";
import cloudinaryConfig from "../services/config/cloudinaryConfig";

export const handleUploadFile = async (file: File, type: "video" | "image") => {
  // Create FormData object for multipart/form-data upload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);

  const resourceType = type === "video" ? "video" : "image";
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`;

  try {
    // Use fetch with multipart/form-data
    const response = await fetch(uploadUrl, {
      method: 'POST',
      // No need to set Content-Type header as browser will automatically set it with boundary
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload failed:', errorData);
      message.error(`Failed to upload ${type}: ${errorData.error?.message || 'Unknown error'}`);
      return null;
    }

    const data = await response.json();
    return data.secure_url;

  } catch (error) {
    console.error('Upload error:', error);
    message.error(`Failed to upload ${type}. Please try again.`);
    return null;
  }
};

export const customUploadHandler = async (
  options: { 
    file: File;
    onSuccess: (url: string) => void;
    onError: () => void;
  }, 
  type: "video" | "image",
  setUploading: (value: boolean) => void,
  onSuccessCallback: (type: "video" | "image", url: string) => void
) => {
  const { file, onSuccess, onError } = options;

  try {
    setUploading(true);
    
    // Handle file size validation
    const maxSize = type === "video" ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for video, 5MB for image
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize/(1024*1024)}MB limit`);
    }

    const url = await handleUploadFile(file, type);
    if (url) {
      onSuccessCallback(type, url);
      onSuccess(url);
      message.success(`${type} uploaded successfully`);
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Upload handler error:', error);
    message.error(error instanceof Error ? error.message : 'Upload failed');
    onError();
  } finally {
    setUploading(false);
  }
};
