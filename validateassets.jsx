import Barcode from "react-barcode";
import { useState, useEffect } from "react";
import {
  Typography,
  Tag,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Modal,
  message,
  Spin,
  Row,
  Col,
  Badge,
  Table,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  CalendarOutlined,
  LeftOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  getSavedpaymentrequest,
  updatepaymentrequest,
  createFurnitureassets,
  createITassets,
  createRealEstateassets,
  createToolassets,
  createVehicleassets,
  getITassets,
  getFurnitureassets,
  getRealEstateassets,
  getToolassets,
  getVehicleassets,
} from "../../apipurchase";


// Generate asset tags
const getNextAssetTags = (lastAssetTag, itemCode, quantity) => {
  const currentYear = new Date().getFullYear().toString().substr(2, 2);
  const prefix = `${currentYear}${itemCode}`;
  let lastSeq = 0;
  if (lastAssetTag && lastAssetTag.startsWith(prefix)) {
    lastSeq = parseInt(lastAssetTag.slice(prefix.length), 10) || 0;
  }
  return Array.from({ length: quantity }, (_, i) => {
    const nextSeq = String(lastSeq + i + 1).padStart(3, "0");
    return `${prefix}${nextSeq}`;
  });
};

const { Option } = Select;

import "react-datepicker/dist/react-datepicker.css";


const formatTND = (value) =>
  new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
  }).format(Number(value || 0));
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
  const getAssetTypeKey = (subject) => {
    if (subject === "IT MATERIALS") return "IT";
    if (subject === "FURNITURE") return "FURNITURE";
    if (subject === "VEHICLES") return "VEHICLES";
    if (subject === "REAL ESTATE") return "REAL_ESTATE";
    if (subject === "TOOLS") return "TOOLS";
    return "IT";
  };
  

const ItemValidationPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  //const [form] = Form.useForm();

  const [paymentRequest, setPaymentRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const [currentItem, setCurrentItem] = useState(null);
  //const [reqtype, setReqtype] = useState("");

  const [activeModal, setActiveModal] = useState(null);

  const username = localStorage.getItem("name");

  const [assetdata, setAssetData] = useState(null);
    // Dynamic asset forms state
    const [assetForms, setAssetForms] = useState([]);

    const [printModalVisible, setPrintModalVisible] = useState(false);
    const [barcodeToPrint, setBarcodeToPrint] = useState([]);

  // Print handler for all asset tags
  const handlePrintBarcode = (tags) => {
    setBarcodeToPrint(tags);
    setPrintModalVisible(true);
  };
 // Print function
 const printBarcode = () => {
  const printContents = document.getElementById("barcode-print-area").innerHTML;
  const win = window.open("", "", "width=400,height=600");
  win.document.write(`
    <html>
      <head>
        <title>Print Asset Tag</title>
      </head>
      <body>${printContents}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
  win.close();
};


    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const request = await getSavedpaymentrequest(requestId);
          setPaymentRequest(request);
  
          const reqItems = request.listRequestPaymentsInternalPurchase || [];
          setItems(
            reqItems.map((item) => ({
              ...item,
              key: item.id || `item-${Math.random().toString(36).substr(2, 9)}`,
              paid: item?.paid || false,
              receivingDate: item?.desiredDate,
              paymentValidatedBy: item?.monthof || username,
            }))
          );
        } catch (error) {
          message.error("Failed to load payment request data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [requestId, username]);

    useEffect(() => {
      const fetchassetData = async () => {
        if (!paymentRequest) return;
        switch (paymentRequest.subject) {
          case "FURNITURE": {
            const furnitureAssets = await getFurnitureassets();
            setAssetData(furnitureAssets);
            break;
          }
          case "IT MATERIALS": {
            const itAssets = await getITassets();
            setAssetData(itAssets);
            break;
          }
          case "VEHICLES": {
            const vehicleAssets = await getVehicleassets();
            setAssetData(vehicleAssets);
            break;
          }
          case "REAL ESTATE": {
            const realEstateAssets = await getRealEstateassets();
            setAssetData(realEstateAssets);
            break;
          }
          case "TOOLS": {
            const toolAssets = await getToolassets();
            setAssetData(toolAssets);
            break;
          }
          default: {
            setAssetData(null);
            break;
          }
        }
      };
    fetchassetData();
  }, [paymentRequest]);


  const totalItems = items.length;
  const validatedItems = items.filter((item) => item.paid === true).length;
  const totalAmount = items.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );
  const validatedAmount = items
    .filter((item) => item.paid === true)
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);



  // Function to handle modal visibility dynamically

  // Modal open handler for any asset type
  const handleModal = (type, item = null) => {
    setCurrentItem(item);
    setActiveModal(type);

    if (item) {
      // Prepare asset tags
      const assets = assetdata || [];
      const itemCode = item.item;
      const currentYear = new Date().getFullYear().toString().substr(2, 2);
      const lastAsset = assets
        .filter(
          (a) => a.assetTag && a.assetTag.startsWith(`${currentYear}${itemCode}`)
        )
        .sort((a, b) => b.assetTag.localeCompare(a.assetTag))[0];
      const lastAssetTag = lastAsset ? lastAsset.assetTag : null;
      const nextAssetTags = getNextAssetTags(
        lastAssetTag,
        itemCode,
        item.quantity || 1
      );

      // Get asset type fields
      const assetTypeKey = getAssetTypeKey(paymentRequest.subject);
      const fields = defaultAssetFields[assetTypeKey];

      setAssetForms(
        Array.from({ length: item.quantity || 1 }, (_, i) => {
          const obj = { assetTag: nextAssetTags[i] };
          fields.forEach(f => {
            obj[f.key] = f.type === "date" ? null : "";
          });
          return obj;
        })
      );
    }
  };
  // Function to close the modal
  const closeModal = () => {
    setActiveModal(null);
    setAssetForms([]);
  };
   // Dynamic asset form change handler
   const handleAssetFormChange = (idx, field, value) => {
    setAssetForms((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  // Function to handle validation submission

  
  // Validation submit for all asset types
  const handleValidationSubmit = async () => {
    try {
      // Validate all asset forms
      const assetTypeKey = getAssetTypeKey(paymentRequest.subject);
      const fields = defaultAssetFields[assetTypeKey];
      for (let i = 0; i < assetForms.length; i++) {
        const asset = assetForms[i];
        for (const f of fields) {
          if (
            (f.type === "date" && !asset[f.key]) ||
            (f.type !== "date" && !asset[f.key])
          ) {
            message.error(`Please fill "${f.label}" for asset #${i + 1}`);
            return;
          }
        }
      }

      // Update payment request
      const updatedItems = items.map((item) =>
        item.id === currentItem.id
          ? {
              ...item,
              paid: true,
              desiredDate: moment().format("YYYY-MM-DD"),
              monthof: username,
            }
          : item
      );
      await updatepaymentrequest(requestId, {
        ...paymentRequest,
        idPaid: true,
        listRequestPaymentsInternalPurchase: updatedItems,
      });

      // Shared fields
      const sharedFields = {
        acquisitionDate: moment().format("YYYY-MM-DD"),
        purchaseDocumentLink: paymentRequest.link,
        supplierName: paymentRequest?.nameSubcontract,
        supplierRef: paymentRequest?.idSubcontract,
        initialValue: currentItem.unitprice,
        createdAt: moment().toISOString(),
        createdBy: username,
        status: "In Stock",
        condition: "New",
        category: paymentRequest.subject,
        name: paymentRequest.companyName,
        building: paymentRequest.requestRef
      };

      // Asset type specific API and shared fields
      let apiFn, extraFields = {};
      switch (assetTypeKey) {
        case "IT":
          apiFn = createITassets;
          extraFields = { expectedLifetimeMonths: 24, depreciationRate: 0.25 };
          break;
        case "FURNITURE":
          apiFn = createFurnitureassets;
          extraFields = { expectedLifetimeMonths: 120, depreciationRate: 0.1 };
          break;
        case "VEHICLES":
          apiFn = createVehicleassets;
          extraFields = { expectedLifetimeMonths: 120, depreciationRate: 0.15 };
          break;
        case "REAL_ESTATE":
          apiFn = createRealEstateassets;
          extraFields = { expectedLifetimeMonths: 240, depreciationRate: 0.05 };
          break;
        case "TOOLS":
          apiFn = createToolassets;
          extraFields = { expectedLifetimeMonths: 240, depreciationRate: 0.05 };
          break;
        default:
          apiFn = createITassets;
          extraFields = { expectedLifetimeMonths: 24, depreciationRate: 0.25 };
      }

      // Create each asset
      let successCount = 0;
      for (let i = 0; i < assetForms.length; i++) {
        const asset = assetForms[i];
        const payload = {
          ...sharedFields,
          ...extraFields,
          assetTag: asset.assetTag,
        };
        fields.forEach(f => {
          payload[f.key] =
            f.type === "date" && asset[f.key]
              ? asset[f.key].format("YYYY-MM-DD")
              : asset[f.key];
        });
        await apiFn(payload);
        successCount++;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                paid: true,
                desiredDate: moment().format("YYYY-MM-DD"),
                monthof: username,
              }
            : item
        )
      );

      message.success(`Successfully created ${successCount} asset records`);
      closeModal();
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error("Error validating item and creating assets:", error);
      message.error("Failed to validate item and create assets");
    }
  };

  // Switch case for handling modals dynamically



  const columns = [
    {
      title: "Item Code",
      dataIndex: "item",
      key: "item",
      width: "10%",
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "25%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: "10%",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "12%",
      render: (text) => formatTND(text),
    },
    {
      title: "Recieved Date",
      dataIndex: "desiredDate",
      key: "desiredDate",
      width: "12%",
      render: (text) => text || "Not specified",
    },
    {
      title: "Validation Status",
      dataIndex: "paid",
      key: "paid",
      width: "15%",
      render: (paid) => {
        const isPaid = String(paid) === "true";
        console.log("Paid", paid);
        const color = isPaid ? "green" : "default";
        const text = isPaid ? "Validated" : "Pending";

        return (
          <div>
            <Tag color={color}>{text}</Tag>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_, record) => {
        // Find all asset tags for this item
        const assets = assetdata || [];
        const currentYear = new Date().getFullYear().toString().substr(2, 2);
        const prefix = `${currentYear}${record.item}`;
        const matchingTags = assets
        .filter(a =>
          a.assetTag && a.assetTag.startsWith(prefix) &&
          a.building === paymentRequest.requestRef
        )
        .map(a => a.assetTag);

        if (record.paid) {
          return (
            <Button
              type="default"
              icon={<PrinterOutlined />}
              onClick={() => handlePrintBarcode(matchingTags)}
            >
              Print Asset Tag{matchingTags.length > 1 ? "s" : ""}
            </Button>
          );
        }
        return (
          <Button
            type="primary"
            onClick={() => handleModal(getAssetTypeKey(paymentRequest.subject), record)}
            icon={<CheckCircleOutlined />}
          >
            Validate
          </Button>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="app-page-container">
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <Spin tip="Loading..." size="large" />
        </div>
      </div>
    );
  }
 
 // Render dynamic asset modal
 const renderAssetModal = () => {
  if (!activeModal || !currentItem) return null;
  const assetTypeKey = getAssetTypeKey(paymentRequest.subject);
  const fields = defaultAssetFields[assetTypeKey];
  return (
    <Modal
      title={`Validate ${paymentRequest.subject}: ${currentItem?.description}`}
      open={!!activeModal}
      onOk={handleValidationSubmit}
      onCancel={closeModal}
      width={700}
      okText="Submit Validation"
    >
      {assetForms.map((asset, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #eee",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6,
            background: "#fafafa",
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 8 }}>
            Asset #{idx + 1} — Barcode: <span style={{ color: "#1890ff" }}>{asset.assetTag}</span>
          </div>
          <Form layout="vertical">
            {fields.map(f => (
              <Form.Item label={f.label} required key={f.key}>
                {f.type === "input" && (
                  <Input
                    value={asset[f.key]}
                    onChange={e => handleAssetFormChange(idx, f.key, e.target.value)}
                    placeholder={`Enter ${f.label.toLowerCase()}`}
                  />
                )}
                {f.type === "textarea" && (
                  <Input.TextArea
                    value={asset[f.key]}
                    onChange={e => handleAssetFormChange(idx, f.key, e.target.value)}
                    placeholder={`Enter ${f.label.toLowerCase()}`}
                  />
                )}
                {f.type === "date" && (
                  <DatePicker
                    value={asset[f.key]}
                    onChange={date => handleAssetFormChange(idx, f.key, date)}
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    placeholder={`Select ${f.label.toLowerCase()}`}
                  />
                )}
                {f.type === "select" && (
                  <Select
                    value={asset[f.key]}
                    onChange={value => handleAssetFormChange(idx, f.key, value)}
                    placeholder={`Select ${f.label.toLowerCase()}`}
                    style={{ width: "100%" }}
                  >
                    {f.options.map(opt => (
                      <Option key={opt} value={opt}>{opt}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            ))}
          </Form>
        </div>
      ))}
    </Modal>
  );
};

  return (
    <div className="app-page-container">
      <div className="app-container">
        <div className="app-header">
          <div className="app-header-title">
            <h2>Items Validation</h2>
          </div>
          <Button
            type="default"
            onClick={() => navigate("/AssetManagement/ItemValidationPage?tab=notreceived")}
            icon={<LeftOutlined />}
          >
            Back to List
          </Button>
        </div>

        <div className="app-content">
          <div className="app-card mb-16">
            <div className="app-card-body">
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <div className="detail-section">
                    <div className="section-title">
                      <FileTextOutlined /> Request Details
                    </div>
                    <div className="info-row">
                      <div className="info-label">Request Reference:</div>
                      <div className="info-value">
                        {paymentRequest?.requestRef}
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Subject:</div>
                      <div className="info-value">{paymentRequest?.subject}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Company:</div>
                      <div className="info-value">
                        {paymentRequest?.companyName}
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Cost Center:</div>
                      <div className="info-value">
                        {paymentRequest?.cosCenter}
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Supplier:</div>
                      <div className="info-value">
                        {paymentRequest?.nameSubcontract || "Not specified"}
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Preferred Payment:</div>
                      <div className="info-value">
                        {paymentRequest?.paymentType || "Not specified"}
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} md={16}>
                  <Row gutter={24}>
                    <Col xs={24} md={8}>
                      <div className="stats-card">
                        <div className="stats-card-title">
                          <DollarOutlined /> Total Amount
                        </div>
                        <div className="stats-card-value primary">
                          {formatTND(totalAmount)}
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <div
                        className="stats-card"
                        style={{
                          backgroundColor:
                            validatedAmount > 0
                              ? "rgba(82, 196, 26, 0.1)"
                              : "transparent",
                        }}
                      >
                        <div className="stats-card-title">
                          <CheckCircleOutlined /> Validated Amount
                        </div>
                        <div className="stats-card-value success">
                          {formatTND(validatedAmount)}
                          <span className="stats-card-suffix">
                            (
                            {(
                              (validatedAmount / totalAmount) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <div className="stats-card">
                        <div className="stats-card-title">
                          <CalendarOutlined /> Items Status
                        </div>
                        <div className="stats-card-value secondary">
                          {validatedItems}
                          <span className="stats-card-suffix">
                            of {totalItems} (
                            {((validatedItems / totalItems) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="stats-card-badges">
                          <Badge
                            status="success"
                            text="Validated"
                            style={{ marginRight: 8 }}
                          />
                          <Badge status="default" text="Pending" />
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <div className="stats-card">
                        <div className="stats-card-title">
                          <FileTextOutlined /> Quantity Validation
                        </div>
                        <div className="stats-card-value secondary">
                          {items
                            .filter((item) => item.paid === true)
                            .reduce(
                              (sum, item) => sum + (item.quantity || 0),
                              0
                            )}
                          <span className="stats-card-suffix">
                            of{" "}
                            {items.reduce(
                              (sum, item) => sum + (item.quantity || 0),
                              0
                            )}{" "}
                            (
                            {(
                              (items
                                .filter((item) => item.paid === true)
                                .reduce(
                                  (sum, item) => sum + (item.quantity || 0),
                                  0
                                ) /
                                items.reduce(
                                  (sum, item) => sum + (item.quantity || 0),
                                  0
                                )) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </div>
                        <div className="stats-card-badges">
                          <Badge
                            status="success"
                            text="Validated"
                            style={{ marginRight: 8 }}
                          />
                          <Badge status="default" text="Pending" />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>

          <div className="app-card">
            <div className="app-card-header">
              <h3>Items to Validate</h3>
            </div>
            <div className="app-card-body">
              <Table
                columns={columns}
                dataSource={items}
                rowKey="key"
                pagination={false}
                bordered
              />
            </div>
          </div>
          {renderAssetModal()}
                {/* Print Barcode Modal */}
      <Modal
        open={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        footer={[
          <Button key="print" type="primary" onClick={printBarcode}>
            Print
          </Button>,
          <Button key="close" onClick={() => setPrintModalVisible(false)}>
            Close
          </Button>,
        ]}
        title="Print Asset Tag(s)"
        width={400}
      >
                <div id="barcode-print-area" style={{ textAlign: "center", padding: 24 }}>
                {(Array.isArray(barcodeToPrint) ? barcodeToPrint : [barcodeToPrint]).map(tag => (
          <div key={tag} style={{ marginBottom: 24 }}>
                  <Barcode
                value={tag}
                width={2}           // width of a single bar (adjust for density)
                height={80}         // barcode height in px (try 80-100 for 30mm)
                fontSize={14}       // font size for the tag text
                margin={0}          // remove extra margin
                displayValue={true} // show the value below the barcode
              />
   
  </div>
))}
        </div>
      </Modal>
        </div>
      </div>
      

      <style>{`
       
        .app-page-container {
          padding: 20px;
          background-color: #f0f2f5;
        }
        
        .app-container {
          width: 100%;
        }
        
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .app-content {
          width: 100%;
        }
        
        .app-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }
        
        .app-card.mb-16 {
          margin-bottom: 16px;
        }
        
        .app-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .app-card-body {
          padding: 24px;
        }
        
        .detail-section {
          padding: 16px;
          border-radius: 6px;
          background-color: #fafafa;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
        }
        
        .section-title svg {
          margin-right: 8px;
        }
        
        .info-row {
          margin-bottom: 12px;
        }
        
        .info-label {
          color: #666;
          font-size: 12px;
          margin-bottom: 4px;
        }
        
        .info-value {
          font-size: 14px;
        }
        
        .stats-card {
          border-radius: 6px;
          padding: 16px;
          background-color: #fafafa;
          height: 100%;
        }
        
        .stats-card-title {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        .stats-card-title svg {
          margin-right: 8px;
        }
        
        .stats-card-value {
          font-size: 24px;
          font-weight: 600;
        }
        
        .stats-card-value.primary {
          color: #1890ff;
        }
        
        .stats-card-value.success {
          color: #52c41a;
        }
        
        .stats-card-value.secondary {
          color: #722ed1;
        }
        
        .stats-card-suffix {
          font-size: 14px;
          font-weight: normal;
          margin-left: 4px;
        }
        
        .stats-card-badges {
          margin-top: 8px;
        }
        
        .modal-title {
          font-size: 16px;
          font-weight: 500;
        }

        @media print {
          #barcode-print-area {
            width: 50mm;
            height: 30mm;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            page-break-after: always;
          }
          #barcode-print-area > div {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemValidationPage;