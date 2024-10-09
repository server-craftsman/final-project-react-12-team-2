
import BuyerProfileChart from '../../components/admin/BuyerProfileChart'
import DashBoard from '../../components/admin/DashBoard'
import PopularProduct from '../../components/admin/PopularProduct'
import RecentOrder from '../../components/admin/RecentOrder'
import TransactionChart from '../../components/admin/TransactionChart'

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
