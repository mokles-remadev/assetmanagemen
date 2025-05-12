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
  Tooltip,
  Progress,
  Timeline,
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
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import moment from 'moment';
import { 
  getITassets, 
  getFurnitureassets, 
  getRealEstateassets, 
  getToolassets, 
  getVehicleassets,
  updateITassets,
  updateFurnitureassets,
  updateRealEstateassets,
  updateToolassets,
  updateVehicleassets,
  getAssetHistory,
  transferAsset,
} from '../../apipurchase';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const statusColors = {
  'Active': 'success',
  'Maintenance': 'warning',
  'Retired': 'error',
  'Reserved': 'processing'
};

const formatCurrency = (value) => 
  new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(value);

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('IT MATERIALS');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [assetHistory, setAssetHistory] = useState([]);
  const [transferForm] = Form.useForm();
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
    const depreciationValue = assets.reduce((sum, asset) => {
      const initialValue = parseFloat(asset.initialValue) || 0;
      const age = moment().diff(moment(asset.acquisitionDate), 'years');
      const depreciation = initialValue * (age * 0.1); // 10% per year
      return sum + Math.max(0, initialValue - depreciation);
    }, 0);

    return { totalAssets, activeAssets, totalValue, maintenanceCount, depreciationValue };
  };

  const showHistory = async (asset) => {
    try {
      setLoading(true);
      const history = await getAssetHistory(asset.id, selectedCategory);
      setAssetHistory(history);
      setSelectedAsset(asset);
      setHistoryModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch asset history');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = (asset) => {
    setSelectedAsset(asset);
    setTransferModalVisible(true);
    transferForm.resetFields();
  };

  const handleTransferSubmit = async () => {
    try {
      const values = await transferForm.validateFields();
      await transferAsset(selectedAsset.id, selectedCategory, {
        ...values,
        transferDate: values.transferDate.format('YYYY-MM-DD'),
      });
      message.success('Asset transferred successfully');
      setTransferModalVisible(false);
      fetchAssets();
    } catch (error) {
      message.error('Failed to transfer asset');
    }
  };

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    form.setFieldsValue({
      ...asset,
      assignedDate: asset.assignedDate ? moment(asset.assignedDate) : null,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      let updateFn;
      switch (selectedCategory) {
        case 'IT MATERIALS':
          updateFn = updateITassets;
          break;
        case 'FURNITURE':
          updateFn = updateFurnitureassets;
          break;
        case 'VEHICLES':
          updateFn = updateVehicleassets;
          break;
        case 'REAL ESTATE':
          updateFn = updateRealEstateassets;
          break;
        case 'TOOLS':
          updateFn = updateToolassets;
          break;
      }
      
      await updateFn(selectedAsset.id, {
        ...selectedAsset,
        ...values,
        lastUpdateTimestamp: new Date().toISOString(),
      });
      
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
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (text, record) => (
        <Space>
          {text || 'Unassigned'}
          {record.assignedDate && (
            <Tooltip title={`Assigned on ${moment(record.assignedDate).format('LL')}`}>
              <InfoCircleOutlined />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'building',
      key: 'building',
      render: (text, record) => (
        <Space>
          {text}
          <Tag color="blue">{record.room || 'N/A'}</Tag>
        </Space>
      ),
    },
    {
      title: 'Value',
      key: 'value',
      render: (_, record) => {
        const initialValue = parseFloat(record.initialValue) || 0;
        const age = moment().diff(moment(record.acquisitionDate), 'years');
        const depreciation = initialValue * (age * 0.1); // 10% per year
        const currentValue = Math.max(0, initialValue - depreciation);
        
        return (
          <Tooltip title={`Initial: ${formatCurrency(initialValue)}`}>
            <Space direction="vertical" size="small">
              <span>{formatCurrency(currentValue)}</span>
              <Progress 
                percent={Math.round((currentValue / initialValue) * 100)}
                size="small"
                status={currentValue < initialValue * 0.2 ? 'exception' : 'normal'}
              />
            </Space>
          </Tooltip>
        );
      },
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
            icon={<SwapOutlined />} 
            onClick={() => handleTransfer(record)}
          />
          <Button 
            type="text" 
            icon={<HistoryOutlined />} 
            onClick={() => showHistory(record)}
          />
        </Space>
      ),
    },
  ];

  const stats = calculateStatistics();

  const renderValueTrendChart = () => {
    const data = assets.map(asset => {
      const initialValue = parseFloat(asset.initialValue) || 0;
      const age = moment().diff(moment(asset.acquisitionDate), 'years');
      const depreciation = initialValue * (age * 0.1);
      return {
        date: asset.acquisitionDate,
        value: initialValue - depreciation,
        type: 'Current Value',
      };
    });

    return (
      <Card title="Asset Value Trend">
        <Area
          data={data}
          xField="date"
          yField="value"
          seriesField="type"
          smooth
          animation={{
            appear: {
              animation: 'wave-in',
              duration: 1000,
            },
          }}
        />
      </Card>
    );
  };

  return (
    <Layout className="site-layout">
      <Header className="site-layout-header">
        <Row justify="space-between" align="middle">
          <Col>
            <h1 className="header-title">Asset Management Dashboard</h1>
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
                precision={3}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="In Maintenance"
                value={stats.maintenanceCount}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {renderValueTrendChart()}

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
              asset.assetTag?.toLowerCase().includes(searchText.toLowerCase()) ||
              asset.name?.toLowerCase().includes(searchText.toLowerCase())
            )}
            loading={loading}
            rowKey="id"
          />
        </Card>

        <Modal
          title="Edit Asset"
          visible={editModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => setEditModalVisible(false)}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
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
              </Col>
              <Col span={12}>
                <Form.Item
                  name="assignedTo"
                  label="Assigned To"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="building"
                  label="Building"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="room"
                  label="Room"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="condition"
              label="Current Condition"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Excellent">Excellent</Select.Option>
                <Select.Option value="Good">Good</Select.Option>
                <Select.Option value="Fair">Fair</Select.Option>
                <Select.Option value="Poor">Poor</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="notes"
              label="Notes"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Asset History"
          visible={historyModalVisible}
          onCancel={() => setHistoryModalVisible(false)}
          footer={null}
          width={600}
        >
          <Timeline>
            {assetHistory.map((event, index) => (
              <Timeline.Item key={index} color={event.type === 'transfer' ? 'blue' : 'green'}>
                <p><strong>{event.type}</strong> - {moment(event.date).format('LLL')}</p>
                <p>{event.description}</p>
                {event.type === 'transfer' && (
                  <p>
                    <EnvironmentOutlined /> From: {event.fromLocation} → To: {event.toLocation}
                    <br />
                    <UserOutlined /> By: {event.by}
                  </p>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        </Modal>

        <Modal
          title="Transfer Asset"
          visible={transferModalVisible}
          onOk={handleTransferSubmit}
          onCancel={() => setTransferModalVisible(false)}
          width={500}
        >
          <Form
            form={transferForm}
            layout="vertical"
          >
            <Form.Item
              name="newDepartment"
              label="New Department"
              rules={[{ required: true, message: 'Please select new department' }]}
            >
              <Select>
                <Select.Option value="IT">IT Department</Select.Option>
                <Select.Option value="HR">HR Department</Select.Option>
                <Select.Option value="Finance">Finance Department</Select.Option>
                <Select.Option value="Operations">Operations</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="newLocation"
              label="New Location"
              rules={[{ required: true, message: 'Please enter new location' }]}
            >
              <Input placeholder="Building and Room Number" />
            </Form.Item>
            <Form.Item
              name="transferDate"
              label="Transfer Date"
              rules={[{ required: true, message: 'Please select transfer date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="reason"
              label="Transfer Reason"
              rules={[{ required: true, message: 'Please provide transfer reason' }]}
            >
              <Input.TextArea rows={4} />
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
      </Content>
    </Layout>
  );
};

export default Dashboard;