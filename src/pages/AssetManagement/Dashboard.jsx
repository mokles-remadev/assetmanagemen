import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Table,
  Tag,
  Input,
  Tabs,
  Space,
  Select,
  DatePicker,
  Modal,
  Form,
  message,
  Badge,
  Dropdown,
  Menu,
} from 'antd';
import {
  DashboardOutlined,
  PlusOutlined,
  ExportOutlined,
  FilterOutlined,
  SearchOutlined,
  DesktopOutlined,
  HomeOutlined,
  CarOutlined,
  BankOutlined,
  ToolOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { 
  getITassets, 
  getFurnitureassets, 
  getRealEstateassets, 
  getToolassets, 
  getVehicleassets,
  updateAsset,
  deleteAsset,
} from '../../apipurchase';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const statusColors = {
  'Active': 'success',
  'Maintenance': 'warning',
  'Retired': 'error',
  'Reserved': 'processing'
};

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('IT MATERIALS');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAssets();
  }, [selectedCategory]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      let data;
      switch (selectedCategory) {
        case 'IT MATERIALS':
          data = await getITassets();
          break;
        case 'FURNITURE':
          data = await getFurnitureassets();
          break;
        case 'VEHICLES':
          data = await getVehicleassets();
          break;
        case 'REAL ESTATE':
          data = await getRealEstateassets();
          break;
        case 'TOOLS':
          data = await getToolassets();
          break;
        default:
          data = [];
      }
      setAssets(data);
    } catch (error) {
      message.error('Failed to fetch assets');
    }
    setLoading(false);
  };

  const calculateStatistics = () => {
    const totalAssets = assets.length;
    const activeAssets = assets.filter(asset => asset.status === 'Active').length;
    const totalValue = assets.reduce((sum, asset) => sum + (parseFloat(asset.initialValue) || 0), 0);
    const maintenanceCount = assets.filter(asset => asset.status === 'Maintenance').length;

    return { totalAssets, activeAssets, totalValue, maintenanceCount };
  };

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    form.setFieldsValue(asset);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateAsset(selectedAsset.id, { ...selectedAsset, ...values });
      message.success('Asset updated successfully');
      setEditModalVisible(false);
      fetchAssets();
    } catch (error) {
      message.error('Failed to update asset');
    }
  };

  const columns = [
    {
      title: 'Asset Tag',
      dataIndex: 'assetTag',
      key: 'assetTag',
      sorter: (a, b) => a.assetTag.localeCompare(b.assetTag),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'building',
      key: 'building',
    },
    {
      title: 'Purchase Date',
      dataIndex: 'acquisitionDate',
      key: 'acquisitionDate',
      sorter: (a, b) => new Date(a.acquisitionDate) - new Date(b.acquisitionDate),
    },
    {
      title: 'Initial Value',
      dataIndex: 'initialValue',
      key: 'initialValue',
      render: (value) => new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            icon={<HistoryOutlined />} 
            onClick={() => showMaintenanceHistory(record)}
          />
          <Button 
            type="text" 
            icon={<SwapOutlined />} 
            onClick={() => handleTransfer(record)}
          />
        </Space>
      ),
    },
  ];

  const stats = calculateStatistics();

  return (
    <Layout className="site-layout">
      <Header className="site-layout-header">
        <Row justify="space-between" align="middle">
          <Col>
            <h1 className="header-title">Asset Management</h1>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<PlusOutlined />}>
                Add Asset
              </Button>
              <Button icon={<ExportOutlined />}>Export</Button>
              <Button icon={<FilterOutlined />}>Filter</Button>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content className="site-layout-content">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Assets"
                value={stats.totalAssets}
                prefix={<DashboardOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Assets"
                value={stats.activeAssets}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Value"
                value={stats.totalValue}
                prefix="TND"
                precision={2}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="In Maintenance"
                value={stats.maintenanceCount}
                prefix={<ToolOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginTop: 16 }}>
          <Tabs 
            activeKey={selectedCategory}
            onChange={setSelectedCategory}
          >
            <TabPane tab={<><DesktopOutlined /> IT MATERIALS</>} key="IT MATERIALS" />
            <TabPane tab={<><HomeOutlined /> FURNITURE</>} key="FURNITURE" />
            <TabPane tab={<><CarOutlined /> VEHICLES</>} key="VEHICLES" />
            <TabPane tab={<><BankOutlined /> REAL ESTATE</>} key="REAL ESTATE" />
            <TabPane tab={<><ToolOutlined /> TOOLS</>} key="TOOLS" />
          </Tabs>

          <div style={{ marginBottom: 16 }}>
            <Input.Search
              placeholder="Search assets..."
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </div>

          <Table
            columns={columns}
            dataSource={assets.filter(asset => 
              asset.assetTag.toLowerCase().includes(searchText.toLowerCase()) ||
              asset.name.toLowerCase().includes(searchText.toLowerCase())
            )}
            loading={loading}
            rowKey="id"
          />
        </Card>
      </Content>

      <Modal
        title="Edit Asset"
        visible={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Maintenance">Maintenance</Select.Option>
              <Select.Option value="Retired">Retired</Select.Option>
              <Select.Option value="Reserved">Reserved</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="building"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .site-layout {
          min-height: 100vh;
        }
        .site-layout-header {
          background: #fff;
          padding: 0 24px;
          box-shadow: 0 1px 4px rgba(0,21,41,.08);
        }
        .header-title {
          margin: 0;
          color: #1890ff;
          font-size: 20px;
        }
        .site-layout-content {
          margin: 24px 16px;
          padding: 24px;
          background: #fff;
        }
      `}</style>
    </Layout>
  );
};

export default Dashboard;