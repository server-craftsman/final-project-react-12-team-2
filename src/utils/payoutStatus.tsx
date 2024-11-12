import { PayoutStatus } from "../app/enums";
import { Tag } from "antd";

export const payoutColorStatus = (status: string, newStatus: string) => {
  const effectiveStatus = newStatus || status; // Use newStatus if available

  let color = "default"; // Default color

  switch (effectiveStatus) {
    case PayoutStatus.NEW:
      color = "blue";
      break;
    case PayoutStatus.REQUEST_PAYOUT:
      color = "gold";
      break;
    case PayoutStatus.COMPLETED:
      color = "green";
      break;
    case PayoutStatus.REJECTED:
      color = "red";
      break;
    default:
      console.warn(`Unknown status: ${effectiveStatus}`); // Log if status is unknown
  }

  return <Tag color={color}>{effectiveStatus}</Tag>;
};
