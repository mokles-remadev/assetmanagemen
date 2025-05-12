import React from 'react';
import { Row, Col, Card, Statistic, Tooltip } from 'antd';
import { 
  DashboardOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  DollarOutlined,
  ToolOutlined,
  ClockCircleOutlined,
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
    legend: {
      position: 'bottom',
    },
    tooltip: {
      formatter: (datum) => {
        return { name: datum.type, value: `${datum.value} (${((datum.value / stats.totalAssets) * 100).toFixed(1)}%)` };
      },
    },
  };

  const formatCurrency = (value) => 
    new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(value);

  const categoryPieData = assetsByCategory.map(item => ({
    type: item.type,
    value: item.value,
  }));

  const statusPieData = assetsByStatus.map(item => ({
    type: item.type,
    value: item.value,
  }));

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Assets"
              value={stats.totalAssets}
              prefix={<DashboardOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Assets"
              value={stats.activeAssets}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${stats.totalAssets}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Tooltip title="Total value of all assets">
            <Card>
              <Statistic
                title="Total Value"
                value={stats.totalValue}
                prefix={<DollarOutlined />}
                formatter={value => formatCurrency(value)}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="In Maintenance"
              value={stats.maintenanceCount}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={`/ ${stats.totalAssets}`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card 
            title="Assets by Category"
            extra={
              <Tooltip title="Distribution of assets across different categories">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <Pie {...pieConfig} data={categoryPieData} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="Assets by Status"
            extra={
              <Tooltip title="Current status distribution of all assets">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <Pie {...pieConfig} data={statusPieData} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardStats;