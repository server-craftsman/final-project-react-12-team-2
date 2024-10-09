
import BuyerProfileChart from '../../../components/admin/overview/BuyerProfileChart'
import DashBoard from '../../../components/admin/overview/DashBoard'
import PopularProduct from '../../../components/admin/overview/PopularProduct'
import RecentOrder from '../../../components/admin/overview/RecentOrder'
import TransactionChart from '../../../components/admin/overview/TransactionChart'

const DashBoardAdmin = () => {
  return (
    <div className='flex flex-col gap-4'>
      <DashBoard/>
      <div className='flex flex-row gap-4 w-full'>
      <TransactionChart/>
      <BuyerProfileChart/>
      </div>
      <div className='flex flex-row gap-4 w-full'>
        <RecentOrder/>
        <PopularProduct/>
      </div>

    </div>
  )
}

export default DashBoardAdmin
