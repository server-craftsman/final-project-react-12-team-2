import { message } from "antd";
import cloudinaryConfig from "../services/config/cloudinaryConfig";

export const handleUploadFile = async (file: File, type: 'video' | 'avatar') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    
    const resourceType = type === 'video' ? 'video' : 'image';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`;

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      message.error(`Failed to upload ${type}`);
      console.error('Upload error:', error);
      return null;
    }
  };

export const customUploadHandler = async (options: any, type: 'video' | 'avatar', setUploading: (value: boolean) => void, onSuccessCallback: (type: 'video' | 'avatar', url: string) => void) => {
  const { file, onSuccess, onError } = options;
  try {
    setUploading(true);
    const url = await handleUploadFile(file, type);
    if (url) {
      onSuccessCallback(type, url);
      onSuccess();
      message.success(`${type} uploaded successfully`);
    } else {
      onError();
    }
  } catch (error) {
    onError();
  } finally {
    setUploading(false);
  }
};
