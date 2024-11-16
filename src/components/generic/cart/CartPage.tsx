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
      label: "New"
    },
    {
      key: String(CartStatusEnum.waiting_paid),
      label: "Waiting"
    },
    {
      key: String(CartStatusEnum.completed),
      label: "Completed"
    },
    {
      key: String(CartStatusEnum.cancel),
      label: "Cancel"
    },
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
    const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item._id));
    const subtotal = selectedCartItems.reduce((acc, item) => acc + item.price, 0);
    const discount = selectedCartItems.reduce((acc, item) => acc + item.discount, 0);
    const total = selectedCartItems.reduce((acc, item) => acc + (item.price - (item.price * item.discount) / 100), 0);
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
    <div className="container mx-auto min-h-screen bg-gradient-to-b from-white to-gray-50 p-4 md:p-8">
      <Title level={2} className="mb-8 md:mb-12 transform bg-gradient-to-r from-[#1a237e] to-[#3949ab] bg-clip-text text-center text-2xl md:text-4xl font-bold tracking-wide text-transparent drop-shadow-lg transition-all duration-300 hover:scale-105">
        Shopping Cart
      </Title>

      <Tabs
        activeKey={String(activeTab)}
        onChange={handleTabChange}
        items={tabItems}
        className="custom-tabs mb-6 md:mb-8 transform transition-all duration-500 hover:scale-[1.02]"
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
          backdropFilter: "blur(8px)"
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
            <div className="hidden md:flex items-center space-x-4 px-6">
              <div className="h-10 w-[2px] rounded-full bg-gradient-to-b from-[#1a237e] to-[#3949ab]" />
              <span className="font-serif text-base italic text-[#1a237e] opacity-80">Your Shopping Journey</span>
            </div>
          )
        }}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-xl">
            {activeTab === CartStatusEnum.waiting_paid ? (
              <div className="waiting-tab-ui rounded-lg md:rounded-[2rem] bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-12 shadow-inner transition-all duration-500 hover:shadow-lg">
                <Title level={3} className="mb-8 md:mb-12 transform text-center text-2xl md:text-3xl tracking-wider text-gray-900 transition-transform duration-300 hover:scale-105">
                  Pending Orders
                </Title>
                <List
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item key={item._id} className="transform py-6 md:py-10 transition-all duration-300 last:border-0 hover:-translate-y-1">
                      <Card className="w-full rounded-2xl md:rounded-3xl border border-gray-100 bg-white shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl">
                        <Row gutter={[16, 16]} className="flex flex-col md:flex-row items-center p-4 md:p-8">
                          <Col xs={24} md={16}>
                            <Text strong className="mb-4 block text-2xl md:text-3xl tracking-wide text-gray-900 transition-colors duration-300 hover:text-[#02005dc6]">
                              {item?.course_name}
                            </Text>
                            <Text className="mt-2 md:mt-4 block text-base md:text-lg font-light italic text-gray-600">
                              Instructor: <span className="font-medium text-gray-800 transition-colors duration-300 hover:text-[#02005dc6]">{item?.instructor_name}</span>
                            </Text>
                            <div className="mt-6 md:mt-8 space-y-4 border-t border-gray-100 pt-4 md:pt-6">
                              <div className="flex justify-between text-base md:text-lg text-gray-700 transition-colors duration-300 hover:text-gray-900">
                                <span className="font-serif">Original Price</span>
                                <span className="font-medium">{helpers.moneyFormat(item?.price)}</span>
                              </div>
                              <div className="flex justify-between text-base md:text-lg text-emerald-600 transition-colors duration-300 hover:text-emerald-700">
                                <span className="font-serif">Savings</span>
                                <span className="animate-pulse font-medium">{item?.discount}% OFF</span>
                              </div>
                              <div className="flex justify-between text-lg md:text-xl text-gray-900">
                                <span>Final Price</span>
                                <span className="bg-gradient-to-r from-indigo-900 to-blue-900 bg-clip-text text-transparent">{helpers.moneyFormat(item?.price - (item?.price * item?.discount) / 100)}</span>
                              </div>
                            </div>
                          </Col>
                          <Col xs={24} md={8} className="space-y-4 md:space-y-6 text-center md:text-right">
                            <Button type="primary" onClick={() => handleConfirmPayment(item._id)} className="bg-gradient-tone animate-shimmer h-auto w-full transform rounded-xl md:rounded-2xl border-0 px-6 md:px-10 py-4 md:py-6 font-serif text-base md:text-lg text-white shadow-lg transition-all duration-700 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
                              Complete Payment
                            </Button>
                            <Button type="default" onClick={() => handleCancelOrder(item._id)} className="animate-shimmer h-auto w-full transform rounded-xl md:rounded-2xl border-0 bg-gradient-to-r from-red-600 to-red-800 px-6 md:px-10 py-4 md:py-6 font-serif text-base md:text-lg text-white shadow-lg transition-all duration-700 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
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
              <div className="completed-tab-ui transform rounded-lg md:rounded-[2rem] bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-12 shadow-inner transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <Title level={3} className="bg-gradient-tone mb-8 md:mb-12 transform bg-clip-text text-center text-2xl md:text-3xl font-extrabold tracking-wider text-transparent transition-transform duration-500 hover:scale-105">
                  Completed Orders
                </Title>
                <List
                  dataSource={cartItems.filter((item) => item.status === CartStatusEnum.completed)}
                  renderItem={(item) => (
                    <List.Item key={item._id} className="transform py-6 md:py-10 transition-all duration-500 ease-in-out last:border-0 hover:-translate-y-2">
                      <Card className="w-full rounded-2xl md:rounded-3xl border border-gray-100 bg-white/90 shadow-lg backdrop-blur-lg transition-all duration-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <Row gutter={[16, 16]} className="flex items-center p-4 md:p-8">
                          <Col xs={24}>
                            <Text strong className="bg-gradient-tone mb-4 block transform bg-clip-text text-2xl md:text-3xl tracking-wide text-transparent transition-all duration-300 hover:scale-105">
                              {item?.course_name}
                            </Text>
                            <Text className="mt-2 md:mt-4 block text-base md:text-lg font-light italic text-gray-600">
                              Instructor: <span className="bg-gradient-tone inline-block transform bg-clip-text font-medium text-transparent transition-all duration-300 hover:scale-105">{item?.instructor_name}</span>
                            </Text>
                            <div className="mt-6 md:mt-8 space-y-4 border-t border-gray-100 pt-4 md:pt-6">
                              <div className="flex justify-between text-base md:text-lg text-gray-700 transition-colors duration-300 hover:text-gray-900">
                                <span className="font-serif">Original Price</span>
                                <span className="font-medium">{helpers.moneyFormat(item?.price)}</span>
                              </div>
                              <div className="flex justify-between text-base md:text-lg text-green-600 transition-colors duration-300 hover:text-green-700">
                                <span className="font-serif">Savings</span>
                                <span className="animate-pulse font-medium">{item?.discount}% OFF</span>
                              </div>
                              <div className="flex justify-between text-lg md:text-xl">
                                <span className="font-serif">Final Price</span>
                                <span className="bg-gradient-tone bg-clip-text font-bold text-transparent">{helpers.moneyFormat(item?.price - (item?.price * item?.discount) / 100)}</span>
                              </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                              <Link to={`/course/${item.course_id}`}>
                                <Button type="primary" className="bg-gradient-tone animate-shimmer h-auto transform rounded-xl md:rounded-2xl border-0 px-6 md:px-10 py-4 md:py-6 font-serif text-base md:text-lg text-white shadow-lg transition-all duration-700 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
                                  Learn More
                                </Button>
                              </Link>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <div className="default-tab-ui">
                <div className="mb-4 md:mb-6 flex items-center border-b border-gray-100 pb-4">
                  <Checkbox checked={selectAll} onChange={handleSelectAllChange} className="text-base md:text-lg font-medium text-gray-700">
                    Select All Items
                  </Checkbox>
                </div>
                <List
                  dataSource={cartItems}
                  renderItem={(item) => {
                    const pricePaid = item.price_paid ?? 0; // Fallback to 0 if undefined
                    const price = item.price ?? 0; // Fallback to 0 if undefined

                    return (
                      <List.Item key={item._id} className="border-b border-gray-50 py-4 md:py-6 last:border-0">
                        <Card className="w-full border-0 bg-transparent shadow-none">
                          <Row gutter={[16, 16]} className="flex flex-col md:flex-row items-center">
                            <Col xs={24} md={1} className="flex justify-center md:justify-start">
                              <Checkbox checked={selectedItems.includes(item._id)} onChange={() => handleItemSelectChange(item._id)} />
                            </Col>

                            <Col xs={24} md={5} className="flex justify-center md:justify-start">
                              <Image src={item?.course_image} alt={item?.name} className="rounded-lg object-cover" width={120} height={80} />
                            </Col>

                            <Col xs={24} md={12} className="text-center md:text-left">
                              <Text strong className="block text-lg md:text-xl font-bold tracking-wide text-gray-800">
                                {item?.course_name}
                              </Text>
                              <Text className="mt-2 block text-sm md:text-base text-gray-600">By {item?.instructor_name}</Text>
                            </Col>

                            <Col xs={24} md={6} className="text-center md:text-right">
                              <div className="space-y-2">
                                <Text className="block text-base md:text-lg font-semibold text-[#02005dc6]">{helpers.moneyFormat(pricePaid)}</Text>
                                {item.discount > 0 && (
                                  <>
                                    <Text className="block text-xs md:text-sm text-gray-500 line-through">{helpers.moneyFormat(price)}</Text>
                                    <Text className="block text-xs md:text-sm text-green-600">Sale {item.discount} %</Text>
                                  </>
                                )}
                                {(item.status === CartStatusEnum.cancel || item.status === CartStatusEnum.new) && <Button icon={<DeleteOutlined />} onClick={() => handleDeleteCartItem(item._id)}></Button>}
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
          <Col xs={24} lg={8}>
            <Card className="sticky top-8 rounded-xl border-0 bg-white p-4 md:p-6 shadow-xl">
              <Title level={3} className="mb-6 md:mb-8 text-center text-xl md:text-2xl font-bold tracking-wide text-gray-800">
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

                <Divider className="my-4 md:my-6" />

                <div className="flex justify-between">
                  <Text className="text-lg md:text-xl font-bold text-gray-800">Total:</Text>
                  <Text className="text-lg md:text-xl font-bold text-[#02005dc6]">{total}</Text>
                </div>
              </div>

              <div className="mt-6 md:mt-8 space-y-4">
                <Button type="primary" size="large" block className="h-10 md:h-12 bg-[#1a237e] text-base md:text-lg font-bold tracking-wide shadow-lg transition-all hover:scale-[1.02] hover:bg-[#6a1bff] hover:shadow-xl" icon={<ShoppingCartOutlined />} onClick={handleCheckout}>
                  Checkout
                </Button>

                <Button size="large" block className="h-10 md:h-12 border border-gray-200 text-base md:text-lg font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-800" onClick={handleBackToHome}>
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
