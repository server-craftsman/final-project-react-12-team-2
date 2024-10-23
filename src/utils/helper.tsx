export const formatDate = (date: Date) => {
  const formattedDate = new Date(date).toLocaleDateString("en-CA");
  return formattedDate;
};

export const moneyFormat = (money: number) => {
  return money
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    .replace(/\./g, ",");
};

export const formatParamsString = (params: Record<string, any>) => {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
};
