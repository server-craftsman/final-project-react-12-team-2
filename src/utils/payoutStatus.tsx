import { PayoutStatus } from "../app/enums";
import { Tag } from "antd";

export const payoutColorStatus = (status: string, newStatus: string) => {
  const effectiveStatus = newStatus || status;

  const statusConfig = {
    [PayoutStatus.NEW]: {
      color: 'blue',
      className: 'bg-gradient-to-r from-blue-400 to-blue-600'
    },
    [PayoutStatus.REQUEST_PAYOUT]: {
      color: 'gold',
      className: 'bg-gradient-to-r from-yellow-300 to-yellow-500'
    },
    [PayoutStatus.COMPLETED]: {
      color: 'green', 
      className: 'bg-gradient-to-r from-green-400 to-green-600'
    },
    [PayoutStatus.REJECTED]: {
      color: 'red',
      className: 'bg-gradient-to-r from-red-400 to-red-600'
    }
  };

  const config = statusConfig[effectiveStatus as keyof typeof statusConfig] || {
    color: 'default',
    className: 'bg-gradient-to-r from-gray-300 to-gray-500'
  };

  if (!statusConfig[effectiveStatus as keyof typeof statusConfig]) {
    console.warn(`Unknown status: ${effectiveStatus}`);
  }

  return (
    <Tag 
      color={config.color}
      className={`${config.className} px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 hover:shadow-lg`}
    >
      {effectiveStatus}
    </Tag>
  );
};
