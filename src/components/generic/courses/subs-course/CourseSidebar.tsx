import React from "react";
import { Card, Typography, Divider } from "antd";
import { ShoppingCartOutlined,PlayCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { CourseSidebarProps } from "../../../../models/objects/course/CourseSidebarProps";
import { helpers } from "../../../../utils";
import { CartService } from "../../../../services/cart/cart.service";
import ShareButton from "./ShareButton";

const { Title, Text } = Typography;

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
  const handleAddToCart = async () => {
    try {
      if (course.is_in_cart) {
        window.location.href = `/cart`;
      } else {
        const response = await CartService.createCart(course._id);
        if (response.data.data && response.data.data._id) {
          window.location.href = `/cart`;
        } else {
          console.error("Failed to add to cart");
        }
      }
    } catch (error) {
      console.error("Error handling cart operation:", error);
    }
  };

  return (
    <Card className="sticky top-8 rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <Text className="text-3xl font-bold text-[#02005dc6]">{helpers.moneyFormat(course.price * (1 - course.discount / 100))}</Text>
        {course.discount > 0 && <Text className="ml-2 text-lg text-gray-500 line-through">{helpers.moneyFormat(course.price)}</Text>}
      </div>
      {course.is_purchased ? (
        <div className="mb-6 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-center shadow-inner">
          <p className="text-xl font-semibold tracking-wide text-emerald-700">
            ✨ Congratulations! You own this course ✨
          </p>
          <p className="mt-2 text-sm text-emerald-600">
            Enjoy unlimited access to all course materials
          </p>
        </div>
      ) : (
        <button className="mb-4 h-12 w-full rounded-lg bg-gradient-to-r from-[#1a237e] to-[#3949ab] text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-[#3949ab] hover:to-[#1a237e] hover:shadow-xl active:scale-95" onClick={handleAddToCart}>
          <ShoppingCartOutlined className="mr-2 text-xl" />
          {course.is_in_cart ? "View Cart" : "Add to Cart"}
        </button>
      )}
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
      <ShareButton text={course.name} url={window.location.href} image={course.image_url} />
    </Card>
  );
};

export default CourseSidebar;
