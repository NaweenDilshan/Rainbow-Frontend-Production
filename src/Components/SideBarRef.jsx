import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import {
  FaHome,
  FaUser,
  FaList,
  FaBox,
  FaFileInvoice,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import "../Styles/Sidebar.css";

const SidebarRef = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (route) => {
    const to = `/${route}`;
    if (window.location.pathname !== to) {
      navigate(to);
    }
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div>
      {/* Desktop Sidebar */}
      <div
        className={`sidebar bg-dark text-white ${isSidebarOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isSidebarOpen ? "250px" : "80px",
          height: "100%",
          backgroundColor: "#3B1E54",
          paddingTop: "20px",
          transition: "width 0.3s ease-in-out",
          zIndex: 1050,
        }}
      >
        <div
          className="sidebar-toggle"
          onClick={toggleSidebar}
          style={{
            textAlign: "center",
            cursor: "pointer",
            padding: "10px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <FaBars style={{ fontSize: "1.5em" }} />
        </div>
        <Navbar variant="dark" className="flex-column">
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link onClick={() => handleNavigation("dashboardRef")}>
                <FaHome className="nav-icon" /> {isSidebarOpen && "Dashboard"}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleNavigation("product/viewproducts")}
              >
                <FaBox className="nav-icon" /> {isSidebarOpen && "Prooducts"}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleNavigation("categorie/viewcategories")}
              >
                <FaList className="nav-icon" /> {isSidebarOpen && "Categories"}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleNavigation("invoices/add-invoices")}
              >
                <FaFileInvoice className="nav-icon" />{" "}
                {isSidebarOpen && "Add Invoices"}
              </Nav.Link>
            </Nav.Item>
            {/* Logout Button */}
            <Nav.Item
              style={{
                marginTop: "auto",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "10px 0",
              }}
            >
              <Nav.Link onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" />{" "}
                {isSidebarOpen && "Logout"}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
      </div>

      {/* Mobile Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="d-lg-none fixed-top"
      >
        <Navbar.Toggle aria-controls="mobile-nav" onClick={toggleMobileMenu} />
        <Navbar.Collapse id="mobile-nav" in={isMobileMenuOpen}>
          <Nav className="ml-auto">
            <Nav.Item>
              <Nav.Link onClick={() => handleNavigation("dashboardRef")}>
                <FaHome /> Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleNavigation("product/viewproducts")}
              >
                <FaBox /> Products
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleNavigation("categorie/viewcategories")}
              >
                <FaList /> Categories
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleNavigation("invoices/add-invoices")}
              >
                <FaFileInvoice /> Add Invoices
              </Nav.Link>
            </Nav.Item>
            {/* Logout Button for Mobile */}
            <Nav.Item>
              <Nav.Link onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default SidebarRef;
