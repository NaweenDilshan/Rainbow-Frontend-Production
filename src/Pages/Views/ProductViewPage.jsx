import React, { useState, useEffect } from "react";
import { message, Table, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../../config";
import Sidebar from "../../Components/SideBar";
import "../../Styles/AddProduct.css";
import AuthService from "../../Components/AuthService";
import SidebarRef from "../../Components/SideBarRef";

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

const ProductViewPage = () => {
  const [products, setProducts] = useState([]);

  const isMobile = useIsMobile();

  // Fetch products (this is only run once)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        message.error("Failed to load products.");
      }
    };
    fetchProducts();
  }, []); // Empty array ensures this effect runs only once when component mounts

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

  const role = AuthService.getCurrentUserRole();

  // View Products
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
      {role === "admin" ? <Sidebar /> : <SidebarRef />}
      <div className="content">
        <h3 className="card-title mb-4 text-center">All Products</h3>
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
          style={{ maxWidth: "100%" }}
          className="responsive-table"
        />
      </div>
    </div>
  );
};

export default ProductViewPage;
