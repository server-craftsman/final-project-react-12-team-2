import React, { useState } from "react";
import { Typography, List, Card, Button, Row, Col, Divider, Checkbox, Tabs } from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CartStatusEnum } from "../../../models/prototype/Carts";
const { Title, Text } = Typography;
import cartData from "../../../data/carts.json";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || String(CartStatusEnum.new);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<CartStatusEnum>(initialTab as unknown as CartStatusEnum);

  const handleBackToHome = () => {
    navigate("/");
  };

  const numberCartNo = (cart_no: string) => {
    return cart_no ? cart_no.split("-")[1] : "N/A";
  };

  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedItems(filteredCartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleItemSelectChange = (itemId: string) => {
    setSelectedItems((prevSelectedItems) => (prevSelectedItems.includes(itemId) ? prevSelectedItems.filter((id) => id !== itemId) : [...prevSelectedItems, itemId]));
  };

  const filteredCartItems = cartData.carts.filter((item) => item.status === String(activeTab) && !item.is_deleted);

  const tabItems = [
    {
      key: String(CartStatusEnum.new),
      label: "New",
      children: (
        // Render New Cart Items
        <div></div>
      )
    },
    {
      key: String(CartStatusEnum.waiting_paid),
      label: "Waiting",
      children: (
        // Render Waiting Cart Items
        <div></div>
      )
    },
    {
      key: String(CartStatusEnum.completed),
      label: "Completed",
      children: (
        // Render Completed Cart Items
        <div></div>
      )
    }
  ];

  return (
    <div className="container mx-auto bg-white p-4">
      <Title level={2} className="mb-8 text-center font-bold text-[#02005dc6]">
        Your Cart
      </Title>
      <Tabs activeKey={String(activeTab)} onChange={(key) => setActiveTab(key as unknown as CartStatusEnum)} items={tabItems} />
      <Row gutter={16}>
        <Col span={16}>
          <Card className="w-full rounded-lg border border-gray-300 shadow-2xl">
            <Checkbox checked={selectAll} onChange={handleSelectAllChange} className="mb-4">
              Select All
            </Checkbox>
            <List
              dataSource={filteredCartItems}
              renderItem={(item) => (
                <List.Item>
                  <Card className="w-full rounded-lg border border-gray-300 shadow-lg">
                    <Row gutter={16} className="flex items-center justify-between">
                      <Col span={1}>
                        <Checkbox checked={selectedItems.includes(item.id)} onChange={() => handleItemSelectChange(item.id)} />
                      </Col>
                      <Col span={4}>
                        <Text strong className="text-lg">
                          Cart No: {numberCartNo(item.cart_no)}
                        </Text>
                      </Col>

                      <Col span={16} className="text-right">
                        <Text className="mr-2 text-lg font-bold text-[#02005dc6]">${(item.price - item.discount).toFixed(2)}</Text>
                        <Button onClick={() => console.log(`Remove item ${item.id}`)} type="link" danger icon={<DeleteOutlined />}>
                          Remove
                        </Button>
                      </Col>
                    </Row>
                    <Row gutter={16} className="mt-4 flex">
                      <Col span={4}>
                        <Text className="text-gray-500">Price Paid: ${item.price_paid.toFixed(2)}</Text>
                      </Col>
                      <Col span={4}>
                        <Text className="text-gray-500">Discount: ${item.discount.toFixed(2)}</Text>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="w-full rounded-lg border border-gray-300 shadow-2xl">
            <Title level={4} className="text-center">
              Order Summary
            </Title>
            <Divider />
            <div className="flex justify-between">
              <Text>Discount:</Text>
              <Text>${filteredCartItems.reduce((acc, item) => acc + item.discount, 0).toFixed(2)}</Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-lg font-bold">Total:</Text>
              <Text className="text-lg font-bold">${filteredCartItems.reduce((acc, item) => acc + (item.price - item.discount), 0).toFixed(2)}</Text>
            </div>
            <Divider />
            <div className="text-center">
              <Button type="primary" size="large" className="bg-[#1a237e] font-bold hover:bg-[#6a1bff] hover:text-white" icon={<ShoppingCartOutlined />}>
                Proceed to Checkout
              </Button>
              <Button type="default" size="large" className="ml-4 border border-gray-300 text-gray-700 hover:bg-gray-100" onClick={handleBackToHome}>
                Back to Home
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
