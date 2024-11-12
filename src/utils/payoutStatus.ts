import { PayoutStatus } from "../app/enums";

export const payoutColorStatus = (status: string) => {
  switch (status) {
    case PayoutStatus.NEW:
      return "primary";
    case PayoutStatus.REQUEST_PAYOUT:
      return "warning";
    case PayoutStatus.COMPLETED:
      return "success";
  }
};
