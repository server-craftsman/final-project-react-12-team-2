import { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchPaymentProps {
  onSearch: (query: string) => void; // Typing cho onSearch prop
}

const SearchPayment: React.FC<SearchPaymentProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(query);
    }, 300); // Delay for debouncing

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  return (
    <div className="mb-4 flex items-center">
      <Input
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        } // Typing cho sự kiện onChange
        placeholder="Search payment..."
        suffix={<SearchOutlined />}
        className="rounded-md border"
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default SearchPayment;
