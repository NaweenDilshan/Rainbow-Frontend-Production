import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Card, Modal, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../config";
import Sidebar from "../Components/SideBar";
import "../Styles/AddProduct.css";

const { Option } = Select;

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

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isMobile = useIsMobile();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/api/categories`);
        setCategories(response.data);
        setIsFetchingCategories(false);
      } catch (error) {
        message.error("Failed to load categories.");
        setIsFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      message.error("Failed to load products.");
    }
  };

  // Handle form submission with categoryId and categoryName
  // Add Product
  const handleSubmit = async (values) => {
    if (!values.categoryId) {
      message.error("Please select a category.");
      return;
    }

    // Include the categoryName based on selected categoryId
    const category = categories.find((cat) => cat.id === values.categoryId);
    const productData = {
      ...values,
      categoryName: category ? category.categoryName : null,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/products`,
        productData
      );
      if (response.status === 200) {
        message.success("Product added successfully!");
        // Refresh products list by fetching again from the server
        fetchProducts(); // Refreshes the product list displayed in the modal or table
        // This will reload the entire page
      }
    } catch (error) {
      message.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
    window.location.reload();
  };

  // Confirm before deleting a product
  const handleDeleteProduct = async (productId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      onOk: async () => {
        try {
          await axios.delete(`${config.BASE_URL}/api/products/${productId}`);
          message.success("Product deleted successfully!");
          setProducts(products.filter((product) => product.id !== productId));
        } catch (error) {
          message.error("Failed to delete product.");
        }
      },
      onCancel: () => {},
    });
  };

  // View Products
  const handleViewProducts = () => {
    fetchProducts();
    setIsModalVisible(true);
  };

  // Close Modal
  const handleCancelModal = () => {
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => (
        <span data-column="Product Name">
          {isMobile ? `Product Name - ${text}` : text}
        </span>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (text) => (
        <span data-column="Brand">{isMobile ? `Brand - ${text}` : text}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text) => (
        <span data-column="Category">
          {isMobile ? `Category - ${text}` : text}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) => (
        <span data-column="Status">
          {isMobile
            ? `Status - ${isActive ? "Active" : "Inactive"}`
            : isActive
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, product) => (
        <DeleteOutlined
          style={{ color: "red" }}
          onClick={() => handleDeleteProduct(product.id)}
        />
      ),
    },
  ];

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Card
          title="Add Product"
          bordered={false}
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        >
          <Form
            onFinish={handleSubmit}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={{ isActive: true }}
          >
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[{ required: true, message: "Product name is required!" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
            <Form.Item
              label="Brand Name"
              name="brand"
              rules={[{ required: true, message: "Brand name is required!" }]}
            >
              <Input placeholder="Enter brand name" />
            </Form.Item>
            {/* <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select
                placeholder="Select a category"
                loading={isFetchingCategories}
                allowClear
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select
                placeholder="Select a category"
                loading={isFetchingCategories}
                allowClear
                showSearch // Enables search functionality
                optionFilterProp="children" // Filters options based on text
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  backgroundColor: "#9B7EBD",
                  borderColor: "#9B7EBD",
                  color: "black",
                }}
              >
                Add Product
              </Button>
            </Form.Item>
          </Form>
          <Button
            className="view-btn"
            type="default"
            style={{
              marginTop: "20px",
              backgroundColor: "#EEEEEE",
              borderColor: "#9B7EBD",
              color: "black",
            }}
            onClick={handleViewProducts}
          >
            View Products
          </Button>
        </Card>

        {/* Modal for Product Table */}
        <Modal
          title="Products"
          visible={isModalVisible}
          onCancel={handleCancelModal}
          footer={[
            <Button key="close" onClick={handleCancelModal}>
              Close
            </Button>,
          ]}
          width={800}
          className="product-modal"
        >
          <Table
            dataSource={products}
            columns={columns}
            rowKey="id"
            scroll={{ x: "max-content" }}
            style={{ maxWidth: "100%" }}
            className="responsive-table"
          />
        </Modal>
      </div>
    </div>
  );
};

export default AddProduct;
