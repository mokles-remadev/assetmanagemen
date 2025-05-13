import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  Table,
  InputNumber,
  Select,
  DatePicker,
  Typography,
  message,
  Card,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  PrinterOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { generatePDF } from './pdfGenerator';

const { Title } = Typography;
const { TextArea } = Input;

const PurchaseOrderForm = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([{ key: uuidv4(), description: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    vendorName: yup.string().required('Vendor name is required'),
    vendorAddress: yup.string().required('Vendor address is required'),
    vendorContact: yup.string().required('Vendor contact is required'),
    billingAddress: yup.string().required('Billing address is required'),
    shippingAddress: yup.string().required('Shipping address is required'),
    items: yup.array().of(
      yup.object().shape({
        description: yup.string().required('Item description is required'),
        quantity: yup.number().required('Quantity is required').positive('Quantity must be positive'),
        unitPrice: yup.number().required('Unit price is required').positive('Unit price must be positive'),
      })
    ),
  });

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.19; // 19% VAT
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const addItem = () => {
    setItems([...items, { key: uuidv4(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (key) => {
    setItems(items.filter(item => item.key !== key));
  };

  const updateItem = (key, field, value) => {
    setItems(items.map(item => 
      item.key === key ? { ...item, [field]: value } : item
    ));
  };

  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        items,
        ...calculateTotals(),
        poNumber: `PO-${Date.now()}`,
        date: new Date().toISOString(),
      };

      await validationSchema.validate(formData, { abortEarly: false });
      generatePDF(formData);
    } catch (error) {
      if (error.inner) {
        error.inner.forEach(err => {
          message.error(err.message);
        });
      } else {
        message.error('Please fill in all required fields');
      }
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        items,
        ...calculateTotals(),
        poNumber: `PO-${Date.now()}`,
        date: new Date().toISOString(),
      };

      await validationSchema.validate(formData, { abortEarly: false });
      setLoading(true);
      
      // TODO: Implement API call to save PO
      console.log('Saving PO:', formData);
      
      message.success('Purchase Order saved successfully');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.inner) {
        error.inner.forEach(err => {
          message.error(err.message);
        });
      } else {
        message.error('Please fill in all required fields');
      }
    }
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => updateItem(record.key, 'description', e.target.value)}
          placeholder="Enter item description"
        />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (text, record) => (
        <InputNumber
          min={1}
          value={text}
          onChange={(value) => updateItem(record.key, 'quantity', value)}
        />
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (text, record) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => updateItem(record.key, 'unitPrice', value)}
          prefix="$"
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: 120,
      render: (_, record) => (
        <span>${(record.quantity * record.unitPrice).toFixed(2)}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 60,
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.key)}
          disabled={items.length === 1}
        />
      ),
    },
  ];

  const { subtotal, tax, total } = calculateTotals();

  return (
    <Card>
      <Title level={2}>Create Purchase Order</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          terms: 'Net 30',
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="vendorName"
              label="Vendor Name"
              rules={[{ required: true, message: 'Please enter vendor name' }]}
            >
              <Input placeholder="Enter vendor name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="vendorContact"
              label="Vendor Contact"
              rules={[{ required: true, message: 'Please enter vendor contact' }]}
            >
              <Input placeholder="Enter vendor contact details" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="vendorAddress"
              label="Vendor Address"
              rules={[{ required: true, message: 'Please enter vendor address' }]}
            >
              <TextArea rows={4} placeholder="Enter vendor address" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="billingAddress"
              label="Billing Address"
              rules={[{ required: true, message: 'Please enter billing address' }]}
            >
              <TextArea rows={4} placeholder="Enter billing address" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="shippingAddress"
          label="Shipping Address"
          rules={[{ required: true, message: 'Please enter shipping address' }]}
        >
          <TextArea rows={4} placeholder="Enter shipping address" />
        </Form.Item>

        <Divider>Items</Divider>

        <Table
          dataSource={items}
          columns={columns}
          pagination={false}
          rowKey="key"
        />

        <Button
          type="dashed"
          onClick={addItem}
          style={{ marginTop: 16, marginBottom: 24 }}
          icon={<PlusOutlined />}
        >
          Add Item
        </Button>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="terms"
              label="Payment Terms"
              rules={[{ required: true, message: 'Please select payment terms' }]}
            >
              <Select>
                <Select.Option value="Net 30">Net 30</Select.Option>
                <Select.Option value="Net 60">Net 60</Select.Option>
                <Select.Option value="Due on Receipt">Due on Receipt</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row justify="space-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </Row>
                <Row justify="space-between">
                  <span>Tax (19%):</span>
                  <span>${tax.toFixed(2)}</span>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row justify="space-between">
                  <span><strong>Total:</strong></span>
                  <span><strong>${total.toFixed(2)}</strong></span>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea rows={4} placeholder="Enter any additional notes" />
        </Form.Item>

        <Space>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
          >
            Save
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={handlePreview}
          >
            Preview
          </Button>
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePreview}
          >
            Print
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default PurchaseOrderForm;