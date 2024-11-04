import React, { useState } from "react";
import { Typography, List, Card, Button, Row, Col, Divider, Checkbox, Tabs, Image } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CartStatusEnum } from "../../../models/prototype/Carts";
import { useCart } from "../../../contexts/CartContext"; // Import useCart
const { Title, Text } = Typography;

// // Define a mapping from CartStatusEnum to the expected string values
// const statusMap: Record<CartStatusEnum, string> = {
//   [CartStatusEnum.new]: "new",
//   [CartStatusEnum.waiting_paid]: "waiting_paid",
//   [CartStatusEnum.completed]: "completed",
//   [CartStatusEnum.cancel]: "cancel"
// };

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || String(CartStatusEnum.new);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<CartStatusEnum>(initialTab as unknown as CartStatusEnum);
  const { cartItems } = useCart(); // Use cartItems from context

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedItems(cartItems.map((item: any) => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleItemSelectChange = (itemId: string) => {
    setSelectedItems((prevSelectedItems) => (prevSelectedItems.includes(itemId) ? prevSelectedItems.filter((id) => id !== itemId) : [...prevSelectedItems, itemId]));
  };

  const tabItems = [
    {
      key: String(CartStatusEnum.new),
      label: "New",
    },
    {
      key: String(CartStatusEnum.waiting_paid),
      label: "Waiting",
    },
    {
      key: String(CartStatusEnum.completed),
      label: "Completed",
    }
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key as unknown as CartStatusEnum);
  };

  return (
    <div className="container mx-auto min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
      <Title level={2} className="mb-12 text-center font-bold tracking-wide text-[#02005dc6]">
        Shopping Cart
      </Title>
      
      <Tabs 
        activeKey={String(activeTab)} 
        onChange={handleTabChange} 
        items={tabItems}
        className="custom-luxury-tabs mb-8" 
      />

      <Row gutter={32}>
        <Col span={16}>
          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-xl">
            <div className="mb-6 flex items-center border-b border-gray-100 pb-4">
              <Checkbox 
                checked={selectAll} 
                onChange={handleSelectAllChange}
                className="text-lg font-medium text-gray-700"
              >
                Select All Items
              </Checkbox>
            </div>

            <List
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item key={item._id} className="border-b border-gray-50 py-6 last:border-0">
                  <Card className="w-full border-0 bg-transparent shadow-none">
                    <Row gutter={24} className="flex items-center">
                      <Col span={1}>
                        <Checkbox 
                          checked={selectedItems.includes(item._id)} 
                          onChange={() => handleItemSelectChange(item._id)}
                        />
                      </Col>

                      <Col span={5}>
                        <Image 
                          src={item?.course_image} 
                          alt={item?.name}
                          className="rounded-lg object-cover"
                          width={120} 
                          height={80} 
                        />
                      </Col>
                      
                      <Col span={12}>
                        <Text strong className="block text-xl font-bold tracking-wide text-gray-800">
                          {item?.course_name}
                        </Text>
                        <Text className="mt-2 block text-base text-gray-600">
                          By {item?.instructor_name}
                        </Text>
                      </Col>

                      <Col span={6} className="text-right">
                        <div className="space-y-2">
                          <Text className="block text-lg font-semibold text-[#02005dc6]">
                            ${item.price_paid.toFixed(2)}
                          </Text>
                          <Text className="block text-sm text-gray-500 line-through">
                            ${item.price.toFixed(2)}
                          </Text>
                          <Text className="block text-sm text-green-600">
                            Save ${item.discount}
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card className="sticky top-8 rounded-xl border-0 bg-white p-6 shadow-xl">
            <Title level={3} className="mb-8 text-center font-bold tracking-wide text-gray-800">
              Order Summary
            </Title>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <Text>Subtotal:</Text>
                <Text>${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</Text>
              </div>

              <div className="flex justify-between text-green-600">
                <Text>Discount:</Text>
                <Text>-${cartItems.reduce((acc, item) => acc + item.discount, 0).toFixed(2)}</Text>
              </div>

              <Divider className="my-6" />

              <div className="flex justify-between">
                <Text className="text-xl font-bold text-gray-800">Total:</Text>
                <Text className="text-xl font-bold text-[#02005dc6]">
                  ${cartItems.reduce((acc, item) => acc + (item.price - item.discount), 0).toFixed(2)}
                </Text>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <Button 
                type="primary" 
                size="large"
                block
                className="h-12 bg-[#1a237e] text-lg font-bold tracking-wide shadow-lg transition-all hover:bg-[#6a1bff] hover:scale-[1.02] hover:shadow-xl"
                icon={<ShoppingCartOutlined />}
              >
                Proceed to Checkout
              </Button>

              <Button 
                size="large"
                block
                className="h-12 border border-gray-200 text-lg font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-800"
                onClick={handleBackToHome}
              >
                Continue Shopping
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
