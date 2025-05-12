import React, { useState, useEffect } from 'react';
import {
  Layout,
  Button,
  Space,
  Tabs,
  Row,
  Col,
  Card,
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  FilterOutlined,
  DesktopOutlined,
  HomeOutlined,
  CarOutlined,
  BankOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { 
  getITassets, 
  getFurnitureassets, 
  getRealEstateassets, 
  getToolassets, 
  getVehicleassets,
} from '../../apipurchase';
import DashboardStats from './components/DashboardStats';
import AssetList from './components/AssetList';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const assetCategories = {
  'IT MATERIALS': ['Laptops', 'Desktops', 'Monitors', 'Printers', 'Hard Drives', 'Networking Equipment'],
  'FURNITURE': ['Desks', 'Chairs', 'Cabinets', 'Tables', 'Sofas', 'Shelves'],
  'VEHICLES': ['Cars', 'Trucks', 'Vans', 'Motorcycles', 'Special Vehicles'],
  'REAL ESTATE': ['Offices', 'Warehouses', 'Land', 'Apartments', 'Retail Spaces'],
  'TOOLS': ['Power Tools', 'Hand Tools', 'Measuring Equipment', 'Safety Equipment'],
};

const defaultAssetFields = {
  IT: [
    { key: "manufacturer", label: "Manufacturer", type: "input" },
    { key: "model", label: "Model", type: "input" },
    { key: "serialNumber", label: "Serial Number", type: "input" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "warrantyExpiry", label: "Warranty Expiry", type: "date" },
    { key: "warrantyDocumentLink", label: "Warranty Document Link", type: "input" },
  ],
  FURNITURE: [
    { key: "manufacturer", label: "Manufacturer", type: "input" },
    { key: "model", label: "Model", type: "input" },
    { key: "serialNumber", label: "Serial Number", type: "input" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "warrantyExpiry", label: "Warranty Expiry", type: "date" },
    { key: "warrantyDocumentLink", label: "Warranty Document Link", type: "input" },
  ],
  VEHICLES: [
    { key: "manufacturer", label: "Manufacturer", type: "input" },
    { key: "model", label: "Model", type: "input" },
    { key: "modelYear", label: "Model Year", type: "input" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "vin", label: "VIN Number", type: "input" },
    { key: "chasisNumber", label: "Chasis Number", type: "input" },
    { key: "engineType", label: "Engine Type", type: "select", options: ["petrol", "diesel", "electric", "hybrid"] },
    { key: "engineNumber", label: "Engine Number", type: "input" },
    { key: "plateNumber", label: "Plate Number", type: "input" },
    { key: "odometerReading", label: "Odometer Reading", type: "input" },
    { key: "registrationDate", label: "Registration Date", type: "date" },
    { key: "warrantyExpiry", label: "Warranty Expiry", type: "date" },
    { key: "warrantyDetails", label: "Warranty Details", type: "textarea" },
    { key: "warrantyDocumentLink", label: "Warranty Document Link", type: "input" },
    { key: "pictureLink", label: "Picture Link", type: "input" },
  ],
  REAL_ESTATE: [
    { key: "location", label: "Address Location", type: "input" },
    { key: "propertyType", label: "Property Type", type: "select", options: ["office", "warehouse", "land", "apartment", "other"] },
    { key: "propertySize", label: "Property Size", type: "input" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  TOOLS: [
    { key: "manufacturer", label: "Manufacturer", type: "input" },
    { key: "model", label: "Model", type: "input" },
    { key: "serialNumber", label: "Serial Number", type: "input" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "warrantyExpiry", label: "Warranty Expiry", type: "date" },
    { key: "warrantyDocumentLink", label: "Warranty Document Link", type: "input" },
  ],
};

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('IT MATERIALS');

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

  const calculateAssetDistribution = () => {
    const categoryCount = {};
    const statusCount = {};

    assets.forEach(asset => {
      const category = asset.description || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;

      const status = asset.status || 'Unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const assetsByCategory = Object.entries(categoryCount).map(([type, value]) => ({
      type,
      value,
    }));

    const assetsByStatus = Object.entries(statusCount).map(([type, value]) => ({
      type,
      value,
    }));

    return { assetsByCategory, assetsByStatus };
  };

  const { assetsByCategory, assetsByStatus } = calculateAssetDistribution();

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
        <DashboardStats 
          stats={calculateStatistics()} 
          assetsByCategory={assetsByCategory}
          assetsByStatus={assetsByStatus}
        />

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

          <AssetList 
            assets={assets}
            loading={loading}
            selectedCategory={selectedCategory}
            assetCategories={assetCategories}
            defaultAssetFields={defaultAssetFields}
          />
        </Card>
      </Content>

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