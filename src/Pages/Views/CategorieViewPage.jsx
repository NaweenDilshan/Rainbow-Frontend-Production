import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import Sidebar from "../../Components/SideBar";
import { useNavigate } from "react-router-dom";
import "../../Styles/page.css";
import { Modal, Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
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

const CategorieViewPage = () => {
  const [categories, setCategories] = useState([]);

  const isMobile = useIsMobile();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      alert("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle category deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${config.BASE_URL}/api/categories/${id}`);
        alert("Category deleted successfully!");
        fetchCategories();
      } catch (error) {
        alert("Failed to delete category.");
      }
    }
  };

  const role = AuthService.getCurrentUserRole();

  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text) => (
        <span data-column="Category Name">
          {isMobile ? `Category Name - ${text}` : text}
        </span>
      ),
    },
    {
      title: "Action",
      key: "actions",
      render: (_, category) => (
        <DeleteOutlined
          style={{ color: "red" }}
          onClick={() => handleDelete(category.id)}
        />
      ),
    },
  ];

  return (
    <div className="container">
      {role === "admin" ? <Sidebar /> : <SidebarRef />}

      <div className="content">
        <h3 className="card-title mb-4 text-center">All Categories</h3>
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="id"
          pagination={true}
          className="responsive-table"
        />
      </div>
    </div>
  );
};

export default CategorieViewPage;
