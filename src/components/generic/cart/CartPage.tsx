import React, { useState } from "react";
import { Typography, List, Card, Button, Row, Col, Divider, Checkbox, Tabs, Image } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CartStatusEnum } from "../../../models/prototype/Carts";
import { useCart } from "../../../contexts/CartContext"; // Import useCart
import { helpers } from "../../../utils";
const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const initialTab = queryParams.get("tab") || String(CartStatusEnum.new);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<CartStatusEnum>(CartStatusEnum.new);
  const { cartItems, updateCartStatus, deleteCartItem, updateCartItems } = useCart(); // Use cartItems, updateCartStatus, and deleteCartItem from context

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
      key: String(CartStatusEnum.cancel), 
      label: "Cancel",
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
    const status = key as CartStatusEnum;
    if (Object.values(CartStatusEnum).includes(status)) {
      setActiveTab(status);
      updateCartItemsByStatus(status);
    } else {
      console.error("Invalid tab status:", status);
    }
  };

  const updateCartItemsByStatus = async (status: CartStatusEnum) => {
    try {
      await updateCartItems(status); // Pass the status to updateCartItems
    } catch (error) {
      console.error("Error fetching cart items by status:", error);
    }
  };

  const handleDeleteCartItem = async (cartId: string) => {
    await deleteCartItem(cartId);
    updateCartItemsByStatus(activeTab);
    updateCartItems(activeTab);
  };

  const handleCheckout = async () => {
    try {
      for (const itemId of selectedItems) {
        await updateCartStatus(itemId, CartStatusEnum.waiting_paid);
      }
      setActiveTab(CartStatusEnum.waiting_paid); // Ensure the "Waiting" tab is active
      updateCartItemsByStatus(CartStatusEnum.waiting_paid); // Fetch items for the "Waiting" status
      updateCartItems(CartStatusEnum.waiting_paid);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // Tính toán lại các giá trị dựa trên các mục đã chọn
  const calculateSummary = () => {
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item._id));
    const subtotal = selectedCartItems.reduce((acc, item) => acc + item.price, 0);
    const discount = selectedCartItems.reduce((acc, item) => acc + item.discount, 0);
    const total = selectedCartItems.reduce((acc, item) => acc + (item.price - (item.price * item.discount / 100)), 0);
    return {
      subtotal: helpers.moneyFormat(subtotal),
      discount: discount,
      total: helpers.moneyFormat(total)
    };
  };

  const { subtotal, discount, total } = calculateSummary();


  const handleConfirmPayment = async (cartId: string) => {
    try {
      await updateCartStatus(cartId, CartStatusEnum.completed);
      setActiveTab(CartStatusEnum.completed);
      updateCartItemsByStatus(CartStatusEnum.completed);
      updateCartItems(CartStatusEnum.completed);
    } catch (error) {
      console.error("Error during confirm payment:", error);
    }
  };

  const handleCancelOrder = async (cartId: string) => {
    try {
      await updateCartStatus(cartId, CartStatusEnum.cancel);
      setActiveTab(CartStatusEnum.cancel); // Ensure the "Cancel" tab is active
      updateCartItemsByStatus(CartStatusEnum.cancel); // Fetch items for the "Cancel" status
      updateCartItems(CartStatusEnum.cancel);
    } catch (error) {
      console.error("Error during cancel order:", error);
    }
  };

  return (
    <div className="container mx-auto min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
      <Title level={2} className="mb-12 text-center font-bold tracking-wide bg-gradient-to-r from-[#1a237e] to-[#3949ab] bg-clip-text text-transparent drop-shadow-lg transform hover:scale-105 transition-all duration-300">
        Shopping Cart
      </Title>
      
      <Tabs 
        activeKey={String(activeTab)}
        onChange={handleTabChange}
        items={tabItems}
        className="custom-tabs mb-8 transform transition-all duration-500 hover:scale-[1.02]"
        type="line"
        size="large"
        tabBarStyle={{
          marginBottom: "2rem",
          borderBottom: "4px solid",
          borderImage: "linear-gradient(to right, #1a237e, #3949ab, #1a237e) 1",
          background: "linear-gradient(to bottom, #fff, #fafafa)",
          boxShadow: "0 4px 12px rgba(26, 35, 126, 0.15)",
          padding: "0.5rem 1rem",
          borderRadius: "12px 12px 0 0",
          backdropFilter: "blur(8px)",
        }}
        tabBarGutter={32}
        animated={{
          inkBar: true,
          tabPane: true
        }}
        tabPosition="top"
        centered={true}
        tabBarExtraContent={{
          right: (
            <div className="flex items-center space-x-4 px-6">
              <div className="h-10 w-[2px] bg-gradient-to-b from-[#1a237e] to-[#3949ab] rounded-full" />
              <span className="text-base font-serif italic text-[#1a237e] opacity-80">Your Shopping Journey</span>
            </div>
          )
        }}
      />

      <Row gutter={32}>
        <Col span={16}>
          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-xl">
            {activeTab === CartStatusEnum.waiting_paid ? (
              <div className="waiting-tab-ui p-12 rounded-[2rem] bg-gradient-to-br from-gray-50 via-white to-gray-50 shadow-inner transition-all duration-500 hover:shadow-lg">
                <Title level={3} className="mb-12 text-center text-3xl text-gray-900 tracking-wider transform hover:scale-105 transition-transform duration-300">
                  Pending Orders
                </Title>
                <List
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item key={item._id} className="py-10 last:border-0 transform hover:-translate-y-1 transition-all duration-300">
                      <Card className="w-full border border-gray-100 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl backdrop-blur-sm">
                        <Row gutter={32} className="flex items-center p-8">
                          <Col span={16}>
                            <Text strong className="block text-3xl tracking-wide text-gray-900 mb-4 hover:text-[#02005dc6] transition-colors duration-300">
                              {item?.course_name}
                            </Text>
                            <Text className="mt-4 block text-lg text-gray-600 italic font-light">
                              Instructor: <span className="font-medium text-gray-800 hover:text-[#02005dc6] transition-colors duration-300">{item?.instructor_name}</span>
                            </Text>
                            <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
                              <div className="flex justify-between text-lg text-gray-700 hover:text-gray-900 transition-colors duration-300">
                                <span className="font-serif">Original Price</span>
                                <span className="font-medium">{helpers.moneyFormat(item?.price)}</span>
                              </div>
                              <div className="flex justify-between text-lg text-emerald-600 hover:text-emerald-700 transition-colors duration-300">
                                <span className="font-serif">Savings</span>
                                <span className="font-medium animate-pulse">{item?.discount}% OFF</span>
                              </div>
                              <div className="flex justify-between text-xl text-gray-900">
                                <span>Final Price</span>
                                <span className="bg-gradient-to-r from-indigo-900 to-blue-900 bg-clip-text text-transparent">{helpers.moneyFormat(item?.price - (item?.price * item?.discount / 100))}</span>
                              </div>
                            </div>
                          </Col>
                          <Col span={8} className="text-right space-y-6">
                            <Button 
                              type="primary" 
                              onClick={() => handleConfirmPayment(item._id)}
                              className="w-full bg-gradient-tone text-white font-serif text-lg px-10 py-6 h-auto rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-700 border-0 animate-shimmer"
                            >
                              Complete Payment
                            </Button>
                            <Button 
                              type="default" 
                              onClick={() => handleCancelOrder(item._id)}
                              className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-serif text-lg px-10 py-6 h-auto rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-700 border-0 animate-shimmer"
                            >
                              Cancel Order
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            ) : activeTab === CartStatusEnum.completed ? (
              <div className="completed-tab-ui p-12 rounded-[2rem] bg-gradient-to-br from-gray-50 via-white to-gray-50 shadow-inner transition-all duration-500 hover:shadow-2xl transform hover:scale-[1.02]">
                <Title level={3} className="mb-12 text-center text-3xl bg-gradient-tone bg-clip-text text-transparent font-extrabold tracking-wider transform hover:scale-105 transition-transform duration-500">
                  Completed Orders
                </Title>
                <List
                  dataSource={cartItems.filter(item => item.status === CartStatusEnum.completed)}
                  renderItem={(item) => (
                    <List.Item key={item._id} className="py-10 last:border-0 transform hover:-translate-y-2 transition-all duration-500 ease-in-out">
                      <Card className="w-full border border-gray-100 bg-white/90 shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-700 rounded-3xl backdrop-blur-lg">
                        <Row gutter={32} className="flex items-center p-8">
                          <Col span={16}>
                            <Text strong className="block text-3xl tracking-wide bg-gradient-tone bg-clip-text text-transparent mb-4 hover:scale-105 transform transition-all duration-300">
                              {item?.course_name}
                            </Text>
                            <Text className="mt-4 block text-lg text-gray-600 italic font-light">
                              Instructor: <span className="font-medium bg-gradient-tone bg-clip-text text-transparent hover:scale-105 inline-block transform transition-all duration-300">{item?.instructor_name}</span>
                            </Text>
                            <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
                              <div className="flex justify-between text-lg text-gray-700 hover:text-gray-900 transition-colors duration-300">
                                <span className="font-serif">Original Price</span>
                                <span className="font-medium">{helpers.moneyFormat(item?.price)}</span>
                              </div>
                              <div className="flex justify-between text-lg text-green-600 hover:text-green-700 transition-colors duration-300">
                                <span className="font-serif">Savings</span>
                                <span className="font-medium animate-pulse">{item?.discount}% OFF</span>
                              </div>
                              <div className="flex justify-between text-xl">
                                <span className="font-serif">Final Price</span>
                                <span className="bg-gradient-tone bg-clip-text text-transparent font-bold">{helpers.moneyFormat(item?.price - (item?.price * item?.discount / 100))}</span>
                              </div>
                            </div>
                          </Col>
                          <Col span={8} className="text-right space-y-6">
                            <Link to={`/course/${item._id}/lesson/${item?._id}`}>
                              <Button 
                                type="primary" 
                                className="w-full bg-gradient-tone text-white font-serif text-lg px-10 py-6 h-auto rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-700 border-0 animate-shimmer"
                              >
                                Learn More
                              </Button>
                            </Link>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <div className="default-tab-ui">
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
                  renderItem={(item) => {
                    const pricePaid = item.price_paid ?? 0; // Fallback to 0 if undefined
                    const price = item.price ?? 0; // Fallback to 0 if undefined

                    return (
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
                                  {helpers.moneyFormat(pricePaid)}
                                </Text>
                                {item.discount > 0 && (
                                  <>
                                    <Text className="block text-sm text-gray-500 line-through">
                                      {helpers.moneyFormat(price)}
                                    </Text>
                                    <Text className="block text-sm text-green-600">
                                      Sale {item.discount} %
                                    </Text>
                                  </>
                                )}
                                {item.status === CartStatusEnum.cancel && (
                                  <Button icon={<DeleteOutlined />} onClick={() => handleDeleteCartItem(item._id)}></Button>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    );
                  }}
                />
              </div>
            )}
          </Card>
        </Col>

        {activeTab !== CartStatusEnum.waiting_paid && activeTab !== CartStatusEnum.completed && (
          <Col span={8}>
            <Card className="sticky top-8 rounded-xl border-0 bg-white p-6 shadow-xl">
              <Title level={3} className="mb-8 text-center font-bold tracking-wide text-gray-800">
                Order Summary
              </Title>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <Text>Subtotal:</Text>
                  <Text>{subtotal}</Text>
                </div>

                <div className="flex justify-between text-green-600">
                  <Text>Discount:</Text>
                  <Text>- {discount} %</Text>
                </div>

                <Divider className="my-6" />

                <div className="flex justify-between">
                  <Text className="text-xl font-bold text-gray-800">Total:</Text>
                  <Text className="text-xl font-bold text-[#02005dc6]">
                    {total}
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
                  onClick={handleCheckout}
                >
                  Checkout
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
        )}
      </Row>
    </div>
  );
};

export default CartPage;
