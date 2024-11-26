import React, { useCallback, useState } from "react";
import { Typography, List, Card, Button, Row, Col, Divider, Checkbox, Tabs, Image, Table, Modal } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link, useNavigate,  } from "react-router-dom";
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
      key: String(CartStatusEnum.waiting_paid),
      label: "Waiting",
    },
    {
      key: String(CartStatusEnum.completed),
      label: "Completed",
    },
    {
      key: String(CartStatusEnum.cancel),
      label: "Cancel",
    },
  ];

// ... existing code ...

  // const handleTabChange = useCallback((key: string) => {
  //   const status = key as CartStatusEnum;
  //   if (Object.values(CartStatusEnum).includes(status)) {
  //     setActiveTab(status);
  //     updateCartItems(status).then(() => {
  //       if (status === CartStatusEnum.new) {
  //         countNewCartItems(status);
  //       }
  //     });
  //   } else {
  //     console.error("Invalid tab status:", status);
  //   }
  // }, [updateCartItems, countNewCartItems]);

  const handleTabChange = useCallback(async (key: string) => {
    const status = key as CartStatusEnum;
    if (status !== activeTab && Object.values(CartStatusEnum).includes(status)) {
      setActiveTab(status);
      try {
        await updateCartItems(status);
      } catch (error) {
        console.error("Error updating cart items on tab change:", error);
      }
    }
  }, [activeTab, updateCartItems]);

// Ensure that updateCartItems is correctly implemented to fetch data based on the status

  // ... existing code ...

  // const updateCartItemsByStatus = async (status: CartStatusEnum) => {
  //   try {
  //     await updateCartItems(status); // Pass the status to updateCartItems
  //     // updateCartItems(status);
  //   } catch (error) {
  //     console.error("Error fetching cart items by status:", error);
  //   }
  // };

  const handleDeleteCartItem = async (cartId: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await deleteCartItem(cartId);
      },
    });
  };

  const handleCheckout = useCallback(async () => {
    try {
      for (const itemId of selectedItems) {
        await updateCartStatus(itemId, CartStatusEnum.waiting_paid);
      }
      setActiveTab(CartStatusEnum.waiting_paid); // Ensure the "Waiting" tab is active
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  }, [selectedItems, updateCartStatus, updateCartItems]);

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

  const handleConfirmPayment = useCallback(async (cartId: string) => {
    try {
      await updateCartStatus(cartId, CartStatusEnum.completed);
      setActiveTab(CartStatusEnum.completed);
    } catch (error) {
      console.error("Error during confirm payment:", error);
    }
  }, [updateCartStatus, updateCartItems]);

  const handleCancelOrder = useCallback(async (cartId: string) => {
    try {
      await updateCartStatus(cartId, CartStatusEnum.cancel);
      setActiveTab(CartStatusEnum.cancel); // Ensure the "Cancel" tab is active
    } catch (error) {
      console.error("Error during cancel order:", error);
    }
  }, [updateCartStatus, updateCartItems]);


  return (
    <div className="container mx-auto min-h-screen bg-gradient-to-b from-white to-gray-50 p-2 md:p-8">
      <Title level={2} className="mb-8 md:mb-12 transform bg-gradient-to-r from-[#1a237e] to-[#3949ab] bg-clip-text text-center text-2xl md:text-4xl font-bold tracking-wide text-transparent drop-shadow-lg transition-all duration-300 hover:scale-105">
        Shopping Cart
      </Title>

      <Tabs
        activeKey={String(activeTab)}
        onChange={handleTabChange}
        items={tabItems}
        className="md:mb-8 transform transition-all duration-500"
        type="line"
        size="large"
        tabBarStyle={{
          // marginBottom: "2rem",
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
        <Col xs={24} lg={activeTab === CartStatusEnum.completed || activeTab === CartStatusEnum.waiting_paid ? 24 : 16}>
          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-xl">
            {activeTab === CartStatusEnum.waiting_paid ? (
              <div className="waiting-tab-ui md:p-6">
                <Title level={3} className="mb-6 md:mb-8 transform text-center text-3xl md:text-4xl font-extrabold tracking-wider text-gray-900 uppercase">
                  Pending Orders
                </Title>
                <List
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item key={item._id} className="transform py-6 md:py-10 transition-all duration-300 last:border-0 hover:-translate-y-1">
                      <Card className="w-full rounded-3xl border border-gray-200 bg-white shadow-2xl backdrop-blur-md transition-all duration-500 hover:shadow-3xl">
                        <Row gutter={[32, 32]} className="flex flex-col md:flex-row items-center p-4 md:p-8">
                          <Col xs={24} md={16}>
                            <Text strong className="mb-4 block text-3xl md:text-4xl tracking-wide text-gray-900 transition-colors duration-300 hover:text-[#02005dc6]">
                              {item?.course_name}
                            </Text>
                            <Text className="mt-2 md:mt-4 block text-lg md:text-xl font-light italic text-gray-600">
                              Instructor: <span className="font-medium text-gray-800 transition-colors duration-300 hover:text-[#02005dc6]">{item?.instructor_name}</span>
                            </Text>
                            <div className="mt-6 md:mt-8 space-y-4 border-t border-gray-200 pt-4 md:pt-6">
                              <div className="flex justify-between text-lg md:text-xl text-gray-700 transition-colors duration-300 hover:text-gray-900">
                                <span className="font-serif">Original Price</span>
                                <span className="font-medium">{helpers.moneyFormat(item?.price)}</span>
                              </div>
                              <div className="flex justify-between text-lg md:text-xl text-emerald-600 transition-colors duration-300 hover:text-emerald-700">
                                <span className="font-serif">Savings</span>
                                <span className="animate-pulse font-medium">{item?.discount}% OFF</span>
                              </div>
                              <div className="flex justify-between text-xl md:text-2xl text-gray-900">
                                <span>Final Price</span>
                                <span className="bg-gradient-to-r from-indigo-900 to-blue-900 bg-clip-text text-transparent">{helpers.moneyFormat(item?.price - (item?.price * item?.discount) / 100)}</span>
                              </div>
                              <Button 
                                type="primary" 
                                onClick={() => handleConfirmPayment(item._id)} 
                                className="w-full rounded-xl border-0 px-8 py-5 text-lg text-white shadow-lg transition-transform duration-300 hover:scale-105"
                              >
                                Complete Payment
                              </Button>
                              <Button 
                                type="default" 
                                onClick={() => handleCancelOrder(item._id)} 
                                className="w-full rounded-xl border-0 bg-red-600 px-8 py-5 text-lg text-white shadow-lg transition-transform duration-300 hover:scale-105"
                              >
                                Cancel Order
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            ) : activeTab === CartStatusEnum.completed ? (
              <div className="completed-tab-ui transform md:rounded-[10px] bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-500 w-full">
                <Title level={3} className="bg-gradient-tone mt-5 mb-8 md:mb-12 transform bg-clip-text text-center text-2xl md:text-3xl font-extrabold tracking-wider text-transparent transition-transform duration-500">
                  Completed Orders
                </Title>
                <Table
                  dataSource={cartItems.filter((item) => item.status === CartStatusEnum.completed)}
                  columns={[
                    {
                      title: 'Course Name',
                      dataIndex: 'course_name',
                      key: 'course_name',
                      render: (text) => (
                        <Text strong className="bg-gradient-tone block w-full transform bg-clip-text md:text-xl tracking-wide text-transparent transition-all duration-300">
                          {text}
                        </Text>
                      ),
                      width: '300px',
                    },
                    // {
                    //   title: 'Instructor',
                    //   dataIndex: 'instructor_name',
                    //   key: 'instructor_name',
                    //   render: (text) => (
                    //     <Text className="mt-2 md:mt-4 block text-base md:text-lg font-light italic text-gray-600">
                    //       <span className="bg-gradient-tone inline-block transform bg-clip-text font-light text-transparent transition-all duration-300">{text}</span>
                    //     </Text>
                    //   ),
                    // },
                    {
                      title: 'Original Price',
                      dataIndex: 'price',
                      key: 'price',
                      render: (price) => (
                        <span className="font-medium">{helpers.moneyFormat(price)}</span>
                      ),
                    },
                    {
                      title: 'Savings',
                      dataIndex: 'discount',
                      key: 'discount',
                      render: (discount) => (
                        <span className="animate-pulse font-medium">{discount}% OFF</span>
                      ),
                    },
                    {
                      title: 'Final Price',
                      key: 'final_price',
                      render: (_, item) => (
                        <span className="bg-gradient-tone bg-clip-text font-bold text-transparent">{helpers.moneyFormat(item.price - (item.price * item.discount) / 100)}</span>
                      ),
                    },
                    {
                      title: 'Action',
                      key: 'action',
                      render: (_, item) => (
                        <Link to={`/course/${item.course_id}`}>
                          <Button type="primary" className="bg-gradient-tone animate-shimmer h-10 md:h-12 transform rounded-xl md:rounded-2xl border-0 px-6 md:px-10 py-4 md:py-6 font-serif md:text-lg text-white shadow-lg transition-all duration-700 hover:shadow-xl">
                            Learn More
                          </Button>
                        </Link>
                      ),
                    },
                  ]}
                  rowKey="_id"
                  pagination={false}
                  className="transition-all duration-500 ease-in-out"
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

        {activeTab !== CartStatusEnum.waiting_paid && activeTab !== CartStatusEnum.completed && cartItems.length > 0 && (
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
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  className="h-10 md:h-12 bg-[#1a237e] text-base md:text-lg font-bold tracking-wide shadow-lg transition-all hover:scale-[1.02] hover:bg-[#6a1bff] hover:shadow-xl" 
                  icon={<ShoppingCartOutlined />} 
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0} // Disable if no items are selected
                >
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
