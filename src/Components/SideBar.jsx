import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { FaHome, FaUser, FaList, FaBox, FaFileInvoice } from "react-icons/fa"; // Icons for the menu
import "../Styles/Sidebar.css"; // Make sure you create this file for the custom styles

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSelect = (selected) => {
    const to = "/" + selected;
    if (window.location.pathname !== to) {
      navigate(to);
    }
  };

  return (
    <>
      {/* Sidebar for web view */}
      <div
        className={`sidebar bg-dark text-white d-none d-lg-block ${
          isOpen ? "open" : ""
        }`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "250px",
          height: "100%",
          backgroundColor: "#3B1E54",
          paddingTop: "20px",
          transition: "all 0.3s",
          zIndex: 1050,
        }}
      >
        <Navbar variant="dark" className="flex-column">
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link onClick={() => handleSelect("dashboard")}>
                <FaHome style={{ fontSize: "1.5em" }} /> Dashboard
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link onClick={() => handleSelect("register")}>
                <FaUser style={{ fontSize: "1.5em" }} /> Users
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link onClick={() => handleSelect("categories")}>
                <FaList style={{ fontSize: "1.5em" }} /> Categories
              </Nav.Link>
            </Nav.Item>

            <NavDropdown
              title={
                <>
                  <FaBox style={{ fontSize: "1.5em" }} /> Product
                </>
              }
              id="product-dropdown"
              className="text-white"
            >
              <NavDropdown.Item
                onClick={() => handleSelect("product/addproduct")}
              >
                Add Product
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleSelect("product/viewproducts")}
              >
                View Products
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title={
                <>
                  <FaBox style={{ fontSize: "1.5em" }} /> Store
                </>
              }
              id="store-dropdown"
              className="text-white"
            >
              <NavDropdown.Item onClick={() => handleSelect("store/add-store")}>
                Add Store
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSelect("store/viewstore")}>
                View Store
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title={
                <>
                  <FaFileInvoice style={{ fontSize: "1.5em" }} /> Invoices
                </>
              }
              id="invoices-dropdown"
              className="text-white"
            >
              <NavDropdown.Item
                onClick={() => handleSelect("invoices/add-invoices")}
              >
                Add Invoice
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleSelect("invoices/pending-invoices")}
              >
                Pending Invoices
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => handleSelect("invoices/view-invoices")}
              >
                View Invoices
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      </div>

      {/* Navbar for mobile view */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="d-lg-none fixed-top"
      >
        <Container>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleSidebar}
            className="mobile-nav-toggle" // Custom class for mobile toggle button
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Item>
                <Nav.Link onClick={() => handleSelect("dashboard")}>
                  <FaHome /> Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleSelect("register")}>
                  <FaUser /> Users
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleSelect("categories")}>
                  <FaList /> Categories
                </Nav.Link>
              </Nav.Item>
              <NavDropdown
                title={
                  <>
                    <FaBox /> Product
                  </>
                }
                id="product-dropdown-mobile"
              >
                <NavDropdown.Item
                  onClick={() => handleSelect("product/addproduct")}
                >
                  Add Product
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => handleSelect("product/viewproducts")}
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
                  onClick={() => handleSelect("store/add-store")}
                >
                  Add Store
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => handleSelect("store/viewstore")}
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
                  onClick={() => handleSelect("invoices/add-invoices")}
                >
                  Add Invoice
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => handleSelect("invoices/pending-invoices")}
                >
                  Pending Invoices
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => handleSelect("invoices/view-invoices")}
                >
                  View Invoices
                </NavDropdown.Item>
                
              </NavDropdown>
              

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;
