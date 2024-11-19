import { createContext, useContext, useState, ReactNode } from "react";
import Loading from "../app/redux/Loading";
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  message: ReactNode | null;
  showLoading: (message: ReactNode) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<ReactNode | null>(null);

  const showLoading = (msg: ReactNode) => {
    setMessage(msg);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setMessage(null);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loading />}
      <LoadingContext.Provider value={{ isLoading, setIsLoading, message, showLoading, hideLoading }}>
        {children}
      </LoadingContext.Provider>
    </>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};