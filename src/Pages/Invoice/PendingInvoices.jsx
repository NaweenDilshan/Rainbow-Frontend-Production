import React, { useEffect, useState } from "react";
import { Badge, Card, message, Modal, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../../config";
import Sidebar from "../../Components/SideBar";

const PendingInvoices = () => {
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch inactive invoices on initial render
  useEffect(() => {
    const fetchPendingInvoices = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/api/invoices`);
        const inactiveInvoices = response.data.filter(
          (invoice) => !invoice.isActive
        );
        setPendingInvoices(inactiveInvoices);
      } catch (error) {
        message.error("Failed to load pending invoices.");
      }
    };

    fetchPendingInvoices();
  }, []);

  const showInvoiceDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
  };

  const changeStatus = async (invoiceId) => {
    try {
      // Send PUT request with plain true as the payload
      await axios.put(`${config.BASE_URL}/api/invoices/${invoiceId}/status`, true, {
        headers: {
          "Content-Type": "application/json", // Ensure correct header for raw JSON value
        },
      });
  
      message.success("Invoice status updated successfully.");
  
      // Remove updated invoice from pending list
      setPendingInvoices(
        pendingInvoices.filter((invoice) => invoice.invoiceId !== invoiceId)
      );
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update invoice status."
      );
    }
  };
  
  

  return (
    <>
      <Sidebar />
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Center the content horizontally
          alignItems: "center", // Center vertically
          minHeight: "100vh", // Ensure the full height of the page
          width: "100%",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap", // Allow cards to wrap on smaller screens
            justifyContent: "center", // Center cards horizontally
            gap: "16px", // Add space between the cards
            width: "100%",
            maxWidth: "1200px", // Optional: Limit the max width of the container
          }}
        >
          {pendingInvoices.map((invoice) => (
            <Card
              key={invoice.invoiceId}
              style={{
                width: "100%",
                maxWidth: "400px", // Limiting the card's max width
                textAlign: "left",
                position: "relative", // Positioning for the badge
              }}
              onClick={() => showInvoiceDetails(invoice)}
            >
              {/* Badge for Pending Status - Positioned to the top-left corner */}
              {!invoice.isActive && (
                <Badge
                  count="Pending"
                  style={{
                    backgroundColor: "#ff4d4f",
                    position: "absolute",
                    width: "60px",
                    top: "-15px", // Adjust top position for better visibility
                    left: "10px", // Adjust left position for better visibility
                    zIndex: 10, // Ensure the badge is above other content
                  }}
                />
              )}

              <p>
                <strong>Invoice Number:</strong> {invoice.invoiceCode}
              </p>
              <p>
                <strong>Customer:</strong> {invoice.customerName}
              </p>
              <p>
                <strong>Address:</strong> {invoice.billingAddress}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(invoice.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> {invoice.invoiceTotal.toFixed(2)}
              </p>

              {/* Edit Icon to Change Status */}
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation(); // Prevents modal from opening
                  changeStatus(invoice.invoiceId);
                }}
                style={{
                  fontSize: "18px",
                  color: "#1890ff",
                  cursor: "pointer",
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                }}
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Modal for showing full invoice details */}
      {selectedInvoice && (
        <Modal
          title={`Invoice Details - #${selectedInvoice.invoiceId}`}
          visible={isModalVisible}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              Close
            </Button>,
          ]}
          centered
        >
          <p>
            <strong>Invoice Number:</strong> {selectedInvoice.invoiceCode}
          </p>
          <p>
            <strong>Customer Name:</strong> {selectedInvoice.customerName}
          </p>
          <p>
            <strong>Customer Number:</strong> {selectedInvoice.customerNo}
          </p>
          <p>
            <strong>Billing Address:</strong> {selectedInvoice.billingAddress}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedInvoice.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Invoice Total:</strong>{" "}
            {selectedInvoice.invoiceTotal.toFixed(2)}
          </p>

          <h3>Invoice Items:</h3>
          {selectedInvoice.invoiceItems.map((item) => (
            <div key={item.id} style={{ marginBottom: "10px" }}>
              <p>
                <strong>Product:</strong> {item.productName}
              </p>
              <p>
                <strong>Category:</strong> {item.categoryName}
              </p>
              <p>
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p>
                <strong>Unit Price:</strong> {item.unitPrice.toFixed(2)}
              </p>
              <p>
                <strong>Amount:</strong> {item.amount.toFixed(2)}
              </p>
              <hr />
            </div>
          ))}
        </Modal>
      )}
    </>
  );
};

export default PendingInvoices;
