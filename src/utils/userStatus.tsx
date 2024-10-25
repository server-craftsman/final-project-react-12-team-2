export const userStatusColor = (status: boolean) => {
  return status
    ? "bg-gradient-to-r from-emerald-50 to-green-100 text-green-700 border-2 border-green-400 shadow-sm shadow-green-200 rounded-lg px-3 py-1.5 text-sm font-medium capitalize tracking-wide"
    : "bg-gradient-to-r from-rose-50 to-red-100 text-red-700 border-2 border-red-400 shadow-sm shadow-red-200 rounded-lg px-3 py-1.5 text-sm font-medium capitalize tracking-wide";
};
