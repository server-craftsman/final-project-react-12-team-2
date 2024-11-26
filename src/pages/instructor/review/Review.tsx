import { useState } from "react";
import Reviews from "../../../components/instructor/review/Reviews";
import CustomSearch from "../../../components/generic/search/CustomSearch";
const Review = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setRefreshKey((prevKey) => prevKey + 1);
  };
  return (
    <div>
      <CustomSearch onSearch={handleSearch} placeholder="Search Reviews" className="search-input" />
      <Reviews searchTerm={searchTerm} refreshKey={refreshKey} />
    </div>
  );
};

export default Review;
