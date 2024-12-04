import { useEffect } from "react";

export const useFetchDashboardInstructor = (fetchCourses: () => Promise<void>, fetchSubscribers: () => Promise<void>, fetchUserBalance: () => Promise<void>) => {
  useEffect(() => {
    const fetchData = async () => {
      await fetchCourses();
      await fetchSubscribers();
      await fetchUserBalance();
    };

    fetchData();
  }, [fetchCourses, fetchSubscribers, fetchUserBalance]);
};