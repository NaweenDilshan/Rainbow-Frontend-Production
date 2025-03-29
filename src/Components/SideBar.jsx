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

const Sidebar = () => {
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
              <Nav.Link onClick={() => handleNavigation("dashboard")}>
                <FaHome className="nav-icon" /> {isSidebarOpen && "Dashboard"}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleNavigation("register")}>
                <FaUser className="nav-icon" /> {isSidebarOpen && "Users"}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleNavigation("usermanagement")}>
                <FaUser className="nav-icon" />{" "}
                {isSidebarOpen && "Users Managment"}
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
              <Nav.Link onClick={() => handleNavigation("categories")}>
                <FaList className="nav-icon" /> {isSidebarOpen && "Categories"}
              </Nav.Link>
            </Nav.Item> */}
            <NavDropdown
              title={
                <>
                  <FaList className="nav-icon" /> {isSidebarOpen && "Categorie"}
                </>
              }
              id="categorie-dropdown"
              className="text-white"
            >
              <NavDropdown.Item
                onClick={() => handleNavigation("categorie/addcategorie")}
              >
                Add Categorie
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("categorie/viewcategories")}
              >
                View Categories
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title={
                <>
                  <FaBox className="nav-icon" /> {isSidebarOpen && "Product"}
                </>
              }
              id="product-dropdown"
              className="text-white"
            >
              <NavDropdown.Item
                onClick={() => handleNavigation("product/addproduct")}
              >
                Add Product
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("product/viewproducts")}
              >
                View Products
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <>
                  <FaBox className="nav-icon" /> {isSidebarOpen && "Store"}
                </>
              }
              id="store-dropdown"
              className="text-white"
            >
              <NavDropdown.Item
                onClick={() => handleNavigation("store/add-store")}
              >
                Add Store
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("store/viewstore")}
              >
                View Store
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <>
                  <FaFileInvoice className="nav-icon" />{" "}
                  {isSidebarOpen && "Invoices"}
                </>
              }
              id="invoices-dropdown"
              className="text-white"
            >
              <NavDropdown.Item
                onClick={() => handleNavigation("invoices/add-invoices")}
              >
                Add Invoice
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("invoices/pending-invoices")}
              >
                Pending Invoices
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("invoices/view-invoices")}
              >
                View Invoices
              </NavDropdown.Item>
            </NavDropdown>
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
              <Nav.Link onClick={() => handleNavigation("dashboard")}>
                <FaHome /> Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleNavigation("register")}>
                <FaUser /> Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleNavigation("usermanagement")}>
                <FaUser /> Users Managment
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
              <Nav.Link onClick={() => handleNavigation("categories")}>
                <FaList /> Categories
              </Nav.Link>
            </Nav.Item> */}
            <NavDropdown
              title={
                <>
                  <FaList /> Categories
                </>
              }
              id="categories-dropdown-mobile"
            >
              <NavDropdown.Item
                onClick={() => handleNavigation("categories/addcategorie")}
              >
                Add Categorie
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("categories/viewcategories")}
              >
                View Categoriess
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <>
                  <FaBox /> Product
                </>
              }
              id="product-dropdown-mobile"
            >
              <NavDropdown.Item
                onClick={() => handleNavigation("product/addproduct")}
              >
                Add Product
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("product/viewproducts")}
              >
                View Products
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <>
                  <FaBox /> Store
                </>
              }
              id="store-dropdown-mobile"
            >
              <NavDropdown.Item
                onClick={() => handleNavigation("store/add-store")}
              >
                Add Store
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("store/viewstore")}
              >
                View Store
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={
                <>
                  <FaFileInvoice /> Invoices
                </>
              }
              id="invoices-dropdown-mobile"
            >
              <NavDropdown.Item
                onClick={() => handleNavigation("invoices/add-invoices")}
              >
                Add Invoice
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("invoices/pending-invoices")}
              >
                Pending Invoices
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleNavigation("invoices/view-invoices")}
              >
                View Invoices
              </NavDropdown.Item>
            </NavDropdown>
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

export default Sidebar;
