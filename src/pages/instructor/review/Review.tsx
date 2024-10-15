import { useState } from "react";
import Reviews from "../../../components/instructor/review/Reviews";
import CustomSearch from "../../../components/generic/search/CustomSearch";
const Review = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div>
      <CustomSearch
        onSearch={setSearchTerm}
        placeholder="Search Reviews"
        className="search-input"
      />
      <Reviews searchTerm={searchTerm} />
    </div>
  );
};

export default Review;
