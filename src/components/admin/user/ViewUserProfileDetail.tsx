import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Form, Input, Button, Modal, message } from "antd";
import { HomeOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, EditOutlined } from "@ant-design/icons";
import { userStatusColor } from "../../../utils/userStatus";
import { userRoleColor } from "../../../utils/userRole";
import { helpers } from "../../../utils";
import { ChangeStatusParams, ChangeRoleParams } from "../../../models/api/request/admin/user.request.model";
import { User } from "../../../models/api/responsive/users/users.model";
// import { UserRole } from "../../../models/prototype/User";
import { UserService } from "../../../services/admin/user.service";
import { ROUTER_URL } from "../../../const/router.path";
// import parse from "html-react-parser";
import { HttpException } from "../../../app/exceptions";
import { HTTP_STATUS, UserRoles } from "../../../app/enums";

const ViewUserProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await UserService.getUserDetails(id as string);
      if (response?.data?.data) {
        const userData: User = {
          ...response.data.data,
          dob: new Date(response.data.data.dob),
          verification_token_expires: new Date(response.data.data.verification_token_expires),
          created_at: new Date(response.data.data.created_at),
          updated_at: new Date(response.data.data.updated_at)
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        message.error(error.status === HTTP_STATUS.NOT_FOUND ? "User not found" : "Failed to fetch user details");
      }
      console.error("Failed to fetch user details:", error);
      setUser(null);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const roleOptions = useMemo(() => Object.values(UserRoles).filter((role) => role !== UserRoles.ALL), []);

  const handleChangeStatus = useCallback(
    async (status: boolean) => {
      Modal.confirm({
        title: "Confirm Status Change",
        content: `Are you sure you want to turn ${status ? "ON" : "OFF"} the status for this user?`,
        onOk: async () => {
          try {
            const response = await UserService.changeStatus(id as string, { user_id: id, status } as ChangeStatusParams);
            if (response.data.success) {
              message.success(`User status changed successfully to ${status ? "ON" : "OFF"}.`);
              setUser((prev) => (prev ? { ...prev, status } : null));
            }
          } catch (error) {
            message.error(error instanceof HttpException ? error.message : "Failed to change user status");
            console.error("Failed to change user status:", error);
          }
        }
      });
    },
    [id]
  );

  const handleChangeRole = useCallback(
    async (currentRole: UserRoles) => {
      Modal.confirm({
        title: "Change New Role",
        content: (
          <select id="roleSelect" className="mt-2 w-full rounded-md border p-2" defaultValue={currentRole}>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.toUpperCase()}
              </option>
            ))}
          </select>
        ),
        onOk: async () => {
          const newRole = (document.getElementById("roleSelect") as HTMLSelectElement).value as UserRoles;
          if (newRole === currentRole) return;

          Modal.confirm({
            title: "Confirm Role Change",
            content: `Are you sure you want to change the role from ${currentRole.toUpperCase()} to ${newRole.toUpperCase()}?`,
            onOk: async () => {
              try {
                const response = await UserService.changeRole(id as string, { user_id: id, role: newRole } as ChangeRoleParams);
                if (response.data.success) {
                  message.success(`Role updated to ${newRole.toUpperCase()}`);
                  setUser((prev) => (prev ? { ...prev, role: newRole } : null));
                }
              } catch {
                message.error("Failed to update role");
              }
            }
          });
        }
      });
    },
    [id, roleOptions]
  );

  const handleDeleteUser = useCallback(async () => {
    try {
      const response = await UserService.deleteUser(id as string);
      if (response.data.success) {
        message.success("User deleted successfully.");
        navigate(ROUTER_URL.ADMIN.MANAGE_USER);
      }
    } catch (error) {
      message.error(error instanceof HttpException ? error.message : "An error occurred while deleting the user");
      console.error("Failed to delete user:", error);
    }
  }, [id, navigate]);

  const renderUserContent = useMemo(() => {
    if (!user) {
      return <div className="text-center text-xl font-bold text-gray-500">User not found</div>;
    } else {
      return (
        <div className="max-w-10xl mx-auto rounded-lg bg-white p-8 shadow-lg">
          <Row gutter={[24, 24]} align="top">
            <Col xs={24} lg={8} className="text-center">
              <img src={user.avatar_url || ""} alt={`${user.name}'s avatar`} className="mx-auto h-40 w-40 rounded-full border-4 border-gray-300 shadow-md" />
              <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{helpers.formatPhoneNumber(user.phone_number as string)}</p>
            </Col>

            <Col xs={24} lg={16}>
              <div className={`mb-6 rounded-md bg-[#1a237e] p-4 text-white`}>
                <h3 className="text-lg font-semibold">Information</h3>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {helpers.formatPhoneNumber(user.phone_number as string)}</p>
              </div>

              <Form layout="vertical" className="space-y-6">
                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Role" className="mb-4">
                      <div className="flex items-center gap-4">
                        <span className={`rounded-md px-4 py-2 text-[#000] ${userRoleColor(user.role as UserRoles)}`}>{user.role.toUpperCase()}</span>
                        <Button onClick={() => handleChangeRole(user.role as UserRoles)} icon={<EditOutlined />} type="primary" size="small" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Status" className="mb-4">
                      <div className="flex items-center gap-4">
                        <Input value={user.status ? "Active" : "Inactive"} readOnly className={`${userStatusColor(user.status)}`} />
                        <Button onClick={() => handleChangeStatus(!user.status)} className={`ml-2 rounded-md px-4 py-2 font-medium transition-all duration-200 ${user.status ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"}`}>
                          {user.status ? <LockOutlined /> : <UnlockOutlined />}
                        </Button>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Date of Birth" className="mb-4">
                      <Input value={helpers.formatDate(user.dob)} readOnly className="rounded-md border border-gray-300 bg-gray-50 p-2" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Balance" className="mb-4">
                      <Input value={user.balance} readOnly className="rounded-md border border-gray-300 bg-gray-50 p-2" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleDeleteUser} type="primary" danger className="mr-2">
              <DeleteOutlined />
            </Button>
            <Button onClick={() => navigate(ROUTER_URL.ADMIN.MANAGE_USER)} type="default">
              <HomeOutlined />
            </Button>
          </div>
        </div>
      );
    }
  }, [user, handleDeleteUser, navigate, handleChangeRole, handleChangeStatus]);

  return <>{renderUserContent}</>;
};

export default memo(ViewUserProfileDetail);
