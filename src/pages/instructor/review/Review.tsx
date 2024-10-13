import { useState } from "react";
import Reviews from "../../../components/instructor/review/Reviews";
import SearchReview from "../../../components/instructor/review/SearchReview";

const Review = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div>
      <SearchReview onSearch={setSearchTerm} />
      <Reviews searchTerm={searchTerm} />
    </div>
  );
};

export default Review;
