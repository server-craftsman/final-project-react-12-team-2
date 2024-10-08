import { ReadOutlined, UserOutlined } from '@ant-design/icons';

const DashBoard = () => {
  return (
    <>
      <div className="flex justify-start items-center gap-10 p-10"> 
        <div className="w-96 h-48 rounded-lg flex items-center p-4 shadow-2xl cursor-pointer box-border hover:box-content">
          <div className='ml-4 flex-grow'>
            <h3 className="text-lg font-medium text-black">Users</h3>
            <p className="text-2xl font-bold text-black">150</p>
            <span className="text-sm text-black">New Users</span>
          </div>
          <div className='flex justify-center items-center w-20 h-20 bg-orange-500 rounded-md mb-20'>
            <UserOutlined className="text-3xl text-white" />
          </div>
        </div>

        <div className="w-96 h-48 rounded-lg flex items-center p-4 shadow-2xl cursor-pointer box-border hover:box-content">
          <div className='ml-4 flex-grow'>
            <h3 className="text-lg font-medium text-black">Courses</h3>
            <p className="text-2xl font-bold text-black">100,000</p>
            <span className="text-sm text-black">Total Courses</span>
          </div>
          <div className='flex justify-center items-center w-20 h-20 bg-green-500 rounded-md mb-20'>
            <ReadOutlined className="text-3xl text-white" />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;
