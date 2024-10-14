import { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchUser = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(query);
    }, 300); // Delay for debouncing

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  return (
    <div className="mb-4 flex items-center justify-end">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search user ..."
        suffix={<SearchOutlined />}
        className="rounded-md border"
      />
    </div>
  );
};

export default SearchUser;
