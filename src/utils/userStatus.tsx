export const userStatusColor = (status: boolean) => {
  return status
    ? "bg-green-100 text-green-700 border border-green-500 rounded-md px-2 py-1 text-xs capitalize"
    : "bg-red-100 text-red-700 border border-red-500 rounded-md px-2 py-1 text-xs capitalize";
};
