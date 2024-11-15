import React, { useState, useEffect } from "react";
import { Card, Button, Modal, List, Typography, message } from "antd";
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
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.BASE_URL}/api/invoices`);
      // Filter invoices with isActive = true
      const activeInvoices = response.data.filter((invoice) => invoice.isActive);
      setInvoices(activeInvoices);
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
    const leftMargin = 25.4; // 1 inch in points
    const rightMargin = doc.internal.pageSize.getWidth() - 25.4;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo: Calculate X position to center it
    const logoWidth = 40; // Width of the logo
    const logoX = (pageWidth - logoWidth) / 2; // Centering the logo

    // Add logo in the header, centered
    doc.addImage(logo, "PNG", logoX, 8, logoWidth, 25);

    // Page title: "INVOICE", also centered
    doc.setFontSize(18);
    doc.text("INVOICE", pageWidth / 2, 35, { align: "center" });

    // Combine Invoice Number and Date Issued in a single block, with lines above and below
    const headerHeight = 40; // Start Y position for the header
    const lineSpacing = 8; // Space between the two lines
    const textLineHeight = 3; // Space between text and the line

    // Draw lines (horizontal solid lines) for both fields together
    doc.setLineWidth(0.5);
    doc.line(
      leftMargin,
      headerHeight + textLineHeight,
      rightMargin,
      headerHeight + textLineHeight
    ); // Line above the fields
    doc.line(
      leftMargin,
      headerHeight + lineSpacing + textLineHeight,
      rightMargin,
      headerHeight + lineSpacing + textLineHeight
    ); // Line below the fields

    // Invoice Number on the left, Date Issued on the right
    doc.setFontSize(12);
    doc.text(
      `Invoice Number: ${selectedInvoice.invoiceCode}`,
      leftMargin,
      headerHeight + lineSpacing
    );

    // Align Date Issued to the right side
    doc.text(
      `Date Issued: ${new Date(
        selectedInvoice.createdAt
      ).toLocaleDateString()}`,
      rightMargin - 55, // Adjust position for the right margin
      headerHeight + lineSpacing
    );

    // Bill To Section
    doc.setFontSize(14);
    doc.text("Bill To:", leftMargin, 60);
    doc.setFontSize(12);
    doc.text(`${selectedInvoice.customerName}`, leftMargin, 68);
    doc.text(`Number: ${selectedInvoice.customerNo || "N/A"}`, leftMargin, 76);
    doc.text(`Address: ${selectedInvoice.billingAddress}`, leftMargin, 84);

    // Bill From Section aligned to the right side but with left alignment
    const billFromX = rightMargin - 80; // Adjust positioning within margin
    doc.setFontSize(14);
    doc.text("Bill From:", billFromX, 60);
    doc.setFontSize(12);
    doc.text("Maligavila Road, Kubukkana Junction,", billFromX, 65);
    doc.text("Monaragala", billFromX, 70);
    doc.text("Ref Details:", billFromX, 75);
    doc.text("N S S Nalinda - 0774325580", billFromX, 80);
    doc.text("G Yogeshwaram - 0766259072", billFromX, 85);

    // Invoice Items Table with width adjusted for margins
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
      startY: 108,
      margin: { left: leftMargin, right: leftMargin }, // Set margins here
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

    // Total Amount
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(
      `Total: ${selectedInvoice.invoiceTotal.toFixed(2)}`,
      rightMargin,
      finalY,
      { align: "right" }
    );

    // Footer
    doc.setFontSize(10);
    doc.text("Prepared By: __________________", leftMargin, finalY + 20);

    // Save the PDF
    doc.save(`Invoice_${selectedInvoice.invoiceCode}.pdf`);
  };

  return (
    <>
      <Sidebar />
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          flexDirection: "column", // Stack cards vertically
          gap: "16px", // Space between cards
          minHeight: "100vh", // Full screen height
          padding: "20px", // Some padding around the content
        }}
      >
        {invoices.map((invoice) => (
          <Card
            key={invoice.invoiceId}
            bordered
            style={{ width: "400px" }} // Set the width of the card
            extra={
              <Button type="link" onClick={() => viewInvoiceDetails(invoice)}>
                View Details
              </Button>
            }
          >
            <p>
              <strong>Invoice Number:</strong> {invoice.invoiceCode}
            </p>
            <p>
              <strong>Customer Name:</strong> {invoice.customerName}
            </p>
            <p>
              <strong>Billing Address:</strong> {invoice.billingAddress}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(invoice.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Total Amount:</strong> {invoice.invoiceTotal.toFixed(2)}
            </p>
          </Card>
        ))}

        {/* Modal for Invoice Details */}
        <Modal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="print" type="primary" onClick={handlePrint}>
              Print to PDF
            </Button>,
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedInvoice && (
            <div>
              <p>
                <strong>Invoice Number:</strong> {selectedInvoice.invoiceCode}
              </p>
              <p>
                <strong>Customer Name:</strong> {selectedInvoice.customerName}
              </p>
              <p>
                <strong>Customer No:</strong> {selectedInvoice.customerNo}
              </p>
              <p>
                <strong>Billing Address:</strong>{" "}
                {selectedInvoice.billingAddress}
              </p>
              <List
                header={
                  <Typography.Title level={4}>Invoice Items</Typography.Title>
                }
                bordered
                dataSource={selectedInvoice.invoiceItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${item.productName} (Category: ${item.categoryName})`}
                      description={`Qty: ${
                        item.quantity
                      }, Unit Price: ${item.unitPrice.toFixed(
                        2
                      )}, Amount: ${item.amount.toFixed(2)}`}
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default InvoiceList;
