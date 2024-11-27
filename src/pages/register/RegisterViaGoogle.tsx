import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Form, Input, Upload, Button, UploadFile, Select, Col, Row } from "antd";
import { UploadOutlined, PhoneOutlined, NumberOutlined, BankOutlined, UserOutlined } from "@ant-design/icons";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../const/router.path";
// import { handleUploadFile } from "../../utils/upload";
import { BaseService } from "../../services/config/base.service";
import { AuthService } from "../../services/authentication/auth.service";
// import TinyMCEEditor from "../../components/generic/tiny/TinyMCEEditor";
import Editor from "../../components/generic/tiny/Editor";
interface RegisterViaGoogleProps extends React.HTMLAttributes<HTMLFormElement> {
  googleId: string;
}

const RegisterViaGoogle: React.FC<RegisterViaGoogleProps> = React.memo(({ googleId }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [password, setPassword] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [videoFileList, setVideoFileList] = useState<UploadFile<any>[]>([]);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile<any>[]>([]);
  const [bankData, setBankData] = useState<{
    banks: any[];
    bankNames: string[];
    bankLogos: { [key: string]: string };
  }>({
    banks: [],
    bankNames: [],
    bankLogos: {}
  });

  // Fetch banks data only once on mount
  useEffect(() => {
    let isMounted = true;

    const fetchBanks = async () => {
      try {
        const response = await AuthService.getBank();
        if (isMounted) {
          const banks = response.data.data;
          const bankNames = banks.map((bank: any) => bank.name);
          const bankLogos = banks.reduce((acc: { [key: string]: string }, bank: any) => {
            acc[bank.name] = bank.logo;
            return acc;
          }, {});

          setBankData({ banks, bankNames, bankLogos });
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
        if (isMounted) {
          message.error("Failed to load bank list");
        }
      }
    };

    fetchBanks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Decode Google token only once on mount
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

  const handleEditorChange = useCallback((content: string) => {
    setDescription(content);
  }, []);

  const handleFileUpload = useCallback(async (file: File, type: "image" | "video") => {
    try {
      const url = await BaseService.uploadFile(file, type);
      if (!url) throw new Error(`Failed to upload ${type}`);
      return url;
    } catch (error: any) {
      throw new Error(`${type} upload failed: ${error.message}`);
    }
  }, []);

  const handleAvatarPreview = useCallback(
    async (file: File) => {
      // setUploadingAvatar(true);
      try {
        const url = await handleFileUpload(file, "image");
        form.setFieldsValue({ avatar_url: url });
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        // setUploadingAvatar(false);
        console.log("handleAvatarPreview");
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  const handleVideoPreview = useCallback(
    async (file: File) => {
      // setUploadingVideo(true);
      try {
        const url = await handleFileUpload(file, "video");
        form.setFieldsValue({ video_url: url });
        const videoElement = document.createElement("video");
        videoElement.controls = true;
        videoElement.src = URL.createObjectURL(file);
        setVideoPreview(videoElement.outerHTML);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        // setUploadingVideo(false);
        console.log("handleVideoPreview");
      }
      return false; // Prevent default upload behavior
    },
    [handleFileUpload, form]
  );

  const handleRegister = useCallback(async () => {
    // setIsLoading(true);
    try {
      const descriptionValue = description || "";

      const commonParams = {
        google_id: googleId,
        role,
        password,
        description: descriptionValue,
        avatar_url: form.getFieldValue("avatar_url") || "",
        phone_number: form.getFieldValue("phone_number"),
        video_url: form.getFieldValue("video_url") || "",
        bank_account_name: form.getFieldValue("bank_account_name"),
        bank_account_no: form.getFieldValue("bank_account_no"),
        bank_name: form.getFieldValue("bank_name")
      };

      if (role === "instructor") {
        const requiredFields = ["phone_number", "description", "bank_account_name", "bank_account_no", "bank_name"];
        const missingFields = requiredFields.filter((field) => (field === "description" ? !descriptionValue : !form.getFieldValue(field)));

        if (missingFields.length > 0) {
          throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
        }

        const avatarFile = avatarFileList[0]?.originFileObj;
        const videoFile = videoFileList[0]?.originFileObj;

        if (!avatarFile || !videoFile) {
          throw new Error("Please upload both avatar and video files");
        }

        // Upload files only if URLs are not already set
        if (!commonParams.avatar_url || !commonParams.video_url) {
          try {
            const [avatarUrl, videoUrl] = await Promise.all([commonParams.avatar_url || handleFileUpload(avatarFile, "image"), commonParams.video_url || handleFileUpload(videoFile, "video")]);

            commonParams.avatar_url = avatarUrl;
            commonParams.video_url = videoUrl;
          } catch (uploadError: any) {
            throw new Error(`File upload failed: ${uploadError.message}. Please try again.`);
          }
        }
      }

      const response = await AuthService.registerGooglePublic(commonParams as any);

      if (response.data.success) {
        message.success("Registration successful! Please wait for admin review.");
        navigate(ROUTER_URL.LOGIN);
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      if (error.response?.data?.code === 11000) {
        message.error("This email is already registered");
      } else {
        console.error("Registration failed:", error);
        message.error(error.message || "Registration failed");
      }
    } finally {
      // setIsLoading(false);
      // setUploadingAvatar(false);
      // setUploadingVideo(false);
      console.log("handleRegister");
    }
  }, [googleId, role, form, navigate, password, avatarFileList, videoFileList, description, handleFileUpload]);

  const renderBankingFields = useMemo(
    () => (
      <div className="space-y-4 rounded-xl bg-gray-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Banking Information</h3>

        <Form.Item name="bank_name" label="Bank Name">
          <Select
            value={bankName}
            onChange={setBankName}
            placeholder={
              <div className="flex items-center gap-2">
                <BankOutlined className="text-indigo-600" />
                Select Bank Name
              </div>
            }
            // className="w-full h-12 rounded-lg border border-gray-300 px-3"
          >
            {bankData.banks.map((bank) => (
              <Select.Option key={bank.id} value={bank.name}>
                <div className="flex items-center">
                  <img src={bank.logo} alt={bank.name} className="mr-2 inline-block h-6 w-6" /> {bank.bank_code} - {bank.name}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="bank_account_no" label="Account Number">
          <Input prefix={<NumberOutlined className="text-blue-600" />} placeholder="Enter account number" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} className="h-12 rounded-lg" />
        </Form.Item>

        <Form.Item name="bank_account_name" label="Account Name">
          <Input prefix={<UserOutlined className="text-blue-600" />} placeholder="Enter account name" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} className="h-12 rounded-lg" />
        </Form.Item>
      </div>
    ),
    [bankName, bankAccountNo, bankAccountName, bankData.banks]
  );

  return (
    <Form form={form} layout="vertical" className="mx-auto w-full max-w-[1200px] p-6">
      <Form.Item
        label="Phone Number"
        name="phone_number"
        rules={[
          { required: true, message: "Please input your phone number!" },
          { pattern: /^\d{10}$/, message: "Phone number must be 10 digits!" },
          { type: "string", message: "Phone number must be a string!" }
        ]}
        className="mb-4"
      >
        <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="h-10 rounded-lg" />
      </Form.Item>

      <Form.Item label="Role" name="role" className="mb-6">
        <select value={role} onChange={(e) => setRole(e.target.value as "student" | "instructor")} className="h-10 w-full rounded-lg border border-gray-300 px-3">
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
      </Form.Item>

      {role === "instructor" && (
        <div className="space-y-8 rounded-xl bg-white p-8 shadow-lg">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="avatar_url" label="Profile Picture" rules={[{ required: true, message: "Please upload an avatar!" }, { type: "url", message: "Avatar must be a valid URL!" }]}>
                <div className="space-y-4">
                  <Upload accept="image/*" showUploadList={false} beforeUpload={handleAvatarPreview} fileList={avatarFileList} onChange={({ fileList }) => setAvatarFileList(fileList)}>
                    <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:text-blue-600">
                      Select Avatar
                    </Button>
                  </Upload>
                  {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className="h-32 w-32 rounded-lg object-cover" />}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="video_url" label="Introduction Video" rules={[{ required: true, message: "Please upload an introduction video!" }, { type: "url", message: "Video must be a valid URL!" }]}>
                <div className="space-y-4">
                  <Upload accept="video/*" showUploadList={false} beforeUpload={handleVideoPreview} fileList={videoFileList} onChange={({ fileList }) => setVideoFileList(fileList as UploadFile<any>[])}>
                    <Button icon={<UploadOutlined />} className="h-12 w-full rounded-lg border-2 border-indigo-200 transition duration-200 hover:border-indigo-300 hover:text-indigo-600">
                      Select Video
                    </Button>
                  </Upload>
                  {videoPreview && <div dangerouslySetInnerHTML={{ __html: videoPreview }} />}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Professional Description"
            rules={[
              { required: true, message: "Please input a description!" },
              { min: 10, message: "Description must be at least 10 characters!" },
              { type: "string", message: "Description must be a string!" }
            ]}
          >
            <Editor initialValue={description} onEditorChange={handleEditorChange} />
          </Form.Item>

          {renderBankingFields}
        </div>
      )}

      <Form.Item className="mt-6">
        <Button type="primary" onClick={handleRegister} className="h-12 w-full rounded-lg bg-[#1a237e] font-medium text-white hover:bg-[#02005dc6]">
          Register with Google
        </Button>
      </Form.Item>
    </Form>
  );
});

export default RegisterViaGoogle;
