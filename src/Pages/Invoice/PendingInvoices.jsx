import React, { useEffect, useState } from "react";
import { Badge, Card, message, Modal, Button, Spin} from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import config from "../../config";
import Sidebar from "../../Components/SideBar";

const PendingInvoices = () => {
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false); // Hide loader after data is fetched
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
      await axios.put(
        `${config.BASE_URL}/api/invoices/${invoiceId}/status`,
        true,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Invoice status updated successfully.");
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
    <div className="container">
      <Sidebar />
      <div className="content">
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
          
            <h3 className="card-title mb-4 text-center">Pending Invoices</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", // Responsive grid
                gap: "16px",
                justifyContent: "center",
              }}
            >
              {pendingInvoices.map((invoice) => (
                <Card
                  key={invoice.invoiceId}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    position: "relative",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => showInvoiceDetails(invoice)}
                >
                 
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
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation();
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
          </>
        )}
      </div>

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
    </div>
  );
};

export default PendingInvoices;
