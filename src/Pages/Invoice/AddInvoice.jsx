import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Select, Table, message } from "antd";
import config from "../../config";
import Sidebar from "../../Components/SideBar";
import "../../Styles/Invoice.css";
import AuthService from "../../Components/AuthService";
import SidebarRef from "../../Components/SideBarRef";
import "../../Styles/AddProduct.css";
import { FaTrashAlt } from "react-icons/fa";

const { Option } = Select;

const AddInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([
    { productName: "", quantity: 1, unitPrice: 0, amount: 0 },
  ]);
  const [invoiceTotal, setInvoiceTotal] = useState(0);

  // Fetch products for the select dropdown
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      message.error("Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener("resize", handleResize);

      // Clean up the event listener
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return isMobile;
  };

  // Update amount and total when quantity or unitPrice changes
  const handleInvoiceItemChange = (index, field, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index][field] = value;
    updatedItems[index].amount =
      updatedItems[index].quantity * updatedItems[index].unitPrice;
    setInvoiceItems(updatedItems);
    updateInvoiceTotal(updatedItems);
  };

  // Add new invoice item
  const addInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { productName: "", quantity: 1, unitPrice: 0, amount: 0 },
    ]);
  };

  // Remove invoice item
  const removeInvoiceItem = (index) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
    updateInvoiceTotal(updatedItems);
  };

  // Update total amount
  const updateInvoiceTotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.amount, 0);
    setInvoiceTotal(total);
  };

  // Submit invoice
  const handleSubmit = async (values) => {
    setLoading(true);
    const invoiceData = {
      invoiceCode: values.invoiceCode,
      customerName: values.customerName,
      customerNo: values.customerNo,
      billingAddress: values.billingAddress,
      invoiceTotal,
      invoiceItems,
    };

    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/invoices`,
        invoiceData
      );
      if (response.status === 200) {
        message.success("Invoice created successfully!");
        // Reset form
        setInvoiceItems([
          { productName: "", quantity: 1, unitPrice: 0, amount: 0 },
        ]);
        setInvoiceTotal(0);
      }
    } catch (error) {
      message.error("Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = useIsMobile();

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (productName, record, index) =>
        isMobile ? (
          <div>
            <strong>Product Name:</strong>
            <Select
              showSearch
              style={{ width: "100%" }}
              value={productName}
              onChange={(value) =>
                handleInvoiceItemChange(index, "productName", value)
              }
              placeholder="Select Product"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {products.map((product) => (
                <Option key={product.productId} value={product.productName}>
                  {product.productName}
                </Option>
              ))}
            </Select>
          </div>
        ) : (
          <Select
            showSearch
            style={{ width: "100%" }}
            value={productName}
            onChange={(value) =>
              handleInvoiceItemChange(index, "productName", value)
            }
            placeholder="Select Product"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {products.map((product) => (
              <Option key={product.productId} value={product.productName}>
                {product.productName}
              </Option>
            ))}
          </Select>
        ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record, index) =>
        isMobile ? (
          <div>
            <strong>Quantity:</strong>
            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                handleInvoiceItemChange(index, "quantity", e.target.value)
              }
              style={{ width: "100%" }}
            />
          </div>
        ) : (
          <Input
            type="number"
            value={quantity}
            onChange={(e) =>
              handleInvoiceItemChange(index, "quantity", e.target.value)
            }
            style={{ width: "100%" }}
          />
        ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (unitPrice, record, index) =>
        isMobile ? (
          <div>
            <strong>Unit Price:</strong>
            <Input
              type="number"
              value={unitPrice}
              onChange={(e) =>
                handleInvoiceItemChange(index, "unitPrice", e.target.value)
              }
              style={{ width: "100%" }}
            />
          </div>
        ) : (
          <Input
            type="number"
            value={unitPrice}
            onChange={(e) =>
              handleInvoiceItemChange(index, "unitPrice", e.target.value)
            }
            style={{ width: "100%" }}
          />
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        isMobile ? (
          <div>
            <strong>Amount:</strong> {amount.toFixed(2)}
          </div>
        ) : (
          amount.toFixed(2)
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, __, index) =>
        isMobile ? (
          <div>
            <strong>Actions:</strong>
            <Button type="danger" onClick={() => removeInvoiceItem(index)}>
              <FaTrashAlt style={{ fontSize: isMobile ? "18px" : "20px" }} />
              Remove
            </Button>
          </div>
        ) : (
          <Button type="danger" onClick={() => removeInvoiceItem(index)}>
            <FaTrashAlt style={{ fontSize: isMobile ? "18px" : "20px" }} />
            Remove
          </Button>
        ),
    },
  ];

  const role = AuthService.getCurrentUserRole();

  return (
    <div className="d-flex">
      {role === "admin" ? <Sidebar /> : <SidebarRef />}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <br />
        <div
          className="card shadow-sm p-4"
          style={{ maxWidth: "800px", width: "100%" }}
        >
          <h3 className="card-title mb-4 text-center">Create Invoice</h3>
          <Form onFinish={handleSubmit}>
            <div className="mb-3">
              <Form.Item
                label="Invoice Code"
                name="invoiceCode"
                rules={[
                  { required: true, message: "Invoice code is required!" },
                ]}
              >
                <Input placeholder="e.g., INXXXXX" />
              </Form.Item>
            </div>
            <div className="mb-3">
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[
                  { required: true, message: "Customer name is required!" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="mb-3">
              <Form.Item
                label="Customer No"
                name="customerNo"
                rules={[
                  { required: true, message: "Customer number is required!" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="mb-3">
              <Form.Item
                label="Billing Address"
                name="billingAddress"
                rules={[
                  { required: true, message: "Billing address is required!" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <h5 className="mb-3">Invoice Items</h5>
            <Table
              dataSource={invoiceItems}
              columns={columns}
              rowKey="productName"
              pagination={false}
              responsive={true} // Ensures the table adapts to smaller screens
              className="responsive-table"
              footer={() => (
                <div>
                  <strong>Total: {invoiceTotal.toFixed(2)}</strong>
                </div>
              )}
            />
            <Button
              type="dashed"
              onClick={addInvoiceItem}
              style={{
                marginBottom: 20,
                width: isMobile ? "100%" : "auto",
                fontSize: isMobile ? "14px" : "16px",
                padding: isMobile ? "10px" : "8px 15px",
                maxWidth: "140px",
              }}
            >
              Add Item
            </Button>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: isMobile ? "100%" : "200px",
                  fontSize: isMobile ? "14px" : "16px",
                  padding: isMobile ? "12px" : "10px 20px",
                  maxWidth: "140px",
                }}
              >
                Create Invoice
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;
