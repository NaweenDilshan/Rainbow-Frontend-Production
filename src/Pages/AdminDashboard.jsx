import React from "react";
import "../Styles/page.css";
import Sidebar from "../Components/SideBar";
import Header from "../Pages/Header";


const Dashboard = () => {
  return (
    <>
    <Header/>
    <div className="dashboard">
      
      <Sidebar />
      <center><h1>welcome to admin dashboard</h1></center>
    </div>
    </>
  );
};

export default Dashboard;
