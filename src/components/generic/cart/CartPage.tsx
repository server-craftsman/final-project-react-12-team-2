import React, { useState } from "react";
import {
  Typography,
  List,
  Card,
  Button,
  Row,
  Col,
  Divider,
  Checkbox,
} from "antd";
import { useCart } from "../../../context/CartContext";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleItemSelectChange = (itemId: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId],
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Title level={2} className="mb-8 text-center font-bold text-[#02005dc6]">
        Your Cart
      </Title>
      <Row gutter={16}>
        <Col span={16}>
          <Card className="w-full rounded-lg shadow-lg">
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAllChange}
              className="mb-4"
            >
              Select All
            </Checkbox>
            <List
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <Card className="w-full rounded-lg shadow-lg">
                    <Row
                      gutter={16}
                      className="flex items-center justify-between"
                    >
                      <Col span={1}>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleItemSelectChange(item.id)}
                        />
                      </Col>
                      <Col span={4}>
                        <Text strong className="text-lg">
                          Cart No: {numberCartNo(item.cart_no)}
                        </Text>
                      </Col>

                      <Col span={16} className="text-right">
                        <Text className="mr-2 text-lg font-bold text-[#02005dc6]">
                          ${item.discountedPrice.toFixed(2)}
                        </Text>
                        <Button
                          onClick={() => removeFromCart(item.id)}
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                    <Row gutter={16} className="mt-4 flex">
                      <Col span={4}>
                        <Text className="text-gray-500">
                          Price Paid: ${item.price_paid.toFixed(2)}
                        </Text>
                      </Col>
                      <Col span={4}>
                        <Text className="text-gray-500">
                          Discount: ${item.discount.toFixed(2)}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="w-full rounded-lg shadow-lg">
            <Title level={4} className="text-center">
              Order Summary
            </Title>
            <Divider />
            <div className="flex justify-between">
              <Text>Discount:</Text>
              <Text>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.discount, 0)
                  .toFixed(2)}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-lg font-bold">Total:</Text>
              <Text className="text-lg font-bold">
                $
                {cartItems
                  .reduce((acc, item) => acc + item.discountedPrice, 0)
                  .toFixed(2)}
              </Text>
            </div>
            <Divider />
            <div className="text-center">
              <Button
                type="primary"
                size="large"
                className="bg-[#1a237e] hover:bg-[#1a237e] hover:text-white"
                icon={<ShoppingCartOutlined />}
              >
                Proceed to Checkout
              </Button>
              <Button
                type="default"
                size="large"
                className="ml-4"
                onClick={handleBackToHome}
              >
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
