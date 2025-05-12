import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  DashboardOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Pie } from '@ant-design/plots';

const DashboardStats = ({ stats, assetsByCategory, assetsByStatus }) => {
  const pieConfig = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const formatCurrency = (value) => 
    new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(value);

  return (
    <>
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
              prefix={<DollarOutlined />}
              formatter={value => formatCurrency(value)}
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

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Assets by Category">
            <Pie {...pieConfig} data={assetsByCategory} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Assets by Status">
            <Pie {...pieConfig} data={assetsByStatus} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardStats;