import React from 'react';
import { Typography, List, Card, Button, Row, Col, Divider } from 'antd';
import { useCart } from '../../../context/CartContext';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

//   const totalPrice = cartItems.reduce((sum, item) => sum + item.discountedPrice, 0);

  const handleBackToHome = () => {
    navigate('/');
  };

  const numberCartNo = (cart_no: string) => {
    return cart_no ? cart_no.split('-')[1] : 'N/A';
  };

  return (
    <div className="container mx-auto p-4">
      <Title level={2} className="text-center mb-8">Your Cart</Title>
      <Row gutter={16}>
        <Col span={16}>
          <List
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <Card className="w-full shadow-lg rounded-lg">
                  <Row gutter={16} className="flex items-center">
                    <Col span={6}>
                      <Text strong className="text-lg">Cart No: {numberCartNo(item.cart_no)}</Text>
                    </Col>
                    <Col span={6}>
                      <Text className="text-gray-500">Status: {item.status}</Text>
                    </Col>
                    <Col span={6}>
                      <Text className="text-gray-500">Price Paid: ${item.price_paid.toFixed(2)}</Text>
                    </Col>
                    <Col span={6} className="text-right">
                      <Text className="text-lg font-bold text-[#02005dc6] mr-2">
                        ${item.discountedPrice.toFixed(2)}
                      </Text>
                      <Button onClick={() => removeFromCart(item.id)} type="link" danger icon={<DeleteOutlined />}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={16} className="flex items-center mt-4">
                    <Col span={6}>
                      <Text className="text-gray-500">Price: ${item.price.toFixed(2)}</Text>
                    </Col>
                    <Col span={6}>
                      <Text className="text-gray-500">Discount: ${item.discount.toFixed(2)}</Text>
                    </Col>
                    <Col span={6}>
                      <Text className="text-gray-500">Course ID: {item.course_id}</Text>
                    </Col>
                    <Col span={6}>
                      <Text className="text-gray-500">Student ID: {item.student_id}</Text>
                    </Col>
                  </Row>
                  <Row gutter={16} className="flex items-center mt-4">
                    <Col span={6}>
                      <Text className="text-gray-500">Created At: {item.created_at.toDateString()}</Text>
                    </Col>
                    <Col span={6}>
                      <Text className="text-gray-500">Updated At: {item.updated_at.toDateString()}</Text>
                    </Col>
                    <Col span={6}>
                      <Text className="text-gray-500">Is Deleted: {item.is_deleted ? 'Deleted' : 'Active'}</Text>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        </Col>
        <Col span={8}>
          <Card className="shadow-lg rounded-lg">
            <Title level={4} className="text-center">Order Summary</Title>
            <Divider />
            <div className="flex justify-between">
                <Text>Discount</Text>   
                <Text>${cartItems.reduce((acc, item) => acc + item.discount, 0).toFixed(2)}</Text>
            </div>
            <div className="flex justify-between">
              <Text className="text-lg font-bold">Total: ${cartItems.reduce((acc, item) => acc + item.discountedPrice, 0).toFixed(2)}</Text>
            </div>
            <Divider />
            <div className="text-center">
              <Button type="primary" size="large" className="bg-[#1a237e] hover:bg-[#1a237e] hover:text-white" icon={<ShoppingCartOutlined />}>
                Proceed to Checkout
              </Button>
              <Button type="default" size="large" className="ml-4" onClick={handleBackToHome}>
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