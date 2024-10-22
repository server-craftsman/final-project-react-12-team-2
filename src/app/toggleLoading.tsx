import { useDispatch } from "react-redux";
import { toggleLoading } from "./loadingSlice";

export const useToggleLoading = () => {
  const dispatch = useDispatch();
  return (isLoading: boolean) => {
    dispatch(toggleLoading(isLoading));
  };
};
