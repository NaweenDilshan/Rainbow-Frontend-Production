import React, { useState, useEffect } from "react";
import "../Styles/page.css";
import Sidebar from "../Components/SideBar";
import "../Styles/Dashboard.css";
import axios from "axios";
import config from "../config";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
  });
  
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get(`${config.BASE_URL}/api/total-quantity/category`),
          axios.get(`${config.BASE_URL}/api/total-quantity/product`),
        ]);

        const totalCategories = Object.values(categoriesRes.data).length;

        const totalProducts = Object.values(productsRes.data).length;

        setStats({
          totalCategories,
          totalProducts,
          activeProducts: productsRes.data.active || 0,
          inactiveProducts: productsRes.data.inactive || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error.message, error.response);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <div className="dashboard-header">
          <img
            src="/Images/rainbow_logo.png"
            alt="Logo"
            className="dashboard-logo"
          />
          <h1>Hi! Admin</h1>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <h2>{stats.totalCategories}</h2>
            <p>Categories</p>
          </div>
          <div className="stat-card">
            <h2>{stats.totalProducts}</h2>
            <p>Products</p>
          </div>
          <div className="stat-card">
            <h2>{stats.activeProducts}</h2>
            <p>Active Products</p>
          </div>
          <div className="stat-card">
            <h2>{stats.inactiveProducts}</h2>
            <p>Inactive Products</p>
          </div>
        </div>

        <div className="sales-section">
          <div className="sales-card">
            <h2>100,000</h2>
            <p>Total Sale</p>
          </div>
          <div className="sales-card">
            <h2>10,000</h2>
            <p>Est. Revenue</p>
          </div>
        </div>

        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#34495e" }}>
          Reports
        </h1>

        <div className="reports-section">
          <button className="report-button green">Product Report</button>
          <button className="report-button blue">Monthly Income Report</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
