/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReadOutlined, UserOutlined } from '@ant-design/icons';

const DashBoard = () => {
  return (
    <>
      <div className='flex gap-4 w-full'>
        <BoxWrapper>
           <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500 cursor-pointer '>
           <UserOutlined className="text-2xl text-white" /> 
           </div>
          <div className='pl-4'>
           <span className='text-black font-medium ml-2'>User</span>
           <div className='flex items-center'>
           <strong className='text-xl text-gray-700 font-semibold' >50,000</strong>
           <span className='text-sm text-green-500 pl-2'>+140</span>
           </div>
           </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-500 cursor-pointer '>
        <ReadOutlined className="text-2xl text-white" />
          </div>
          <div className='pl-4'>
           <span className='text-black font-medium ml-2'>Course</span>
           <div className='flex items-center'>
           <strong className='text-xl text-gray-700 font-semibold' >50,000</strong>
           <span className='text-sm text-green-500 pl-2'>+140</span>
           </div>
           </div>
        </BoxWrapper>
        <BoxWrapper >
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-500 cursor-pointer '>
        <ReadOutlined className="text-2xl text-white" />
          </div>
          <div className='pl-4'>
           <span className='text-black font-medium ml-2'>Complete</span>
           <div className='flex items-center'>
           <strong className='text-xl text-gray-700 font-semibold' >50,000</strong>
           <span className='text-sm text-green-500 pl-2'>+140</span>
           </div>
           </div>
        </BoxWrapper>
  
      </div>
    </>
  );
}

export default DashBoard;

function BoxWrapper({ children }: any) {
  return (
    <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center  '>{children}</div>
  )
}
