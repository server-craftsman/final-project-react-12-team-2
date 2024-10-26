import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Input, Upload, Button, UploadFile } from "antd";
import { UploadOutlined, PhoneOutlined, BankOutlined, NumberOutlined, UserOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../services/config/apiClientTiny";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../const/router.path";
interface RegisterViaGoogleProps {
  googleId: string;
}

const RegisterViaGoogle: React.FC<RegisterViaGoogleProps> = ({ googleId }) => {
  const { registerGooglePublic } = useAuth();
  const [form] = Form.useForm();
  const navigate = useNavigate();
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
    const googleToken = localStorage.getItem("googleToken");
    if (googleToken) {
      try {
        const decodedToken: any = jwtDecode(googleToken);
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
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // Increased video size to 100MB
    if (file.size > maxSize) {
      message.error(`File size should not exceed ${type === 'video' ? '100MB' : '5MB'}`);
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
        video.currentTime = 30; // Changed to 30 seconds for a longer preview
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
        password,
      };

      const params = role === "student"
        ? {
            ...commonParams,
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

      await registerGooglePublic(params as any);
      message.success("You have successfully registered your profile for the instructor role. Please wait for admin to review the application and notify you via email!");
      navigate(ROUTER_URL.LOGIN);
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.email) {
        message.error("This email is already registered. Please use a different email.");
      } else {
        console.error("Failed to register via Google:", error);
        message.error("An error occurred during registration. Please try again.");
      }
    }
  };

  return (
    <Form form={form} layout="vertical" className="w-full max-w-[1200px] mx-auto p-6">
      <Form.Item 
        label="Phone Number"
        name="phone_number"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
        className="mb-4"
      >
        <Input
          prefix={<PhoneOutlined className="text-gray-400" />}
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="h-10 rounded-lg"
        />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        className="mb-6"
      >
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value as "student" | "instructor")}
          className="w-full h-10 rounded-lg border border-gray-300 px-3"
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
      </Form.Item>

      {role === "instructor" && (
        <div className="space-y-8 bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item 
              name="avatar_file" 
              label="Profile Picture"
              rules={[{ required: true, message: "Please upload an avatar!" }]}
            >
              <div className="space-y-4">
                <Upload 
                  accept="image/*" 
                  showUploadList={false}
                  beforeUpload={(file) => handleFileUpload(file, 'avatar')} 
                  fileList={avatarFileList} 
                  onChange={({ fileList }) => setAvatarFileList(fileList)}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    className="w-full h-12 rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600" 
                    loading={uploadingAvatar}
                  >
                    Select Avatar
                  </Button>
                </Upload>
                {avatarPreview && (
                  <img src={avatarPreview} alt="Avatar preview" className="w-32 h-32 object-cover rounded-lg" />
                )}
              </div>
            </Form.Item>

            <Form.Item 
              name="video_file" 
              label="Introduction Video"
              rules={[{ required: true, message: "Please upload an introduction video!" }]}
            >
              <div className="space-y-4">
                <Upload 
                  accept="video/*" 
                  showUploadList={false}
                  beforeUpload={(file) => handleFileUpload(file, 'video')} 
                  fileList={videoFileList} 
                  onChange={({ fileList }) => setVideoFileList(fileList)}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    className="w-full h-12 rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600" 
                    loading={uploadingVideo}
                  >
                    Select Video
                  </Button>
                </Upload>
                {videoPreview && (
                  <img src={videoPreview} alt="Video thumbnail" className="w-32 h-32 object-cover rounded-lg" />
                )}
              </div>
            </Form.Item>
          </div>

          <Form.Item 
            name="description" 
            label="Professional Description"
            rules={[{ required: true, message: "Please input a description!" }]}
          >
            <Editor
              apiKey={TINY_API_KEY}
              init={{
                height: 300,
                menubar: false,
                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                  'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
                toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help'
              }}
              onEditorChange={handleEditorChange}
              value={description}
            />
          </Form.Item>

          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Banking Information</h3>
            
            <Form.Item name="bank_name" label="Bank Name">
              <Input 
                prefix={<BankOutlined className="text-blue-600" />}
                placeholder="Enter bank name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item name="bank_account_no" label="Account Number">
              <Input 
                prefix={<NumberOutlined className="text-blue-600" />}
                placeholder="Enter account number"
                value={bankAccountNo}
                onChange={(e) => setBankAccountNo(e.target.value)}
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item name="bank_account_name" label="Account Name">
              <Input 
                prefix={<UserOutlined className="text-blue-600" />}
                placeholder="Enter account name"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                className="h-12 rounded-lg"
              />
            </Form.Item>
          </div>
        </div>
      )}

      <Form.Item className="mt-6">
        <Button 
          type="primary" 
          onClick={handleRegister}
          className="w-full h-12 rounded-lg bg-[#1a237e] hover:bg-[#02005dc6] text-white font-medium"
        >
          Register with Google
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterViaGoogle;
