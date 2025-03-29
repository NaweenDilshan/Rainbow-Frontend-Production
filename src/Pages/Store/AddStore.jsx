import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Card, Modal, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../../config";
import Sidebar from "../../Components/SideBar";
//import "../Styles/AddStore.css";
import "../../Styles/AddProduct.css";

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

const AddStore = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isMobile = useIsMobile();

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/api/products`);
        setProducts(response.data);
        setIsFetchingProducts(false);
      } catch (error) {
        message.error("Failed to load products.");
        setIsFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch stores for table view
  const fetchStores = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/stores`);
      setStores(response.data);
    } catch (error) {
      message.error("Failed to load store data.");
    }
  };

  // Add Store
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/stores`,
        values
      );
      if (response.status === 200) {
        message.success("Store entry added successfully!");
        fetchStores(); // Refresh store data in the modal table
      }
    } catch (error) {
      message.error("Failed to add store entry.");
    } finally {
      setLoading(false);
    }
    window.location.reload();
  };

  // Confirm delete
  const handleDeleteStore = async (storeId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this store entry?",
      onOk: async () => {
        try {
          await axios.delete(`${config.BASE_URL}/api/stores/${storeId}`);
          message.success("Store entry deleted successfully!");
          setStores(stores.filter((store) => store.id !== storeId));
        } catch (error) {
          message.error("Failed to delete store entry.");
        }
      },
    });
  };

  // View Store Data
  const handleViewStores = () => {
    fetchStores();
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  // Table columns
  // Define table columns with conditional row styling for 'storeType' column
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
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => (
        <span data-column="Quantity">
          {isMobile ? `Quantity - ${text}` : text}
        </span>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text) => (
        <span data-column="Unit Price">
          {isMobile ? `Unit Price - ${text}` : text}
        </span>
      ),
    },
    {
      title: "Store Type",
      dataIndex: "storeType",
      key: "storeType",
      render: (storeType) => (
        <span style={{ color: storeType === "OUT" ? "red" : "black" }}>
          {isMobile ? `Store Type - ${storeType}` : storeType}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, store) => (
        <DeleteOutlined
          style={{ color: "red" }}
          onClick={() => handleDeleteStore(store.id)}
        />
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        new Date(createdAt).toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
  ];

  // Apply row class based on 'storeType'
  const rowClassName = (record) =>
    record.storeType === "OUT" ? "out-row" : "";

  <Table
    dataSource={stores}
    columns={columns}
    rowKey="id"
    rowClassName={rowClassName}
  />;

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Card
          title="Add Store Entry"
          bordered={false}
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        >
          <Form
            onFinish={handleSubmit}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            {/* <Form.Item
              label="Product Name"
              name="productName"
              rules={[{ required: true, message: "Product name is required!" }]}
            >
              <Select
                placeholder="Select a product"
                loading={isFetchingProducts}
                allowClear
              >
                {products.map((product) => (
                  <Option key={product.id} value={product.productName}>
                    {product.productName}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[{ required: true, message: "Product name is required!" }]}
            >
              <Select
                placeholder="Select a product"
                loading={isFetchingProducts}
                allowClear
                showSearch // Enables search functionality
                optionFilterProp="children" // Filters options based on text
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {products.map((product) => (
                  <Option key={product.id} value={product.productName}>
                    {product.productName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Quantity is required!" }]}
            >
              <Input type="number" placeholder="Enter quantity" />
            </Form.Item>
            <Form.Item
              label="Unit Price"
              name="unitPrice"
              rules={[{ required: true, message: "Unit price is required!" }]}
            >
              <Input type="number" placeholder="Enter unit price" />
            </Form.Item>
            <Form.Item
              label="Store Type"
              name="storeType"
              rules={[{ required: true, message: "Please select store type!" }]}
            >
              <Select placeholder="Select store type">
                <Option value="IN">IN</Option>
                <Option value="OUT">OUT</Option>
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
                Add Store Entry
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
            onClick={handleViewStores}
          >
            View Store Data
          </Button>
        </Card>

        {/* Modal for Store Table */}
        <Modal
          title="Store Data"
          visible={isModalVisible}
          onCancel={handleCancelModal}
          footer={[
            <Button key="close" onClick={handleCancelModal}>
              Close
            </Button>,
          ]}
          width={800}
          className="store-modal"
        >
          <Table
            dataSource={stores}
            columns={columns}
            rowKey="id"
            className="responsive-table"
          />
        </Modal>
      </div>
    </div>
  );
};

export default AddStore;
