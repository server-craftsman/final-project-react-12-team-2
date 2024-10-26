import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Upload, Button, UploadFile } from "antd";
import { UploadOutlined, PhoneOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";
import { message } from "antd";

interface RegisterInfoOfInstructorProps {
  form: any;
  uploadingVideo: boolean;
  uploadingAvatar: boolean;
  setUploadingVideo: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadingAvatar: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterInfoOfInstructor: React.FC<RegisterInfoOfInstructorProps> = ({
  form,
  uploadingVideo,
  uploadingAvatar,
  setUploadingVideo,
  setUploadingAvatar,
}) => {
  const [videoFileList, setVideoFileList] = useState<UploadFile<any>[]>([]);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile<any>[]>([]);

  const handleEditorChange = (content: string) => {
    if (form) {
      form.setFieldsValue({ description: content });
    }
  };

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ description: '' });
    }
  }, [form]);

  const handleFileUpload = useCallback((file: File, type: 'video' | 'avatar') => {
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for avatar
    if (file.size > maxSize) {
      message.error(`File size should not exceed ${type === 'video' ? '50MB' : '5MB'}`);
      return false;
    }

    const allowedTypes = type === 'video' ? ['video/mp4', 'video/avi', 'video/mov'] : ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      message.error(`Please upload a valid ${type} file`);
      return false;
    }

    // Set the loading state
    if (type === 'video') {
      setUploadingVideo(true);
    } else {
      setUploadingAvatar(true);
    }

    // Simulate an upload process
    setTimeout(() => {
      // Simulate a generated URL for the uploaded file
      const fileUrl = `https://example.com/uploads/${file.name}`;

      // Set the form field value
      form.setFieldsValue({ [`${type}_file`]: { originFileObj: file, url: fileUrl } });

      // Reset the loading state
      if (type === 'video') {
        setUploadingVideo(false);
      } else {
        setUploadingAvatar(false);
      }
    }, 2000); // Simulate a 2-second upload delay

    return false; // Prevent automatic upload
  }, [form, setUploadingVideo, setUploadingAvatar]);

  return (
    <div className="mt-4">
      <Form.Item name="phone_number" rules={[{ required: true, message: "Please input your phone number!" }]}>
        <Input prefix={<PhoneOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Phone Number" />
      </Form.Item>

      <Form.Item name="description" rules={[{ required: true, message: "Please input a description!" }]}>
        <Editor
          apiKey={TINY_API_KEY}
          init={{
            height: 300,
            menubar: false,
            plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
              'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
            toolbar: 'undo redo | formatselect | bold italic | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | help'
          }}
          onEditorChange={handleEditorChange}
          value={String(form.getFieldValue('description') || '')} // Ensure value is a string
        />
      </Form.Item>

      <div className="flex justify-between">
        <Form.Item name="video_file" label="Video" rules={[{ required: true, message: "Please upload an introduction video!" }]}>
          <Upload
            accept="video/*"
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            beforeUpload={(file) => handleFileUpload(file, 'video')}
            fileList={videoFileList}
            onChange={({ fileList }) => setVideoFileList(fileList as UploadFile<any>[])}
          >
            <Button 
              icon={<UploadOutlined className="site-form-item-icon text-indigo-600" />} 
              className="h-24 w-24 rounded-full"
              loading={uploadingVideo}
            >
              Select Video
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item name="avatar_file" label="Avatar" rules={[{ required: true, message: "Please upload an avatar!" }]}>
          <Upload
            accept="image/*"
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            beforeUpload={(file) => handleFileUpload(file, 'avatar')}
            fileList={avatarFileList}
            onChange={({ fileList }) => setAvatarFileList(fileList)}
          >
            <Button 
              icon={<UploadOutlined className="site-form-item-icon text-indigo-600" />} 
              className="h-24 w-24 rounded-full"
              loading={uploadingAvatar}
            >
              Select Avatar
            </Button>
          </Upload>
        </Form.Item>
      </div>
    </div>
  );
};

export default RegisterInfoOfInstructor;
