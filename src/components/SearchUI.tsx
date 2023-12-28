import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Divider,
  Button,
  Form,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { ShipmentDataItem, ResultObject } from "../App";
import MonacoEditor from "@monaco-editor/react";
import "./SearchUI.css";
import { CloseOutlined } from "@ant-design/icons";
import { SearchPayload, makeSearchQuery } from "../adapter/searchUI";

interface DataType {
  key: string | number;
  name: string;
  phone?: string;
  addressLn1: string;
  city: string;
  country?: string | undefined;
  partyType: string;
  rlCd?: string | undefined;
  state: string;
  zip: string;
  trackingId: string;
  shipperUserId?: string | undefined;
}
type DataIndex =
  | "name"
  | "trackingId"
  | "phone"
  | "addressLn1"
  | "city"
  | "country"
  | "partyType"
  | "rlCd"
  | "state"
  | "zip"
  | "shipperUserId";

interface ResultViewProps {}

export const SearchUI: React.FC<ResultViewProps> = () => {
  const [form] = Form.useForm();
  const [originalData, setOriginalData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [table, setTable] = useState<"table" | "json">("table");
  const [loading, setLoading] = useState(false);
  const [addressmodal, setAddressModal] = useState(false);
  const [receiverOfItemArray, setReceiverOfItemArray] = useState<
    ResultObject[]
  >([]);

  const [filterOne, setFilterOne] = useState<{
    columnType: DataIndex | undefined;
    query: string | null;
  }>({ columnType: "name", query: null });

  const [filterTwo, setFilterTwo] = useState<{
    columnType: string;
    query: string | null;
  }>({ columnType: "name", query: null });

  const isShipperUserIdSelected =
    (filterOne && filterOne.columnType === "shipperUserId") ||
    filterOne.columnType !== "name";

  console.log({ filterOne, filterTwo });

  const columns: ColumnsType<DataType> = [
    {
      title: "No.",
      dataIndex: "key",
      key: "name",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      dataIndex: "trackingId",
      key: "trackingId",
      sorter: (a, b) => a.trackingId.length - b.trackingId.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) =>
        phone ? (
          phone
        ) : (
          <p style={{ color: "rgba(147, 146, 146, 0.438)" }}>Not Available</p>
        ),
    },
    {
      title: "Address",
      dataIndex: "addressLn1",
      key: "addressLn1",
      sorter: (a, b) => a.addressLn1.length - b.addressLn1.length,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      sorter: (a, b) => a.city.length - b.city.length,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: (a: DataType, b: DataType) => {
        const countryA = a.country || "";
        const countryB = b.country || "";

        return countryA.length - countryB.length;
      },
    },
    {
      title: "Party Type",
      dataIndex: "partyType",
      key: "partyType",
      sorter: (a, b) => a.partyType.length - b.partyType.length,
    },
    {
      title: "rlCd",
      dataIndex: "rlCd",
      key: "rlCd",
      sorter: (a: DataType, b: DataType) => {
        const rlcdA = a.rlCd || "";
        const rlcdB = b.rlCd || "";
        return rlcdA.length - rlcdB.length;
      },
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      sorter: (a, b) => a.state.length - b.state.length,
    },
    {
      title: "Pin Code",
      dataIndex: "zip",
      key: "zip",
      sorter: (a, b) => a.zip.length - b.zip.length,
    },
  ];

  const firstSearchOptions = [
    {
      value: "name",
      label: "Name",
    },
    {
      value: "shipperUserId",
      label: "Shipper User Id",
    },
  ];

  const secondSearchOptions = [
    {
      value: "phone",
      label: "Phone No",
    },
    {
      value: "email",
      label: "Email",
    },
    {
      value: "address",
      label: "Address",
    },
    {
      value: "accountNbr",
      label: "Account Nbr",
    },
  ];

  // ---- Start: To get initial filtered data (to table) ---------
  useEffect(() => {
    try {
      setOriginalData([]); // Reset originalData to an empty array
      let count = 0;
      if (receiverOfItemArray) {
        const fData: DataType[] = [];
        receiverOfItemArray.forEach((item) => {
          const trackingId = item.receiverOfItem.trackingId;
          item.receiverOfItem.shipmentData.forEach((sd: ShipmentDataItem) => {
            count++;
            fData.push({ ...sd, key: count, trackingId });
          });
        });
        setOriginalData(fData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [receiverOfItemArray]);

  // ---- End: To get initial filtered data (to table) ---------

  const runSearchQuery = async (payload: SearchPayload) => {
    const response = await makeSearchQuery(payload);
    if (response) {
      setReceiverOfItemArray(response);
    }
  };

  const onSearchClicked = () => {
    if (loading) {
      // If already loading, ignore the click
      return;
    }

    setLoading(true);
    try {
      let payload: SearchPayload | null = null;
      if (filterOne.query === null || filterTwo.query === null) {
        return;
      }

      // Construct search payload based on selected filters
      if (filterOne.columnType === "name" && filterTwo.columnType === "phone") {
        payload = {
          type: "NameAndPhone",
          name: filterOne.query,
          phone: filterTwo.query,
        };
      }
      if (filterOne.columnType === "name" && filterTwo.columnType === "email") {
        payload = {
          type: "NameAndEmail",
          name: filterOne.query,
          email: filterTwo.query,
        };
      }
      // Add more conditions as needed

      // Run the search query
      payload && runSearchQuery(payload);

      // Filter the data on the client side
      let newData = [...originalData];

      // Use filter one
      if (filterOne.query) {
        newData = newData.filter((item) => {
          const columnValue = item[filterOne.columnType as DataIndex];
          return (
            columnValue &&
            columnValue.toLowerCase().includes(filterOne.query!.toLowerCase())
          );
        });
      }

      // Use filter two
      if (filterTwo.query) {
        newData = newData.filter((item) => {
          const columnValue = item[filterTwo.columnType as DataIndex];
          return (
            columnValue &&
            columnValue.toLowerCase().includes(filterTwo.query!.toLowerCase())
          );
        });
      }

      setFilteredData(newData);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEmptyText = () => {
    if (filteredData && filteredData.length > 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              <a href="#API">No result found</a>
            </span>
          }
        />
      );
    } else {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No Data to present"
        >
          <span>Please search in the filter to show results here</span>
        </Empty>
      );
    }
  };

  const locale = { emptyText: getEmptyText() };

  const onFinish = (values: {
    [x: string]: string;
    city: string;
    state: string;
    zipcode: string;
  }) => {
    // Combine form values into a single string
    const combinedValue = `${values["address Line 1"]} ${values["address Line 2"]} ${values.city} ${values.state} ${values.zipcode}`;
    setFilterTwo((state) => {
      state.query = combinedValue;
      return { ...state };
    });
    setAddressModal(false);
  };

  let result;

  switch (table) {
    case "table":
      result = (
        <Table
          locale={locale}
          loading={loading}
          size="small"
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ y: 510 }}
        />
      );
      break;
    case "json":
      result = (
        <MonacoEditor
          height="55vh"
          language="json"
          theme="vs-dark"
          value={JSON.stringify(filteredData, null, 3)}
          options={{
            selectOnLineNumbers: true,
            lineHeight: 22,
          }}
        />
      );
      break;
    default:
      break;
  }
  // const hasShipperUserId = searchOne.includes("shipperUserId");

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const isButtonEnabled = useMemo(() => {
    if (filterOne.columnType === "shipperUserId") {
      return filterOne.query !== null && filterOne.query.length > 0;
    } else if (filterOne.columnType === "name") {
      return (
        filterOne.query !== null &&
        filterOne.columnType &&
        filterOne.query.length > 0 &&
        filterTwo.query !== null &&
        filterTwo.query.length > 0
      );
    }
    return false;
  }, [filterOne.columnType, filterOne.query, filterTwo.query]);

  const isSelectedAddress = filterTwo.columnType === "address";
  console.log("selected", isSelectedAddress);
  useEffect(() => {
    if (isSelectedAddress && filterOne.columnType === "name") {
      setAddressModal(true);
    } else {
      setAddressModal(false);
    }
  }, []);
  return (
    <div>
      <div className="inputs-container">
        <div className="select-search-inputs">
          <div className="each-field">
            <Space.Compact>
              <Select
                style={{
                  borderRadius: "0 !important",
                  width: "185px",
                  height: "32px",
                }}
                defaultValue="Select"
                options={firstSearchOptions}
                onChange={(val) => {
                  setFilterOne({
                    ...filterOne,
                    columnType: val as DataIndex,
                  });
                  console.log(
                    "selectedksdjksjdkdjdfkjskfjs",
                    filterOne.columnType
                  );
                }}
              />
              <Input
                size="small"
                defaultValue=""
                style={{ width: "42rem", height: "32px" }}
                onChange={(e) => {
                  setFilterOne((state) => {
                    state.query = e.target.value;
                    return { ...state };
                  });
                }}
              />
            </Space.Compact>
          </div>
          <div className="each-field">
            <Space.Compact>
              <Select
                size="small"
                disabled={isShipperUserIdSelected}
                defaultValue="Select"
                options={secondSearchOptions}
                style={{ borderRadius: 0, width: "185px", height: "32px" }}
                onChange={(val) => {
                  setFilterTwo((state) => {
                    state.columnType = val;
                    return { ...state };
                  });
                }}
              />
              <Input
                disabled={isShipperUserIdSelected}
                defaultValue=""
                value={filterTwo.query || ""}
                style={{ width: "42rem", height: "32px" }}
                onChange={(e) => {
                  setFilterTwo((state) => {
                    state.query = e.target.value;
                    return { ...state };
                  });
                }}
              />
            </Space.Compact>
            {addressmodal ? (
              <div className="form-container-wrapper">
                <div className="close-btn" style={{ textAlign: "right" }}>
                  <CloseOutlined />
                </div>
                <div className="form-container-wrapper">
                  {/* ... (unchanged code) */}
                  <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{ gap: "8px" }} // Increased maxWidth for better readability
                  >
                    {/* First Row: Address Line 1 and Address Line 2 */}
                    <div className="form-row-1">
                      <Form.Item
                        name="address Line 1"
                        // label="Address Line 1"
                        rules={[{ required: true }]}
                        className="form-item-half"
                      >
                        <Input placeholder="Address Line 1" />
                      </Form.Item>
                      <Form.Item
                        name="address Line 2"
                        // label="Line 2"
                        rules={[{ required: true }]}
                        className="form-item-half"
                      >
                        <Input placeholder="Line 2" />
                      </Form.Item>
                    </div>

                    {/* Second Row: City, State, and Zip Code */}
                    <div className="form-row">
                      <Form.Item
                        name="city"
                        // label="City"
                        rules={[{ required: true }]}
                        className="form-item-third"
                      >
                        <Input placeholder="City" />
                      </Form.Item>
                      <Form.Item
                        name="state"
                        // label="State"
                        rules={[{ required: true }]}
                        className="form-item-third"
                      >
                        <Input placeholder="State" />
                      </Form.Item>
                      <Form.Item
                        name="zipcode"
                        // label="Zip code"
                        rules={[{ required: true }]}
                        className="form-item-third"
                      >
                        <Input placeholder="Zip code" />
                      </Form.Item>
                    </div>

                    {/* Form Buttons */}
                    <div className="form-btns-container">
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                      <Button>Cancel</Button>
                    </div>
                  </Form>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div>
          <Divider
            orientation="right"
            type="vertical"
            style={{ height: "110px", margin: "0 3rem" }}
          />

          <Button
            style={{
              marginTop: "35px",
              width: "89px",
              height: "40px",
            }}
            type="primary"
            disabled={!isButtonEnabled}
            onClick={onSearchClicked}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="result-container">
        <div className="text-btn-container">
          <div className="text-container">
            <h4>Customer Match </h4>
            <div></div>
            <p>Total Records found {filteredData.length}</p>
          </div>
          <div className="btns-container">
            <div className="toggle-container">
              <Button
                className={table === "table" ? `active` : ``}
                onClick={() => setTable("table")}
              >
                Table View
              </Button>
              <Button
                disabled={filteredData.length === 0}
                className={
                  table === "json" && filteredData.length > 0 ? `active` : ``
                }
                onClick={() => setTable("json")}
              >
                JSON View
              </Button>
            </div>
            {/* <Button
              className="clear-btn"
              onClick={() => setFilteredData(originalData)}
            >
              Clear All
            </Button> */}
          </div>
        </div>
        {result}
      </div>
    </div>
  );
};
