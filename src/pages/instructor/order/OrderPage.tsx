import { lazy } from "react"
import { Tabs } from 'antd';

const WaitingPaid = lazy(
  () => import("../../../components/instructor/order/WaitingPaid")
);
const Completed = lazy(
  () => import("../../../components/instructor/order/Completed")
);

const OrderPage = () => {
  const items = [
    {
      label: 'Waiting Paid',
      key: '1',
      children: <WaitingPaid />,
    },
    {
      label: 'Completed',
      key: '2',
      children: <Completed />,
    },
  ];

  return (
    <Tabs defaultActiveKey="1" items={items} />
  )
}

export default OrderPage
