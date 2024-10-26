import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Input, Upload, Button, UploadFile } from "antd";
import { UploadOutlined, PhoneOutlined, BankOutlined, NumberOutlined, UserOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../services/config/apiClientTiny";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

interface RegisterViaGoogleProps {
  googleId: string;
}

const RegisterViaGoogle: React.FC<RegisterViaGoogleProps> = ({ googleId }) => {
  const { registerGooglePublic } = useAuth();
  const [form] = Form.useForm();
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [password, setPassword] = useState("");

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [videoFileList, setVideoFileList] = useState<UploadFile<any>[]>([]);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile<any>[]>([]);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    // Get Google token from localStorage
    const googleToken = localStorage.getItem("googleToken");
    if (googleToken) {
      try {
        const decodedToken: any = jwtDecode(googleToken);
        // Use sub (Google ID) as password hash
        setPassword(decodedToken.sub);
      } catch (error) {
        console.error("Error decoding Google token:", error);
        message.error("Failed to process Google authentication");
      }
    }
  }, []);

  const handleEditorChange = (content: string) => {
    setDescription(content);
  };

  const handleFileUpload = useCallback((file: File, type: 'video' | 'avatar') => {
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error(`File size should not exceed ${type === 'video' ? '50MB' : '5MB'}`);
      return false;
    }

    const allowedTypes = type === 'video' ? ['video/mp4', 'video/avi', 'video/mov'] : ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      message.error(`Please upload a valid ${type} file`);
      return false;
    }

    if (type === 'video') {
      setUploadingVideo(true);
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = videoUrl;

      video.addEventListener('loadeddata', () => {
        video.currentTime = 1;
      });

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        setVideoPreview(canvas.toDataURL());
        URL.revokeObjectURL(videoUrl);
      });
    } else {
      setUploadingAvatar(true);
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
  }, [form]);

  const handleRegister = async () => {
    try {
      const commonParams = {
        google_id: googleId,
        role,
        password, // Using Google ID as password hash
      };

      const params = role === "student"
        ? {
            ...commonParams,
            // Ensure no additional fields are included for students
          }
        : {
            ...commonParams,
            description,
            phone_number: phoneNumber,
            avatar_url: form.getFieldValue('avatar_file')?.url,
            video_url: form.getFieldValue('video_file')?.url,
            bank_name: bankName,
            bank_account_no: bankAccountNo,
            bank_account_name: bankAccountName,
          };

      const response = await registerGooglePublic(params as any);
      console.log("Registration successful:", response);
    } catch (error) {
      console.error("Failed to register via Google:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value as "student" | "instructor")}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
      </select>
      {role === "instructor" && (
        <div className="space-y-8 p-8 bg-white rounded-xl shadow-lg">
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
              value={description}
            />
          </Form.Item>

          <div className="bg-gray-50 p-8 rounded-xl space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Banking Information</h3>
            <Input 
              prefix={<BankOutlined className="text-indigo-600" />}
              placeholder="Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="h-12 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 hover:border-indigo-300 transition duration-200"
            />
            <Input 
              prefix={<NumberOutlined className="text-indigo-600" />}
              placeholder="Account Number"
              value={bankAccountNo}
              onChange={(e) => setBankAccountNo(e.target.value)}
              className="h-12 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 hover:border-indigo-300 transition duration-200"
            />
            <Input 
              prefix={<UserOutlined className="text-indigo-600" />}
              placeholder="Account Name"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              className="h-12 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 hover:border-indigo-300 transition duration-200"
            />
          </div>
        </div>
      )}
      <button onClick={handleRegister}>Register with Google</button>
    </div>
  );
};

export default RegisterViaGoogle;
