import React from "react";
import "../Styles/page.css";
// import logo from "./path/to/logo.png"; // Replace with your logo path

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <i className="fas fa-th"></i>
        <h1 style={{color: "black"}}>Hi! Admin</h1>

      </div>
      {/* <img src={logo} alt="Logo" className="logo" /> */}
      {/* <div className="header-right">
        <i className="fas fa-bell"></i>
        <i className="fas fa-comment"></i>
        <i className="fas fa-user"></i>
      </div> */}
    </div>
  );
};

export default Header;
