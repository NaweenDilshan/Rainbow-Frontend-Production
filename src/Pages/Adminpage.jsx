import React from "react";
import Sidebar from "../Components/SideBar";
import AdminDashboard from "../Pages/AdminDashboard";
import Header from "./Header";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const AdminPage = () => {
  return (
    <div className="d-flex">
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div
          className="content"
          style={{
            marginLeft: "250px",
            padding: "20px",
            width: "calc(100% - 250px)",
          }}
        ></div>

        <div className="">
          <AdminDashboard />
        </div>

        <div className="">
          <Header />
        </div>
        {/* <h2>Hi, Admin</h2>
        <p>Welcome to the admin dashboard!</p> */}
        {/* Add more admin-specific features here */}
      </div>
    </div>
  );
};

export default AdminPage;
