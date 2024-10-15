export const formatDate = (date: Date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-CA");
  return formattedDate;
};

export const moneyFormat = (money: number) => {
  return money
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    .replace(/\./g, ",");
};

export function getOrderStatus(status: string) {
  // Normalize the status to uppercase for comparison
  const normalizedStatus = status?.toUpperCase();

  // Return a styled string or JSX element for different statuses
  switch (normalizedStatus) {
    case "PUBLISHED":
      return (
        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs capitalize text-blue-600">
          {normalizedStatus.replace("_", " ").toLowerCase()}
        </span>
      );
    case "DRAFT":
      return (
        <span className="rounded-md bg-orange-100 px-2 py-1 text-xs capitalize text-orange-600">
          {normalizedStatus.replace("_", " ").toLowerCase()}
        </span>
      );
    case "APPROVE":
      return (
        <span className="rounded-md bg-green-100 px-2 py-1 text-xs capitalize text-green-600">
          {normalizedStatus.replace("_", " ").toLowerCase()}
        </span>
      );
    case "BLOCK":
      return (
        <span className="rounded-md bg-red-100 px-2 py-1 text-xs capitalize text-red-600">
          {normalizedStatus.replace("_", " ").toLowerCase()}
        </span>
      );

    default:
      return (
        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs capitalize text-gray-600">
          {normalizedStatus?.replace("_", " ").toLowerCase() ||
            "unknown status"}
        </span>
      );
  }
}
