export const formatDate = (date: Date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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
        <span className="capitalize py-1 px-2 rounded-md text-xs text-blue-600 bg-blue-100">
          {normalizedStatus.replace("_", " ").toLowerCase()}
        </span>
      );
    case "DRAFT":
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-orange-600 bg-orange-100">
          {normalizedStatus.replace("_", " ").toLowerCase()}
        </span>
      );

    default:
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
          {normalizedStatus?.replace("_", " ").toLowerCase() ||
            "unknown status"}
        </span>
      );
  }
}
