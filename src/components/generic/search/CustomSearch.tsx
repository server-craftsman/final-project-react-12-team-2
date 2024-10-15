import React, { useState, useCallback, useMemo } from "react";
import { Input } from "antd";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSearch: React.FC<SearchProps> = ({
  onSearch,
  placeholder = "Search...",
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(value);
    },
    [onSearch]
  );

  const memoizedPlaceholder = useMemo(() => `🔍 ${placeholder}`, [placeholder]);

  return (
    <div className={className}>
      <Input
        placeholder={memoizedPlaceholder}
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default React.memo(CustomSearch);
