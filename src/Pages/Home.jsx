import React from "react";
import AuthService from "../Components/AuthService";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const handleLogout = () => {
    AuthService.logout();
    window.location.reload();
  };

  const navigate = useNavigate();

  return (
    <div className="home">
      <h2>Welcome to the Home Page</h2>
      <button id="btn" onClick={() => navigate("/Register")}>
        Register User
      </button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
