import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Input, Select, Space, Divider, Button, Form } from "antd";
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
  | "zip";

interface ResultViewProps {}

export const SearchUI: React.FC<ResultViewProps> = () => {
  const [form] = Form.useForm();
  const [originalData, setOriginalData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [table, setTable] = useState<"table" | "json">("table");
  const [loading, setLoading] = useState(false);
  // const [submittedAddressValue, setSubmitteAddressdValue] = useState("");
  // const [searchOne, setSearchOne] = useState<string[]>([]);
  // const [searchQuery, setSearchQuery] = useState<string>("");

  const [filterOne, setFilterOne] = useState<{
    columnType: DataIndex | undefined;
    query: string | null;
  }>({ columnType: "name", query: null });

  const [filterTwo, setFilterTwo] = useState<{
    columnType: string;
    query: string | null;
  }>({ columnType: "name", query: null });

  console.log({ filterOne, filterTwo });

  const columns: ColumnsType<DataType> = [
    {
      title: "No.",
      dataIndex: "key",
      key: "name",
      // sorter: (a: DataType, b: DataType) => {
      //   const keyA = typeof a.key === 'string' ? a.key : '';
      //   const keyB = typeof b.key === 'string' ? b.key : '';
      //   return keyA.length - keyB.length;
      // }
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

  const onSearchClicked = () => {
    let payload: SearchPayload | null = null;
    if (filterOne.query === null || filterTwo.query === null) {
      return;
    }
    setLoading(true);

    // NameAndPhone payload type
    if (filterOne.columnType === "name" && filterTwo.columnType === "phone") {
      console.log("Payload shoul be of type NameAndPhone");
      payload = {
        type: "NameAndPhone",
        name: filterOne.query,
        phone: filterTwo.query,
      };
    }

    // NameAndEmail payload type
    if (filterOne.columnType === "name" && filterTwo.columnType === "email") {
      console.log("Payload shoul be of type NameAndPhone");
      payload = {
        type: "NameAndEmail",
        name: filterOne.query,
        email: filterTwo.query,
      };
    }

    // NameAndAddress payload type
    if (filterOne.columnType === "name" && filterTwo.columnType === "address") {
      console.log("Payload shoul be of type NameAndPhone");
      payload = {
        type: "NameAndAddress",
        name: filterOne.query,
        addressLn1: filterTwo.query,
      };
    }

    payload && runSearchQuery(payload);

    // Filter the data in frontend later it can be removed
    let newData: DataType[] = [...originalData];

    // Use filter one
    if (filterOne.query) {
      newData = newData.filter((item: DataType) => {
        const columnValue = item[filterOne.columnType as DataIndex];

        return (
          columnValue &&
          columnValue.toLowerCase().includes(filterOne.query!.toLowerCase())
        );
      });
    }

    // Use filter two
    if (filterTwo.query) {
      newData = newData.filter((item: DataType) => {
        const columnValue = item[filterTwo.columnType as DataIndex];
        return (
          columnValue &&
          columnValue.toLowerCase().includes(filterTwo.query!.toLowerCase())
        );
      });
    }
    console.log(newData);
    setFilteredData(newData);
    setTimeout(() => setLoading(false), 2000);
  };

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
  };

  const runSearchQuery = async (payload: SearchPayload) => {
    const response = await makeSearchQuery(payload);
    if (response) {
      setReceiverOfItemArray(response);
    }
  };

  const [receiverOfItemArray, setReceiverOfItemArray] = useState<
    ResultObject[]
  >([]);

  // ---- Start: To get initial filtered data (to table) ---------
  useEffect(() => {
    try {
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
        // setFilteredData(fData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [receiverOfItemArray]);
  // ---- End: To get initial filtered data (to table) ---------

  let result;

  switch (table) {
    case "table":
      result = (
        <Table
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
          value={JSON.stringify(filteredData[0], null, 3)}
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
    return (
      filterOne.query !== null &&
      filterOne.query.length > 0 &&
      filterTwo.query !== null &&
      filterTwo.query.length > 0
    );
  }, [filterOne, filterTwo]);

  const isSelectedAddress = filterTwo.columnType === "address";
  console.log("selected", isSelectedAddress);
  return (
    <div>
      <div className="inputs-container">
        <div className="select-search-inputs">
          <div className="each-field">
            <Space.Compact>
              <Select
                style={{
                  borderRadius: "0 !important",
                  width: "209px",
                  height: "40px",
                }}
                defaultValue="Select"
                options={firstSearchOptions}
                onChange={(val) => {
                  setFilterOne({
                    ...filterOne,
                    columnType: val as DataIndex,
                  });
                }}
              />
              <Input
                size="small"
                defaultValue=""
                style={{ width: "38rem", height: "40px" }}
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
                disabled={false}
                defaultValue="Select"
                options={secondSearchOptions}
                style={{ borderRadius: 0, width: "209px", height: "40px" }}
                onChange={(val) => {
                  setFilterTwo((state) => {
                    state.columnType = val;
                    return { ...state };
                  });
                }}
              />
              <Input
                disabled={false}
                defaultValue=""
                value={filterTwo.query || ""}
                style={{ width: "38rem", height: "40px" }}
                onChange={(e) => {
                  setFilterTwo((state) => {
                    state.query = e.target.value;
                    return { ...state };
                  });
                }}
              />
            </Space.Compact>
            {isSelectedAddress ? (
              <div className="form-container-wrapper">
                <div className="close-btn" style={{ textAlign: "right" }}>
                  <CloseOutlined />
                </div>
                <div className="form-container">
                  <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{ maxWidth: 640, gap: "8px" }}
                  >
                    <Form.Item
                      name="address Line 1"
                      label="Address Line 1"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="address Line 2"
                      label="Address Line 2"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <div className="address-line-state">
                        <Form.Item
                          name="city"
                          label="City"
                          rules={[{ required: true }]}
                          style={{ marginLeft: "4px" }}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="state"
                          label="State"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="zipcode"
                          label="Zip code"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                    </Form.Item>
                    <div className="form-btns-container">
                      <Button
                        style={{
                          marginRight: "16px",
                          marginLeft: "12rem",
                          width: "82px",
                          height: "32px",
                        }}
                        type="primary"
                        htmlType="submit"
                      >
                        Submit
                      </Button>
                      <Button style={{ width: "82px", height: "32px" }}>
                        Cancel
                      </Button>
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
            style={{ height: "110px", margin: "0 6rem" }}
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
            <Button
              className="clear-btn"
              onClick={() => setFilteredData(originalData)}
            >
              Clear All
            </Button>
          </div>
        </div>
        {result}
      </div>
    </div>
  );
};
