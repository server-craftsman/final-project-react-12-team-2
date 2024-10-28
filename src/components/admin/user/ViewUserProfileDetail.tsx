import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Form, Input, Popconfirm, Button, Modal, message } from "antd";
import { HomeOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, EditOutlined } from "@ant-design/icons";
import { userStatusColor } from "../../../utils/userStatus";
import { userRoleColor } from "../../../utils/userRole";
import { helpers } from "../../../utils";
import { ChangeStatusParams, ChangeRoleParams } from "../../../models/api/request/admin/user.request.model";
import { User } from "../../../models/api/responsive/users/users.model";
// import { UserRole } from "../../../models/prototype/User";
import { UserService } from "../../../services/admin/user.service";
import { ROUTER_URL } from "../../../const/router.path";
import parse from "html-react-parser";
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
    if (!user) return <div className="text-center text-xl font-bold text-gray-500">User not found</div>;

    return (
      <div className="max-w-10xl mx-auto rounded-lg bg-white p-6 shadow-lg">
        <Row gutter={[16, 16]} align="top">
          <Col xs={24} lg={16}>
            <Form layout="vertical" className="space-y-4">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Name" className="mb-2">
                    <Input value={user.name} readOnly className="bg-gray-50" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Role" className="mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 ${userRoleColor(user.role as UserRoles)}`}>{user.role.toUpperCase()}</span>
                      <Button onClick={() => handleChangeRole(user.role as UserRoles)} icon={<EditOutlined />} type="primary" size="small" />
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Email" className="mb-2">
                    <Input value={user.email} readOnly className="bg-gray-50" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Phone" className="mb-2">
                    <Input value={helpers.formatPhoneNumber(user.phone_number as string) || ""} readOnly className="bg-gray-50" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Status" className="mb-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={user.status ? "Active" : "Inactive"}
                        readOnly
                        className="w-32 border-none bg-gradient-to-r from-gray-50 to-gray-100 font-medium shadow-sm"
                        style={{
                          color: userStatusColor(user.status),
                          borderRadius: "0.5rem",
                          padding: "0.5rem 1rem",
                          textAlign: "center"
                        }}
                      />
                      <Button onClick={() => handleChangeStatus(!user.status)} className={`ml-2 rounded-full px-4 py-1 font-medium transition-all duration-200 ${user.status ? "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600" : "bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600"}`}>
                        {user.status ? <LockOutlined /> : <UnlockOutlined />}
                      </Button>
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Description" className="mb-2">
                    <div className="max-h-20 overflow-y-auto rounded bg-gray-50 p-2">{parse(user.description || "")}</div>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Date of Birth" className="mb-2">
                    <Input value={helpers.formatDate(user.dob)} readOnly className="bg-gray-50" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Balance" className="mb-2">
                    <Input value={user.balance} readOnly className="bg-gray-50" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col xs={24} lg={8} className="text-center">
            <img src={user.avatar_url || ""} alt={`${user.name}'s avatar`} className="mx-auto h-32 w-32 rounded-full border-2 border-gray-200 shadow" />
            <h2 className="mt-3 text-xl font-bold">{user.name}</h2>
            <div className="mt-4 space-x-2">
              <Popconfirm title="Delete this account?" onConfirm={handleDeleteUser}>
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
              <Button icon={<HomeOutlined />} onClick={() => navigate("/admin/manage-user")}>
                Back
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }, [user, handleDeleteUser, navigate, handleChangeRole, handleChangeStatus]);

  return renderUserContent;
};

export default memo(ViewUserProfileDetail);
