import React, { useState, useMemo } from "react";
import { Input, Button } from "antd";
// If using Ant Design icons, import the specific icon
import { SearchOutlined } from "@ant-design/icons";
import { UserRoles } from "../../../app/enums";
interface SearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
  role?: UserRoles | null;
  status?: boolean | null;
  applyFilters?: () => void;
}

const CustomSearch: React.FC<SearchProps> = ({ onSearch, placeholder = "Search...", className, applyFilters }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchTerm);
    applyFilters?.();
  };

  const memoizedPlaceholder = useMemo(() => `🔍 ${placeholder}`, [placeholder]);

  return (
    <div className={`flex items-center ${className}`}>
      <Input
        placeholder={memoizedPlaceholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="w-64 rounded-l-lg border-2 border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-[#1a237e] focus:outline-none"
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          height: "40px"
        }}
      />
      <Button
        type="primary"
        onClick={handleSearchSubmit}
        className="rounded-r-lg border-2 border-[#1a237e] bg-[#1a237e] px-6 font-medium text-white transition-colors hover:bg-blue-700"
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginLeft: "5px",
          height: "40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <SearchOutlined className="text-xl" />
      </Button>
    </div>
  );
};

export default React.memo(CustomSearch);
