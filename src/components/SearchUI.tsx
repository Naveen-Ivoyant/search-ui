import React, { useEffect, useMemo, useState } from "react";
import { Table, Input, Select, Space, Divider, Button, Form } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ShipmentDataItem, ResultObject } from "../App";
import MonacoEditor from "react-monaco-editor";
import "./SearchUI.css";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";

// const { Search } = Input;

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

interface ResultViewProps {
  receiverOfItemArray: ResultObject[];
}

export const SearchUI: React.FC<ResultViewProps> = ({
  receiverOfItemArray,
}) => {
  const [originalData, setOriginalData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [table, setTable] = useState<"table" | "json">("table");
  // const [searchOne, setSearchOne] = useState<string[]>([]);
  // const [searchQuery, setSearchQuery] = useState<string>("");

  const [name, setName] = useState('');
  const [phone, setPhoneumber = useState('');

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
      value: "accountNo",
      label: "Account No",
    },
  ];

  const onSearchClicked = () => {
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

    setFilteredData(newData);
    const baseURL = "http://localhost:3007/searchData";
    const getUsers = async () => {
      const params = {
        name: "",
        phone: "",
      };
      try {
        const response = await axios.get(baseURL, { params });
        const users = response.data;
        console.log("===============>", users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  };

  // const namesArray = originalData.map((data, i) => {
  //   return {
  //     key: data.name + i,
  //     value: data.name,
  //     label: data.name
  //   }
  // })

  // const shipperUserIdArrays = originalData.map((data, i) => {
  //   return {
  //     key: data.trackingId + i,
  //     value: data.trackingId,
  //     label: data.trackingId
  //   }
  // })

  // const addressArray = originalData.map((data, i) => {
  //   return {
  //     key: data.addressLn1 + i,
  //     value: data.addressLn1,
  //     label: data.addressLn1
  //   }
  // })

  // let firstOptions = firstSearchOptions;

  // searchOne.map(option => {
  //   switch (option) {
  //   case 'name':
  //     firstOptions = namesArray;
  //     break;
  //   case 'shipperUserId':
  //     firstOptions = shipperUserIdArrays;
  //     break;
  //   case 'addressLn1':
  //     firstOptions = addressArray;
  //     break;
  //   default:
  //     firstOptions = firstSearchOptions;
  //     break;
  // }
  // })

  // const onChangeOne = (value: string[]) => {
  //   setSearchOne(value);

  //   if (searchOne) {
  //     let searchedResultsOne = [];
  //     searchedResultsOne = originalData.filter((item) => {
  //       return searchOne.some((value) => Object.values(item).includes(value));
  //     });
  //     setFilteredData(searchedResultsOne);
  //   }
  // };

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
        setFilteredData(fData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [receiverOfItemArray]);
  // ---- End: To get initial filtered data (to table) ---------

  // const handleSearch = () => {
  //   const searchedResultsTwo = filteredData.filter((item) => {
  //     return Object.values(item).some((value) => {
  //       const includesSearchQuery = value
  //         ? value.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //         : false;
  //       return includesSearchQuery;
  //     });
  //   });
  //   setFilteredData(searchedResultsTwo);
  // };

  let result;

  switch (table) {
    case "table":
      result = (
        <Table
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
          height="650"
          language="json"
          theme="vs-dark"
          value={JSON.stringify(filteredData, null, 2)}
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

  const [form] = Form.useForm();

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

  useEffect(() => {
    const baseURL = "http://localhost:3007/searchData";
    const getUsers = async () => {
      const params = {
        name: "",
        phone: "",
      };
      try {
        const response = await axios.get(baseURL, { params });
        const users = response.data;
        console.log("===============>", users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
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
                defaultValue=""
                style={{ width: "357px", height: "40px" }}
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
                style={{ width: "357px", height: "40px" }}
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
                    // onFinish={onFinish}
                    style={{ maxWidth: 532, gap: "8px" }}
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
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[{ required: true }]}
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
                    <div className="form-btns-container">
                      <Button
                        style={{
                          marginRight: "16px",
                          width: "82px",
                          height: "32px",
                        }}
                        type="primary"
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

        <Divider
          orientation="right"
          type="vertical"
          style={{ height: "110px" }}
        />

        <Button
          style={{ marginTop: "35px", width: "89px", height: "40px" }}
          type="primary"
          disabled={!isButtonEnabled}
          onClick={onSearchClicked}
        >
          Search
        </Button>

        {/* <Select
            className='select-box'
            showSearch
            mode='tags'
            placeholder="Search by:"
            optionFilterProp="children"
            onChange={onChangeOne}
            options={firstOptions}
        />

          <Search
            disabled= {hasShipperUserId}
            className='search-input'
            placeholder="Search Address by street name, city, pincode"
            onSearch={handleSearch}
            style={{ height: '9px' }}
            onChange={(e) => setSearchQuery(e.target.value)}
        />   */}
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
              <div
                className={table === "table" ? `active` : ``}
                onClick={() => setTable("table")}
              >
                Table View
              </div>
              <div
                className={table === "json" ? `active` : ``}
                onClick={() => setTable("json")}
              >
                JSON View
              </div>
            </div>
            <div
              className="clear-btn"
              onClick={() => setFilteredData(originalData)}
            >
              Clear All
            </div>
          </div>
        </div>
        {result}
      </div>
    </div>
  );
};

{
  /* <form action="">
      <div>
        <label>Address Line 1:</label>
        <input placeholder='Enter address' required />
      </div>
      <div>
        <label>Address Line 2:</label>
        <input placeholder='Enter address' required  />
      </div>
      <div>
        <label>City:</label>
        <input placeholder='Enter city' required  />
      </div>
      <div>
        <label>State:</label>
        <input placeholder='Enter state' required  />
      </div>
      <div>
        <label></label>
        <input placeholder='Eg:577005' required  />
      </div>
      <div>
        <button type="submit">Submit</button>
        <button>Cancel</button>
      </div>
    </form> */
}
