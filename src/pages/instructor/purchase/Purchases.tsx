import { Button, Table } from "antd";
import purchasesData from "../../../data/purchases.json";
import Search from "antd/es/input/Search";
import { useState } from "react";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { Checkbox } from "antd";

function Purchases() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredData = purchasesData.filter((purchase) =>
    purchase.purchase_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Select",
      dataIndex: "select",
      render: () => <Checkbox />,
    },

    {
      title: "Purchase No",
      dataIndex: "purchase_no",
      key: "purchase_no",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Price Paid",
      dataIndex: "price_paid",
      key: "price_paid",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (money: number) => moneyFormat(money),
    },

    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => formatDate(date),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: Date) => formatDate(date),
    },
  ];

  return (
    <div>
      <Search
        className="w-96"
        placeholder="Search by purchase number"
        onSearch={handleSearch}
        style={{ marginBottom: 20 }}
      />
      <Button className="bg-gradient-tone  text-white ml-8">Request</Button>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  );
}

export default Purchases;
