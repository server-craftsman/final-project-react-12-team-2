import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Upload, Button, UploadFile, Select } from "antd";
import { UploadOutlined, PhoneOutlined, BankOutlined, NumberOutlined, UserOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";
import { message } from "antd";
import { AuthService } from "../../../services/authentication/auth.service";

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
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [bankNames, setBankNames] = useState<string[]>([]);
  const [bankLogos, setBankLogos] = useState<{[key: string]: string}>({});

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

  useEffect(() => {
    const fetchBankNames = async () => {
      try {
        const response = await AuthService.getBank();
        setBankNames(response.data.data.map((bank: any) => bank.name));
        
        // Create mapping of bank names to logos
        const logoMapping: {[key: string]: string} = {};
        response.data.data.forEach((bank: any) => {
          logoMapping[bank.name] = bank.logo;
        });
        setBankLogos(logoMapping);
      } catch (error) {
        console.error("Failed to fetch bank names", error);
      }
    };

    fetchBankNames();
  }, []);

  const handleFileUpload = useCallback((file: File, type: 'video' | 'avatar') => {
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error(`File size should not exceed ${type === 'video' ? '50MB' : '10MB'}`);
      return false;
    }

    const allowedTypes = type === 'video' ? ['video/mp4', 'video/avi', 'video/mov', 'video/webm'] : ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      message.error(`Please upload a valid ${type} file`);
      return false;
    }

    if (type === 'video') {
      setUploadingVideo(true);
      // Generate video thumbnail
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = videoUrl;

      video.addEventListener('loadeddata', () => {
        video.currentTime = 10; // Seek to 10 seconds
      });

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        setVideoPreview(canvas.toDataURL());
        URL.revokeObjectURL(videoUrl); // Clean up the object URL
      });
    } else {
      setUploadingAvatar(true);
      // Generate image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    setTimeout(() => {
      const fileUrl = `https://example.com/uploads/${file.name}`;
      form.setFieldsValue({ [`${type}_file`]: { originFileObj: file, url: fileUrl } });
      
      if (type === 'video') {
        setUploadingVideo(false);
      } else {
        setUploadingAvatar(false);
      }
    }, 2000);

    return false;
  }, [form, setUploadingVideo, setUploadingAvatar]);

  return (
    <div className="space-y-8 p-8 bg-white rounded-xl shadow-lg">
      <div className="col-span-1">
        <Form.Item name="phone_number" rules={[{ required: true, message: "Please input your phone number!" }]} className="mb-0">
          <Input prefix={<PhoneOutlined className="text-indigo-600" />} placeholder="Phone Number" className="h-12 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 hover:border-indigo-300 transition duration-200" />
        </Form.Item>
      </div>

      <div className="flex flex-grow gap-6">
        <Form.Item name="avatar_file" label={<span className="text-gray-700 font-medium">Profile Picture</span>} rules={[{ required: true, message: "Please upload an avatar!" }]} className="mb-0">
          <div>
            <Upload 
              accept="image/*" 
              showUploadList={false}
              beforeUpload={(file) => handleFileUpload(file, 'avatar')} 
              fileList={avatarFileList} 
              onChange={({ fileList }) => setAvatarFileList(fileList)}
            >
              <Button icon={<UploadOutlined />} className="w-full h-12 rounded-lg border-2 border-indigo-200 hover:border-indigo-300 hover:text-indigo-600 transition duration-200" loading={uploadingAvatar}>
                Select Avatar
              </Button>
            </Upload>
            {avatarPreview && (
              <div className="mt-4">
                <img src={avatarPreview} alt="Avatar preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>
        </Form.Item>

        <Form.Item name="video_file" label={<span className="text-gray-700 font-medium">Introduction Video</span>} rules={[{ required: true, message: "Please upload an introduction video!" }]} className="mb-0">
          <div>
            <Upload 
              accept="video/*" 
              showUploadList={false}
              beforeUpload={(file) => handleFileUpload(file, 'video')} 
              fileList={videoFileList} 
              onChange={({ fileList }) => setVideoFileList(fileList as UploadFile<any>[])}
            >
              <Button icon={<UploadOutlined />} className="w-full h-12 rounded-lg border-2 border-indigo-200 hover:border-indigo-300 hover:text-indigo-600 transition duration-200" loading={uploadingVideo}>
                Select Video
              </Button>
            </Upload>
            {videoPreview && (
              <div className="mt-4">
                <img src={videoPreview} alt="Video thumbnail" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>
        </Form.Item>
      </div>

      <Form.Item 
        name="description" 
        label={<span className="text-gray-700 font-medium">Professional Description</span>}
        rules={[{ required: true, message: "Please input a description!" }]}
        className="mb-6"
      >
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
          value={String(form.getFieldValue('description') || '')}
        />
      </Form.Item>

      <div className="bg-gray-50 p-8 rounded-xl space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Banking Information</h3>
        <Form.Item 
          name="bank_name" 
          rules={[{ required: true, message: "Please select your bank name!" }]}
          className="mb-0"
        >
          <Select 
            placeholder={<div className="flex items-center gap-2"><BankOutlined className="text-indigo-600" />Select Bank Name</div>}
            className="h-12 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 hover:border-indigo-300 transition duration-200"
          >
            {bankNames.map((bankName) => (
              <Select.Option key={bankName} value={bankName} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <img src={bankLogos[bankName]} alt={bankName} className="h-6 w-6 object-contain" />
                  {bankName}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="bank_account_no" 
          rules={[{ required: true, message: "Please input your bank account number!" }]}
          className="mb-0"
        >
          <Input 
            prefix={<NumberOutlined className="text-indigo-600" />}
            placeholder="Account Number" 
            className="h-12 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 hover:border-indigo-300 transition duration-200"
          />
        </Form.Item>

        <Form.Item 
          name="bank_account_name" 
          rules={[{ required: true, message: "Please input your bank account name!" }]}
          className="mb-0"
        >
          <Input 
            prefix={<UserOutlined className="text-indigo-600" />}
            placeholder="Account Name"
            className="h-12 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 hover:border-indigo-300 transition duration-200" 
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default RegisterInfoOfInstructor;