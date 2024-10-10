import React from 'react';
import { Button, Card, Typography, Divider } from 'antd';
import { ShoppingCartOutlined, ShareAltOutlined, PlayCircleOutlined, ClockCircleOutlined, BarChartOutlined, GlobalOutlined, CalendarOutlined, TrophyOutlined } from '@ant-design/icons';
import { CourseSidebarProps } from '../../../../models/objects/course/CourseSidebarProps';
import { useCart } from '../../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Carts, CartStatusEnum } from '../../../../models/Carts';

const { Title, Text } = Typography;

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course, discountedPrice }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartItem: Carts = {
      id: course.id,
      cart_no: course.title,
      price_paid: course.price, // Assuming course.price exists
      status: CartStatusEnum.new, // Add required properties
      price: course.price,
      discount: 0, // Or appropriate discount value
      course_id: course.id,
      student_id: course.id,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false,
      // Add other required properties here
    };
    addToCart(cartItem);
    navigate('/cart');
  };

  return (
    <Card className="shadow-lg rounded-lg sticky top-8">
      <div className="text-center mb-6">
        <Text className="text-3xl font-bold text-[#02005dc6]">${discountedPrice}</Text>
        {course.discount > 0 && (
          <Text className="ml-2 text-lg line-through text-gray-500">${course.price}</Text>
        )}
      </div>
      <Button type="primary" size="large" block className="mb-4 h-12 text-lg bg-[#1a237e] text-white hover:bg-[#1a237e] hover:text-white" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
        Add to cart
      </Button>
      <Button size="large" block className="mb-6 h-12 text-lg">
        Buy Course
      </Button>
      <Divider />
      <Title level={4} className="mb-4">This course includes:</Title>
      <div className="space-y-4">
                <div className="flex items-center">
                  <PlayCircleOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Lectures</Text>
                    <Text className="block text-gray-500">12</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <ClockCircleOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Duration</Text>
                    <Text className="block text-gray-500">20h 50m</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <BarChartOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Skill Level</Text>
                    <Text className="block text-gray-500">Beginner</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <GlobalOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Language</Text>
                    <Text className="block text-gray-500">English</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Deadline</Text>
                    <Text className="block text-gray-500">February 20, 2025</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrophyOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Certificate</Text>
                    <Text className="block text-gray-500">Yes</Text>
                  </div>
        </div>
      </div>
      <Button icon={<ShareAltOutlined />} type="link" className="mt-4 p-0">
        Share this course
      </Button>
    </Card>
  );
};

export default CourseSidebar;