import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import axios from "axios";
import Sidebar from "../Components/SideBar";
import config from "../config";
import { useNavigate } from "react-router-dom";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleMore = (user) => {
    navigate(`/user-details/${user.id}`);
  };
  const handleResetPassword = async (values) => {
    const { newPassword, confirmPassword } = values;
    try {
      await axios.post(`${config.BASE_URL}/reset-password`, {
        username: editingUser.username,
        newPassword,
        confirmPassword,
      });
      notification.success({ message: "Password reset successfully!" });
      setIsModalVisible(false);
    } catch (error) {
      notification.error({ message: "Error resetting password" });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <span data-column="Username">
          {isMobile ? `Username - ${text}` : text}
        </span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <span data-column="Role">{isMobile ? `Role - ${text}` : text}</span>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <span data-column="Address">
          {isMobile ? `Address - ${text}` : text}
        </span>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => (
        <span data-column="Mobile">{isMobile ? `Mobile - ${text}` : text}</span>
      ),
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (text) => (
        <span data-column="Active">{isMobile ? `Active - ${text}` : text}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          onClick={() => handleEdit(record)}
          style={{
            padding: "5px 20px",
            fontSize: "14px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            borderColor: "#4CAF50",
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "More",
      key: "more",
      render: (text, record) => (
        <Button
          onClick={() => handleMore(record)}
          style={{
            padding: "5px 20px",
            fontSize: "14px",
            backgroundColor: "#FF8000",
            color: "#fff",
            borderColor: "#FF8000",
          }}
        >
          More
        </Button>
      ),
    },
  ];

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          User Management
        </h2>

        {/* Table for User Data */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          style={{ width: "100%" }}
          className="responsive-table"
        />

        {/* Modal for Editing User */}
        <Modal
          title="Reset User Password"
          visible={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width="90%"
          style={{
            maxWidth: "500px",
            margin: "auto",
          }}
        >
          <Form
            initialValues={{
              username: editingUser?.username,
            }}
            onFinish={handleResetPassword}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              maxWidth: "400px",
              margin: "auto",
            }}
          >
            <Form.Item label="Username" name="username" style={{ margin: 0 }}>
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input the new password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm the password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
