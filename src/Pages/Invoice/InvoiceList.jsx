import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  List,
  Typography,
  message,
  Spin,
  Row,
  Col,
} from "antd";
import axios from "axios";
import config from "../../config";
import Sidebar from "../../Components/SideBar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../img/rainbow_logo.png";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch invoices from API
  // Fetch invoices from API
const fetchInvoices = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${config.BASE_URL}/api/invoices`);
    // Filter invoices with isActive = true
    const activeInvoices = response.data.filter((invoice) => invoice.isActive);

    // Sort invoices by createdAt date in descending order
    const sortedInvoices = activeInvoices.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setInvoices(sortedInvoices); // Set the sorted invoices
  } catch (error) {
    message.error("Failed to load invoices.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchInvoices();
  }, []);

  // Handle click on card to view full invoice details
  const viewInvoiceDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    const leftMargin = 25.4;
    const rightMargin = doc.internal.pageSize.getWidth() - 25.4;
    const pageWidth = doc.internal.pageSize.getWidth();
  
    const logoWidth = 40;
    const logoX = (pageWidth - logoWidth) / 2;
  
    // Add logo and title
    doc.addImage(logo, "PNG", logoX, 8, logoWidth, 25);
    doc.setFontSize(14);
    doc.text("INVOICE", pageWidth / 2, 40, { align: "center" });
  
    // Header lines
    const headerHeight = 40;
    const lineSpacing = 5; // Reduced spacing
    const textLineHeight = 2;
  
    doc.setLineWidth(0.5);
    doc.line(
      leftMargin,
      headerHeight + textLineHeight,
      rightMargin,
      headerHeight + textLineHeight
    );
    doc.line(
      leftMargin,
      headerHeight + lineSpacing + textLineHeight,
      rightMargin,
      headerHeight + lineSpacing + textLineHeight
    );
  
    // Invoice details
    doc.setFontSize(10);
    doc.text(
      `Invoice Number: ${selectedInvoice.invoiceCode}`,
      leftMargin,
      headerHeight + lineSpacing
    );
    doc.text(
      `Date Issued: ${new Date(
        selectedInvoice.createdAt
      ).toLocaleDateString()}`,
      rightMargin - 55,
      headerHeight + lineSpacing
    );
  
    // "Bill To" section
    doc.setFontSize(12);
    doc.text("Bill To:", leftMargin, 55); // Adjusted Y-coordinates
    doc.setFontSize(10);
    doc.text(`${selectedInvoice.customerName}`, leftMargin, 63);
    doc.text(`Number: ${selectedInvoice.customerNo || "N/A"}`, leftMargin, 71);
  
    // Handle long billing address
    const maxWidth = 50; // Maximum width for text wrapping
    const wrappedBillingAddress = doc.splitTextToSize(
      `Address: ${selectedInvoice.billingAddress}`,
      maxWidth
    );
    doc.text(wrappedBillingAddress, leftMargin, 78);
  
    // Adjust height based on the number of lines in the billing address
    const billingAddressHeight = wrappedBillingAddress.length * 5; // Reduced height per line
  
    // "Bill From" section
    const billFromX = rightMargin - 80;
    doc.setFontSize(12);
    doc.text("Bill From:", billFromX, 55 + billingAddressHeight);
    doc.setFontSize(10);
    doc.text("Maligavila Road, Kubukkana Junction,", billFromX, 60 + billingAddressHeight);
    doc.text("Monaragala", billFromX, 65 + billingAddressHeight);
    doc.text("Ref Details:", billFromX, 70 + billingAddressHeight);
    doc.text("N S S Nalinda - 0774325580", billFromX, 75 + billingAddressHeight);
    doc.text("G Yogeshwaram - 0766259072", billFromX, 80 + billingAddressHeight);
  
    // Table of items
    const tableWidth = rightMargin - leftMargin;
  
    const tableData = selectedInvoice.invoiceItems.map((item, index) => [
      index + 1,
      item.productCode,
      item.productName,
      item.quantity,
      item.unitPrice.toFixed(2),
      item.amount.toFixed(2),
    ]);
  
    doc.autoTable({
      startY: 100 + billingAddressHeight, // Reduced gap before table
      margin: { left: leftMargin, right: leftMargin },
      head: [["No", "Item No.", "Description", "Qty", "Unit Price", "Amount"]],
      body: tableData,
      theme: "grid",
      styles: { halign: "center", cellPadding: 2 },
      headStyles: { fillColor: [22, 160, 133] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 20 },
        2: { cellWidth: 70 },
        3: { cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
      },
      tableWidth: tableWidth,
    });
  
    // Add total amount and footer
    const finalY = doc.lastAutoTable.finalY + 5; // Reduced gap after table
    doc.text(
      `Total: ${selectedInvoice.invoiceTotal.toFixed(2)}`,
      rightMargin,
      finalY,
      { align: "right" }
    );
    doc.setFontSize(10);
    doc.text("Prepared By: __________________", leftMargin, finalY + 15); // Reduced footer spacing
  
    doc.save(`Invoice_${selectedInvoice.invoiceCode}.pdf`);
  };
  
  

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* <h3 className="card-title mb-4 text-center">All Invoices</h3> */}
            <Row gutter={[16, 16]}>
              {invoices.map((invoice) => (
                <Col key={invoice.invoiceId} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    bordered
                    style={{
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      padding: "20px",
                      backgroundColor: "#f9f9f9",
                      marginBottom: "20px",
                    }}
                    extra={
                      <Button
                        type="primary"
                        size="small"
                        style={{ borderRadius: "5px", minWidth: "100px" }}
                        onClick={() => viewInvoiceDetails(invoice)}
                      >
                        View Details
                      </Button>
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <h4 style={{ margin: 0, flex: 1, fontWeight: "bold" }}>
                        Invoice #{invoice.invoiceCode}
                      </h4>
                    </div>
                    <span
                      style={{
                        background: "#E6F7FF",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        color: "#1890FF",
                        fontSize: "12px",
                      }}
                    >
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </span>
                    <hr
                      style={{
                        borderTop: "1px solid #f0f0f0",
                        margin: "10px 0",
                      }}
                    />
                    <div style={{ lineHeight: "1.6" }}>
                      <p>
                        <strong>Customer Name:</strong>{" "}
                        <span style={{ color: "#595959" }}>
                          {invoice.customerName}
                        </span>
                      </p>
                      <p>
                        <strong>Billing Address:</strong>{" "}
                        <span style={{ color: "#595959" }}>
                          {invoice.billingAddress}
                        </span>
                      </p>
                      <p>
                        <strong>Total Amount:</strong>{" "}
                        <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                          Rs.{invoice.invoiceTotal.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
        <Modal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button
              key="print"
              type="primary"
              style={{ borderRadius: "5px" }}
              onClick={handlePrint}
            >
              Print to PDF
            </Button>,
            <Button
              key="close"
              style={{ borderRadius: "5px" }}
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </Button>,
          ]}
          centered
          bodyStyle={{
            padding: "20px 30px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
          }}
        >
          {selectedInvoice && (
            <div>
              {/* Header */}
              <div
                style={{
                  borderBottom: "1px solid #e8e8e8",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                <Typography.Title level={3} style={{ margin: 0 }}>
                  Invoice Details
                </Typography.Title>
                <Typography.Text type="secondary">
                  Invoice No: {selectedInvoice.invoiceCode}
                </Typography.Text>
              </div>

              {/* Invoice Details */}
              <div style={{ marginBottom: "20px" }}>
                <p>
                  <strong>Customer Name:</strong>{" "}
                  <span style={{ color: "#595959" }}>
                    {selectedInvoice.customerName}
                  </span>
                </p>
                <p>
                  <strong>Customer No:</strong>{" "}
                  <span style={{ color: "#595959" }}>
                    {selectedInvoice.customerNo}
                  </span>
                </p>
                <p>
                  <strong>Billing Address:</strong>{" "}
                  <span style={{ color: "#595959" }}>
                    {selectedInvoice.billingAddress}
                  </span>
                </p>
              </div>

              {/* Invoice Items */}
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  padding: "15px",
                }}
              >
                <Typography.Title
                  level={4}
                  style={{
                    marginBottom: "10px",
                    borderBottom: "1px solid #e8e8e8",
                    paddingBottom: "10px",
                  }}
                >
                  Invoice Items
                </Typography.Title>
                <List
                  dataSource={selectedInvoice.invoiceItems}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        padding: "10px 0",
                      }}
                    >
                      <List.Item.Meta
                        title={
                          <span>
                            <strong>{item.productName}</strong>{" "}
                            <Typography.Text type="secondary">
                              (Category: {item.categoryName})
                            </Typography.Text>
                          </span>
                        }
                        description={
                          <span style={{ color: "#595959" }}>
                            Qty: {item.quantity}, Unit Price:{" "}
                            {item.unitPrice.toFixed(2)}, Amount:{" "}
                            <strong style={{ color: "#52c41a" }}>
                              {item.amount.toFixed(2)}
                            </strong>
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default InvoiceList;
