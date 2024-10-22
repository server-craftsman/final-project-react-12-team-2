// Example of "toggleLoading" action in Redux

import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { toggleLoading as toggleLoadingFromSlice } from "./loadingSlice";

export const useToggleLoading = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (isLoading: boolean) => dispatch(toggleLoadingFromSlice(isLoading));
};
