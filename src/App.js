
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import AdminPage from "./Pages/Adminpage";
import UserPage from "./Pages/Userpage";
import HomePage from "./Pages/Home";
import AuthService from "./Components/AuthService";
import Register from "./Components/Register";
import Categories from "./Pages/Categories";
import ViewCategories from "./Pages/ViewCategories";
import AddProduct from "./Pages/AddProduct";
import UserDetails from "./Pages/UserDetails";
import Dashboard from "./Pages/AdminDashboard";
import UserManagement from "./Pages/UserManagement";
import AddStore from "./Pages/Store/AddStore";
import AddInvoice from "./Pages/Invoice/AddInvoice";
import InvoiceList from "./Pages/Invoice/InvoiceList";
import PendingInvoices from "./Pages/Invoice/PendingInvoices";

const App = () => {
  const role = AuthService.getCurrentUserRole();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Role-based Routes */}
        <Route
          path="/admin"
          element={role === "admin" ? <AdminPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/user"
          element={role === "ref" ? <UserPage /> : <Navigate to="/home" />}
        />

        {/* Default home page */}
        <Route path="/home" element={<HomePage />} />

        <Route path="/register" element={<Register />} />

        <Route path="categories" element={<Categories />} />

        <Route path="/viewcategories" element={<ViewCategories />} />
        <Route path="product/addproduct" element={<AddProduct />} />
        <Route path="/userdetails" element={<UserDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/usermanagement" element={<UserManagement />} />

        <Route path="store/add-store" element={<AddStore />} />
        <Route path="invoices/add-invoices" element={<AddInvoice />} />
        <Route path="invoices/view-invoices" element={<InvoiceList />} />
        <Route path="invoices/pending-invoices" element={<PendingInvoices />} />
      </Routes>
    </Router>
  );
};

export default App;


