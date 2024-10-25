/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReadOutlined, UserOutlined } from "@ant-design/icons";

const DashBoard = () => {
  return (
    <>
      <div className="flex w-full gap-4">
        <BoxWrapper>
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-sky-500">
            <UserOutlined className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="ml-2 font-medium text-black">User</span>
            <div className="flex items-center">
              <strong className="text-xl font-semibold text-gray-700">50,000</strong>
              <span className="pl-2 text-sm text-green-500">+140</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-orange-500">
            <ReadOutlined className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="ml-2 font-medium text-black">Course</span>
            <div className="flex items-center">
              <strong className="text-xl font-semibold text-gray-700">50,000</strong>
              <span className="pl-2 text-sm text-green-500">+140</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-green-500">
            <ReadOutlined className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="ml-2 font-medium text-black">Complete</span>
            <div className="flex items-center">
              <strong className="text-xl font-semibold text-gray-700">50,000</strong>
              <span className="pl-2 text-sm text-green-500">+140</span>
            </div>
          </div>
        </BoxWrapper>
      </div>
    </>
  );
};

export default DashBoard;

function BoxWrapper({ children }: any) {
  return <div className="flex flex-1 items-center rounded-sm border border-gray-200 bg-white p-4">{children}</div>;
}
