import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import axios from "axios";
import config from "../config";

import AuthService from "../Components/AuthService";

const ViewCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  axios.interceptors.request.use(
    (config) => {
      const user = AuthService.getCurrentUser();
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      message.error("Session expired. Please log in again.");
      AuthService.logout();
      // Redirect to login page
    } else {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Fetch Categories Error:", error);
      if (error.response && error.response.status === 401) {
        message.error("Unauthorized access - please log in again.");
        AuthService.logout(); // Clear any invalid token
        // Optionally, redirect to the login page here if necessary
      } else {
        message.error("Failed to load categories.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle category update
  const handleSave = async (values) => {
    const categoryData = {
      categoryName: values.categoryName,
    };
    if (editingCategory) {
      // Update category
      try {
        await axios.put(
          `${config.BASE_URL}/api/categories/${editingCategory.id}`,
          categoryData
        );
        message.success("Category updated successfully!");
        setEditingCategory(null);
        setIsEditing(false);
        fetchCategories(); // Refresh the categories list
      } catch (error) {
        message.error("Failed to update category.");
      }
    }
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.BASE_URL}/api/categories/${id}`);
      message.success("Category deleted successfully!");
      fetchCategories(); // Refresh the categories list
    } catch (error) {
      message.error("Failed to delete category.");
    }
  };

  // Open the modal for editing a category
  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsEditing(true);
  };

  // Columns for the Ant Design Table
  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => openEditModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>View Categories</h2>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      {/* Modal for Editing Categories */}
      <Modal
        title="Edit Category"
        visible={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form
          initialValues={{
            categoryName: editingCategory ? editingCategory.categoryName : "",
          }}
          onFinish={handleSave}
        >
          <Form.Item
            label="Category Name"
            name="categoryName"
            rules={[{ required: true, message: "Category name is required!" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Category
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewCategories;
