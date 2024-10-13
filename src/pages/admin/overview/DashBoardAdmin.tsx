import BuyerProfileChart from "../../../components/admin/overview/BuyerProfileChart";
import DashBoard from "../../../components/admin/overview/DashBoard";
import PopularProduct from "../../../components/admin/overview/PopularProduct";
import RecentOrder from "../../../components/admin/overview/RecentOrder";
import TransactionChart from "../../../components/admin/overview/TransactionChart";

const DashBoardAdmin = () => {
  return (
    <div className="flex flex-col gap-4">
      <DashBoard />
      <div className="flex w-full flex-row gap-4">
        <TransactionChart />
        <BuyerProfileChart />
      </div>
      <div className="flex w-full flex-row gap-4">
        <RecentOrder />
        <PopularProduct />
      </div>
    </div>
  );
};

export default DashBoardAdmin;
