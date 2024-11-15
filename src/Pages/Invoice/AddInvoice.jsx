import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Select, Table, message } from "antd";
import config from "../../config";
import Sidebar from "../../Components/SideBar";
import "../../Styles/Invoice.css";

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

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (productName, record, index) => (
        <Select
          showSearch
          style={{ width: 200 }}
          value={productName}
          onChange={(value) => handleInvoiceItemChange(index, "productName", value)}
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
      render: (quantity, record, index) => (
        <Input
          type="number"
          value={quantity}
          onChange={(e) =>
            handleInvoiceItemChange(index, "quantity", e.target.value)
          }
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (unitPrice, record, index) => (
        <Input
          type="number"
          value={unitPrice}
          onChange={(e) =>
            handleInvoiceItemChange(index, "unitPrice", e.target.value)
          }
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => amount.toFixed(2),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, __, index) => (
        <Button
          type="danger"
          onClick={() => removeInvoiceItem(index)}
          icon="delete"
        >
          Remove
        </Button>
      ),
    },
  ];
  

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
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
                rules={[{ required: true, message: "Invoice code is required!" }]}
              >
                <Input placeholder="e.g., INXXXXX" />
              </Form.Item>
            </div>
            <div className="mb-3">
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[{ required: true, message: "Customer name is required!" }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="mb-3">
              <Form.Item
                label="Customer No"
                name="customerNo"
                rules={[{ required: true, message: "Customer number is required!" }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="mb-3">
              <Form.Item
                label="Billing Address"
                name="billingAddress"
                rules={[{ required: true, message: "Billing address is required!" }]}
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
              footer={() => (
                <div>
                  <strong>Total: {invoiceTotal.toFixed(2)}</strong>
                </div>
              )}
            />
            <Button
              type="dashed"
              icon="plus"
              onClick={addInvoiceItem}
              style={{ marginBottom: 20 }}
            >
              Add Item
            </Button>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: "100%" }}
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
