// Login.js
import React, { useState } from "react";
import AuthService from "./AuthService";
import { useNavigate } from "react-router-dom";
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
        window.location.replace("/admin"); // Redirect to the Admin page
      } else if (role === "ref") {
        window.location.replace("/user"); // Redirect to the User page
      } else {
        navigate("/home"); // Default route if role is unrecognized
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <div className="auth-form">
          <img src="/Images/rainbow_logo.png" alt="Logo" className="logo" />
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <p>
              <a href="/forgot-password">Forgot Password?</a>
            </p> */}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
