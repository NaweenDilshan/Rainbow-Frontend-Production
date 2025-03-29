import React, { useState } from "react";
import AuthService from "./AuthService";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../Styles/AuthStyles.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await AuthService.login(username, password);
  
      // Get the role from localStorage after login
      const role = AuthService.getCurrentUserRole();
      console.log("User Role in handleLogin:", role); // Debugging line
      // Redirect based on the role
      if (role === "admin") {
        window.location.replace("/admin");
      } else if (role === "ref") {
        window.location.replace("/user");
      } else {
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        // Check for specific status codes
        if (error.response.status === 404) {
          setError("Server not found. Please try again later.");
        } else if (error.response.status === 500) {
          setError("Server error. Please contact support.");
        } else {
          setError("Invalid username or password");
        }
      } else if (error.request) {
        // If no response was received from the server
        setError("Server Down. Please check your internet connection or Contact Developer.");
      } else {
        // Handle any other errors
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/Images/rainbow_logo.png"
            alt="Logo"
            className="login-logo"
          />
          <h2>Welcome Back!</h2>
          <p>Sign in to access your account</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          {error && <p className="login-error">{error}</p>}
          <div className="login-input-group">
            <FaUser className="login-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="login-input-group">
            <FaLock className="login-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        <div className="login-footer">
          <p>
            Forgot your password?{" "}
            <a href="/forgot-password" className="login-link">
              Reset it here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
