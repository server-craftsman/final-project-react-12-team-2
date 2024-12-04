import Introduction from "../../../components/instructor/overview/Introduction";
import LatestTransaction from "../../../components/instructor/overview/LatestTransaction";
const Dashboard = () => {
  return (
    <div>
      <Introduction isLoading={false} />
      <LatestTransaction />
    </div>
  );
};

export default Dashboard;
