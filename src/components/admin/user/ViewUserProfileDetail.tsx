import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Popconfirm,
  Button,
  Modal,
  message,
} from "antd";
import {
  HomeOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { userStatusColor } from "../../../utils/userStatus";
import { userRoleColor } from "../../../utils/userRole";

//model and service
import { ChangeStatusParams, ChangeRoleParams } from "../../../models/api/request/admin/user.request.model";
import { User } from "../../../models/api/responsive/users/users.model";
import { UserRole } from "../../../models/prototype/User";
// import { GetUserDetailsResponse } from "../../../models/api/responsive/admin/user.responsive.model";
import { UserService } from "../../../services/admin/user.service";
import parse from 'html-react-parser';

const ViewUserProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await UserService.getUserDetails(id as string);
      if (response?.data?.data) {
        const userData: User = {
          ...response.data.data,
          dob: new Date(response.data.data.dob),
          verification_token_expires: new Date(response.data.data.verification_token_expires),
          created_at: new Date(response.data.data.created_at),
          updated_at: new Date(response.data.data.updated_at),
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setUser(null);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // const rolesToInclude = [
  //   UserRole.instructor,
  //   UserRole.admin,
  //   UserRole.student,
  // ];

  // Memoize handlers to prevent unnecessary recreations
  const handleChangeStatus = useCallback(async (status: boolean) => {
    Modal.confirm({
      title: "Confirm Status Change",
      content: `Are you sure you want to turn ${status ? "ON" : "OFF"} the status for this user?`,
      onOk: async () => {
        try {
          const params = { user_id: id, status };
          const response = await UserService.changeStatus(id as string, params as ChangeStatusParams);

          if (response.data.success) {
            message.success(`User status changed successfully to ${status ? "ON" : "OFF"}.`);
            setUser((prevUser) => prevUser ? { ...prevUser, status } : null);
          } else {
            message.error("Failed to change user status. Please try again.");
          }
        } catch (error) {
          console.error("Failed to change user status:", error);
          message.error("An error occurred while changing the user status. Please try again.");
        }
      },
    });
  }, [id]);

  const handleChangeRole = useCallback(async (currentRole: UserRole) => {
    const roleOptions = useMemo(() => 
      Object.values(UserRole).filter(role => role !== UserRole.all),
    []);
    
    Modal.confirm({
      title: 'Change New Role',
      content: (
        <select 
          id="roleSelect"
          className="w-full p-2 border rounded-md mt-2"
          defaultValue={currentRole}
        >
          {roleOptions.map(role => (
            <option key={role} value={role}>{role.toUpperCase()}</option>
          ))}
        </select>
      ),
      onOk: async () => {
        const newRole = (document.getElementById('roleSelect') as HTMLSelectElement).value as UserRole;
        if (newRole === currentRole) {
          return;
        }

        Modal.confirm({
          title: 'Confirm Role Change',
          content: `Are you sure you want to change the role from ${currentRole.toUpperCase()} to ${newRole.toUpperCase()}?`,
          onOk: async () => {
            try {
              const response = await UserService.changeRole(id as string, { 
                user_id: id, 
                role: newRole 
              } as ChangeRoleParams);

              if (response.data.success) {
                message.success(`Role updated to ${newRole.toUpperCase()}`);
                setUser(prevUser => prevUser ? {...prevUser, role: newRole} : null);
              }
            } catch (error) {
              message.error("Failed to update role");
            }
          }
        });
      }
    });
  }, [id]);

  // Memoize the rendered content for better performance
  const renderUserContent = useMemo(() => {
    if (!user) {
      return (
        <div className="text-center text-xl font-bold text-gray-500">
          User not found
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-10xl rounded-lg bg-white p-8 shadow-xl">
        <Row gutter={24} align="middle">
          <Col span={16}>
            <Form layout="vertical">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Name" className="font-medium text-gray-700">
                    <Input
                      value={user.name.split(" ")[0]}
                      readOnly
                      className="bg-gray-100"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Role" className="font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full ${userRoleColor(user.role as UserRole)}`}>
                        {user.role.toUpperCase()}
                      </span>
                      <button 
                        onClick={() => handleChangeRole(user.role as UserRole)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
                      >
                        <span className="text-sm"><EditOutlined /></span>
                      </button>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Email Address"
                    className="font-medium text-gray-700"
                  >
                    <Input
                      value={user.email}
                      readOnly
                      className="bg-gray-100"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Phone Number"
                    className="font-medium text-gray-700"
                  >
                    <Input
                      value={user.phone_number}
                      readOnly
                      className="bg-gray-100"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Status"
                    className="font-medium text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <Input
                        value={user.status ? "Active" : "Inactive"}
                        readOnly
                        className="w-32 border-none bg-gradient-to-r from-gray-50 to-gray-100 font-medium shadow-sm"
                        style={{
                          color: userStatusColor(user.status),
                          borderRadius: "0.5rem",
                          padding: "0.5rem 1rem",
                          textAlign: "center",
                        }}
                      />{" "}
                      <Button
                        onClick={() => handleChangeStatus(!user.status)}
                        className={`ml-2 rounded-full px-4 py-1 font-medium transition-all duration-200 ${
                          user.status
                            ? "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600"
                            : "bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600"
                        }`}
                      >
                        {user.status ? <LockOutlined /> : <UnlockOutlined />}
                      </Button>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Description"
                    className="font-medium text-gray-700"
                  >
                    <div className="bg-gray-100 p-2 rounded">
                      {parse(user.description || '')}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Date of Birth"
                    className="font-medium text-gray-700"
                  >
                    <Input
                      value={user.dob.toDateString()}
                      readOnly
                      className="bg-gray-100"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Balance"
                    className="font-medium text-gray-700"
                  >
                    <Input
                      value={user.balance}
                      readOnly
                      className="bg-gray-100"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={8} className="text-center">
            <img
              src={user.avatar_url || ""}
              alt={`${user.name}'s avatar`}
              className="mx-auto h-40 w-40 rounded-full border-4 border-gray-200 shadow-md"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {user.name}
            </h2>
            <div className="mt-6 flex justify-center">
              <Popconfirm
                title="Are you sure you want to delete this account?"
                onConfirm={() => console.log("Account deleted")}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  className="bg-red-500 transition duration-300 hover:bg-red-600"
                >
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </Col>
        </Row>
        <Button
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => navigate("/admin/manage-user")}
          className="mt-8 bg-blue-600 transition duration-300 hover:bg-blue-700"
        >
          Back to Home
        </Button>
      </div>
    );
  }, [user, handleChangeStatus, handleChangeRole, navigate]);

  return renderUserContent;
};

export default memo(ViewUserProfileDetail);