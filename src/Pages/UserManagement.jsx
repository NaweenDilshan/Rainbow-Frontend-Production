import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import axios from "axios";
import Sidebar from "../Components/SideBar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleResetPassword = async (values) => {
    const { newPassword, confirmPassword } = values;
    try {
      await axios.post("http://localhost:8080/reset-password", {
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
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => text || "N/A", // Show "N/A" if no address is available
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => text || "N/A", // Show "N/A" if no mobile number is available
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) => (active ? "Yes" : "No"), // Display Yes or No based on the active status
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
  ];

  return (
    <div>
      <Sidebar />
      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}>
          User Management
        </h2>

        {/* Table for User Data */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          style={{ width: "100%" }}
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
              rules={[{ required: true, message: "Please input the new password!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: "Please confirm the password!" }]}
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
