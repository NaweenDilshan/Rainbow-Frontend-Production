// import React, { useState } from "react";
// import AuthService from "./AuthService";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     try {
//       await AuthService.resetPassword(email);
//       setMessage("A reset link has been sent to your email address.");
//       setError("");
//     } catch (error) {
//       setError("Failed to send reset link. Please try again.");
//       setMessage("");
//     }
//   };

//   return (
//     <div className="auth-form">
//       <h2>Forgot Password</h2>
//       {message && <p className="success">{message}</p>}
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleResetPassword}>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit">Send Reset Link</button>
//       </form>
//       <p>
//         Remembered your password? <a href="/login">Login here</a>
//       </p>
//     </div>
//   );
// };

// export default ForgotPassword;

// ForgotPassword.js
import React, { useState } from "react";
import AuthService from "./AuthService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await AuthService.resetPassword(email);
      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setMessage("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
