import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Card, Modal, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../../config";
import Sidebar from "../../Components/SideBar";
//import "../Styles/AddStore.css";
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

const StoreViewPage = () => {
  const [stores, setStores] = useState([]);

  const isMobile = useIsMobile();

  // Fetch stores for table view
  const fetchStores = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/stores`);
      setStores(response.data);
    } catch (error) {
      message.error("Failed to load store data.");
    }
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

  useEffect(() => {
    fetchStores();
  }, []);

  // Apply row class based on 'storeType'
  const rowClassName = (record) =>
    record.storeType === "OUT" ? "out-row" : "";

  <Table
    dataSource={stores}
    columns={columns}
    rowKey="id"
    rowClassName={rowClassName}
  />;

  const role = AuthService.getCurrentUserRole();

  return (
    <div className="container">
      {role === "admin" ? <Sidebar /> : <SidebarRef />}
      <div className="content">
        <h3 className="card-title mb-4 text-center">All Stores</h3>
        <Table
          dataSource={stores}
          columns={columns}
          rowKey="id"
          className="responsive-table"
        />
      </div>
    </div>
  );
};

export default StoreViewPage;
