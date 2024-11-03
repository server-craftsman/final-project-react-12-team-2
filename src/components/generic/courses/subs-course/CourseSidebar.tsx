import React from "react";
import { Button, Card, Typography, Divider } from "antd";
import { ShoppingCartOutlined, ShareAltOutlined, PlayCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { CourseSidebarProps } from "../../../../models/objects/course/CourseSidebarProps";
import { useCart } from "../../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Carts, CartStatusEnum } from "../../../../models/prototype/Carts";
import { helpers } from "../../../../utils";
const { Title, Text } = Typography;

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartItem: Carts = {
      id: course.id,
      cart_no: course.title,
      price_paid: course.price,
      status: CartStatusEnum.new,
      price: course.price,
      discount: 0,
      course_id: course.id,
      student_id: course.id,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false
    };
    addToCart(cartItem);
    navigate("/cart?tab=new"); // Ensure this line is present
  };

  return (
    <Card className="sticky top-8 rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <Text className="text-3xl font-bold text-[#02005dc6]">${helpers.moneyFormat(course.price * (1 - course.discount / 100))}</Text>
        {course.discount > 0 && <Text className="ml-2 text-lg text-gray-500 line-through">${helpers.moneyFormat(course.price)}</Text>}
      </div>
      <button 
        className="mb-4 h-12 w-full rounded-lg bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-[#3949ab] hover:to-[#1a237e] hover:shadow-xl active:scale-95"
        onClick={handleAddToCart}
      >
        <ShoppingCartOutlined className="mr-2 text-xl" />
        Add to Cart
      </button>
      <button className="mb-6 h-12 w-full rounded-lg bg-[#1a237e] text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#3949ab] hover:shadow-xl active:scale-95">
        Buy Course
      </button>
      <Divider />
      <Title level={4} className="mb-4">
        This course includes:
      </Title>
      <div className="space-y-4">
        <div className="flex items-center">
          <PlayCircleOutlined className="mr-3 text-xl text-gray-600" />
          <div>
            <Text strong>Lectures by</Text>
            <Text className="block text-gray-500">{course.instructor_name}</Text>
          </div>
        </div>
        <div className="flex items-center">
          <ClockCircleOutlined className="mr-3 text-xl text-gray-600" />
          <div>
            <Text strong>Duration</Text>
            <Text className="block text-gray-500">{course.full_time} minutes</Text>
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
