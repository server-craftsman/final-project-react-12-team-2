import { BankOutlined, ReadOutlined, UserOutlined, ShoppingOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Setting } from "../../../models/api/responsive/admin/setting.response.model";
import { helpers } from "../../../utils";

const DashBoard = ({ settings, totalBlogs, totalUsers, totalCourses, totalCategories }: { settings: Setting, totalBlogs: number, totalUsers: number, totalCourses: number, totalCategories: number }) => {
  const boxes = [
    {
      icon: <UserOutlined className="text-2xl text-white" />,
      label: "Total Revenue",
      value: helpers.moneyFormat(settings?.balance_total || 0),
      gradient: "from-blue-400 to-blue-600",
      hoverShadow: "hover:shadow-blue-200"
    },
    {
      icon: <ShoppingOutlined className="text-2xl text-white" />,
      label: "Total Users", 
      value: helpers.formatNumber(totalUsers),
      gradient: "from-purple-400 to-purple-600",
      hoverShadow: "hover:shadow-purple-200"
    },
    {
      icon: <BankOutlined className="text-2xl text-white" />,
      label: "Total Courses",
      value: helpers.formatNumber(totalCourses),
      gradient: "from-orange-400 to-orange-600", 
      hoverShadow: "hover:shadow-orange-200"
    },
    {
      icon: <AppstoreOutlined className="text-2xl text-white" />,
      label: "Categories",
      value: helpers.formatNumber(totalCategories),
      gradient: "from-emerald-400 to-emerald-600",
      hoverShadow: "hover:shadow-emerald-200"
    },
    {
      icon: <ReadOutlined className="text-2xl text-white" />,
      label: "Total Blogs",
      value: helpers.formatNumber(totalBlogs),
      gradient: "from-rose-400 to-rose-600",
      hoverShadow: "hover:shadow-rose-200" 
    }
  ];

    return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {boxes.map((box, index) => (
          <BoxWrapper key={index}>
            <div className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r ${box.gradient} shadow-xl transition-all duration-300 hover:scale-110 ${box.hoverShadow}`}>
              {box.icon}
            </div>
            <div className="pl-4">
              <span className="text-sm font-medium uppercase tracking-wider text-gray-500">{box.label}</span>
              <div className="flex items-center">
                <strong className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                  {box.value}
                </strong>
              </div>
            </div>
          </BoxWrapper>
        ))}
        </div>
      </>
    );
  
};

export default DashBoard;

function BoxWrapper({ children }: any) {
  return (
    <div className="flex flex-1 items-center rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:border-gray-200 hover:shadow-xl">
      {children}
    </div>
  );
}
