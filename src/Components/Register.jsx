import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Card, Modal, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Sidebar from "../Components/SideBar";
import "../Styles/AddProduct.css";
import config from "../config";

const { Option } = Select;

const Register = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      message.error("Failed to load users.");
    }
  };

  // Register a new user
  const handleRegister = async (values) => {
    const { username, password, role, address, mobile } = values;
    setLoading(true);
    try {
      await axios.post("/api/users/register", { username, password, role, address, mobile });
      message.success("User registered successfully!");
      fetchUsers(); // Refresh user list in modal
    } catch (error) {
      message.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  // const handleDeleteUser = async (userId) => {
  //   Modal.confirm({
  //     title: "Are you sure you want to delete this user?",
  //     onOk: async () => {
  //       try {
  //         await axios.delete(`${config.BASE_URL}/users/${userId}`);
  //         message.success("User deleted successfully!");
  //         setUsers(users.filter((user) => user.id !== userId));
  //       } catch (error) {
  //         message.error("Failed to delete user.");
  //       }
  //     },
  //     onCancel: () => {},
  //   });
  // };

  // Open User Management Modal
  const handleOpenModal = () => {
    fetchUsers();
    setIsModalVisible(true);
  };

  // Close Modal
  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  // Table columns for user management
  const userColumns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, user) => (
    //      <DeleteOutlined style={{ color: "red" }} onClick={() => handleDeleteUser(user.id)} />
    //   ),
    // },
  ];

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Card title="Register User" bordered={false} style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <Form onFinish={handleRegister} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Form.Item name="username" label="Username" rules={[{ required: true, message: "Username is required!" }]}>
              <Input placeholder="Enter username" />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Password is required!" }]}>
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Form.Item name="role" label="Role" rules={[{ required: true, message: "Role is required!" }]}>
              <Select placeholder="Select role">
                <Option value="admin">Admin</Option>
                <Option value="ref">Ref</Option>
              </Select>
            </Form.Item>

            <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required!" }]}>
              <Input placeholder="Enter address" />
            </Form.Item>

            <Form.Item name="mobile" label="Mobile" rules={[{ required: true, message: "Mobile number is required!" }]}>
              <Input placeholder="Enter mobile number" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
              <Button type="primary" color="9B7EBD" htmlType="submit" loading={loading} 
              style={{ backgroundColor: "#9B7EBD", borderColor: "#9B7EBD", color: "black" }}>
                Register User
              </Button>
            </Form.Item>
          </Form>

          <Button className="view-btn" type="default"
           style={{ marginTop: "20px",  backgroundColor: "#EEEEEE", borderColor: "#9B7EBD", color: "black" }} 
           onClick={handleOpenModal}>
            Manage Users
          </Button>
        </Card>

        {/* User Management Modal */}
        <Modal
          title="User Management"
          visible={isModalVisible}
          onCancel={handleCancelModal}
          footer={[<Button key="close" onClick={handleCancelModal}>Close</Button>]}
          width={800}
          className="user-modal"
        >
          <Table dataSource={users} columns={userColumns} rowKey="id" className="responsive-table" />
        </Modal>
      </div>
    </div>
  );
};

export default Register;
