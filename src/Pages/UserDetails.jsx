import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Card,
  Row,
  Col,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";
import Sidebar from "../Components/SideBar";
import { useParams } from "react-router-dom";

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch user data
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.BASE_URL}/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      message.error("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${config.BASE_URL}/api/users/${userId}`
      );
      if (response.status === 200) {
        message.success("User deleted successfully!");
        navigate("/users"); // Redirect to user list page
      }
    } catch (error) {
      message.error("Failed to delete user.");
    }
  };

  // Handle update action
  const handleUpdate = async (values) => {
    const { username, password } = values;
    try {
      setLoading(true);
      const response = await axios.put(
        `${config.BASE_URL}/api/users/${userId}`,
        {
          username,
          password,
        }
      );
      if (response.status === 200) {
        message.success("User updated successfully!");
        setUser(response.data); // Update the displayed user data
        setIsEditModalVisible(false);
      }
    } catch (error) {
      message.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]} justify="center">
        {/* Sidebar on mobile */}
        <Col xs={24} sm={6} md={6} lg={4}>
          <Sidebar />
        </Col>

        {/* Main content */}
        <Col xs={24} sm={18} md={12} lg={10}>
          <Card
            title="User Details"
            bordered={false}
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
            }}
          >
            {user ? (
              <div>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {user.isActive ? "Active" : "Inactive"}
                </p>
                <p>
                  <strong>Created At:</strong> {user.createdAt}
                </p>
                <p>
                  <strong>Updated At:</strong> {user.updatedAt}
                </p>

                <Button
                  type="primary"
                  onClick={() => setIsEditModalVisible(true)}
                  style={{ marginRight: "10px" }}
                >
                  Update
                </Button>
                <Button type="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </Card>
        </Col>
      </Row>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={form}
          onFinish={handleUpdate}
          initialValues={{ username: user?.username, password: "" }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDetails;
