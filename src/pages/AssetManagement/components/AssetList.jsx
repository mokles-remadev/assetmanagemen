import React, { useState } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
  Tooltip,
  Progress,
  Modal,
  Form,
  DatePicker,
  Timeline,
} from 'antd';
import {
  EditOutlined,
  SwapOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const statusColors = {
  'Active': 'success',
  'Maintenance': 'warning',
  'Retired': 'error',
  'Reserved': 'processing',
  'In Stock': 'default'
};

const AssetList = ({
  assets,
  loading,
  selectedCategory,
  onEdit,
  onTransfer,
  onHistory,
  assetCategories,
  defaultAssetFields,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [filterManufacturer, setFilterManufacturer] = useState(null);
  const [filterModel, setFilterModel] = useState(null);
  const [filterSupplier, setFilterSupplier] = useState(null);

  const getUniqueValues = (field) => {
    return [...new Set(assets.map(asset => asset[field]))].filter(Boolean);
  };

  const manufacturers = getUniqueValues('manufacturer');
  const models = getUniqueValues('model');
  const suppliers = getUniqueValues('supplierName');

  const formatCurrency = (value) => 
    new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(value);

  const filteredAssets = assets.filter(asset => {
    return (!selectedSubCategory || asset.description === selectedSubCategory) &&
           (!filterManufacturer || asset.manufacturer === filterManufacturer) &&
           (!filterModel || asset.model === filterModel) &&
           (!filterSupplier || asset.supplierName === filterSupplier) &&
           (searchText ? 
             asset.assetTag?.toLowerCase().includes(searchText.toLowerCase()) ||
             asset.name?.toLowerCase().includes(searchText.toLowerCase())
             : true
           );
  });

  const renderFilters = () => (
    <Space style={{ marginBottom: 16 }}>
      <Select
        allowClear
        placeholder="Category"
        style={{ width: 200 }}
        value={selectedSubCategory}
        onChange={setSelectedSubCategory}
      >
        {assetCategories[selectedCategory]?.map(cat => (
          <Option key={cat} value={cat}>{cat}</Option>
        ))}
      </Select>
      <Select
        allowClear
        placeholder="Manufacturer"
        style={{ width: 200 }}
        value={filterManufacturer}
        onChange={setFilterManufacturer}
      >
        {manufacturers.map(m => (
          <Option key={m} value={m}>{m}</Option>
        ))}
      </Select>
      <Select
        allowClear
        placeholder="Model"
        style={{ width: 200 }}
        value={filterModel}
        onChange={setFilterModel}
      >
        {models.map(m => (
          <Option key={m} value={m}>{m}</Option>
        ))}
      </Select>
      <Select
        allowClear
        placeholder="Supplier"
        style={{ width: 200 }}
        value={filterSupplier}
        onChange={setFilterSupplier}
      >
        {suppliers.map(s => (
          <Option key={s} value={s}>{s}</Option>
        ))}
      </Select>
      <Input.Search
        placeholder="Search assets..."
        style={{ width: 200 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </Space>
  );

  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Asset Tag',
        dataIndex: 'assetTag',
        key: 'assetTag',
        sorter: (a, b) => a.assetTag.localeCompare(b.assetTag),
      },
      {
        title: 'Category',
        dataIndex: 'description',
        key: 'description',
        render: (text) => <Tag color="blue">{text}</Tag>,
      },
      {
        title: 'Manufacturer',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      },
      {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
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
        render: (text, record) => (
          <Space>
            <EnvironmentOutlined />
            {text}
            {record.room && <Tag color="blue">{record.room}</Tag>}
          </Space>
        ),
      },
      {
        title: 'Value',
        key: 'value',
        render: (_, record) => {
          const initialValue = parseFloat(record.initialValue) || 0;
          const age = moment().diff(moment(record.acquisitionDate), 'years');
          const depreciation = initialValue * (age * 0.1);
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
              onClick={() => onEdit?.(record)}
            />
            <Button 
              type="text" 
              icon={<SwapOutlined />} 
              onClick={() => onTransfer?.(record)}
            />
            <Button 
              type="text" 
              icon={<HistoryOutlined />} 
              onClick={() => onHistory?.(record)}
            />
          </Space>
        ),
      },
    ];

    const categoryFields = defaultAssetFields[selectedCategory.replace(' ', '_')] || [];
    const specificColumns = categoryFields
      .filter(field => !['manufacturer', 'model'].includes(field.key))
      .map(field => ({
        title: field.label,
        dataIndex: field.key,
        key: field.key,
        render: (text, record) => {
          if (field.type === 'date') {
            return text ? moment(text).format('YYYY-MM-DD') : '-';
          }
          return text || '-';
        },
      }));

    return [...baseColumns, ...specificColumns];
  };

  return (
    <>
      {renderFilters()}
      <Table
        columns={getColumns()}
        dataSource={filteredAssets}
        loading={loading}
        rowKey="id"
        scroll={{ x: true }}
      />
    </>
  );
};

export default AssetList;