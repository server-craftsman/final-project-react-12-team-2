import React, { useEffect, useState } from "react";
import { formatDate } from "../../../utils/helper";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { ReviewService } from "../../../services/review/review.service";
import { SearchForReviewResponseModel } from "../../../models/api/responsive/review/review.response.model";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
// import moment from "moment";

interface ReviewsProps {
  searchTerm: string;
  refreshKey: number;
}

const Reviews: React.FC<ReviewsProps> = ({ searchTerm, refreshKey }) => {
  const [reviews, setReviews] = useState<SearchForReviewResponseModel["pageData"]>([]);
  const [filteredReviews, setFilteredReviews] = useState<SearchForReviewResponseModel["pageData"]>([]);
  // const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  // const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const searchCondition = {
          course_id: "",
          rating: 0,
          is_instructor: true, //check token
          is_rating_order: false,
          is_deleted: false,
          // ...(startDate ? { start_date: startDate.format("YYYY-MM-DD") } : {}),
          // ...(endDate ? { end_date: endDate.format("YYYY-MM-DD") } : {})
        };

        const response = await ReviewService.searchForReview({
          searchCondition,
          pageInfo: {
            pageNum: currentPage,
            pageSize: pageSize
          }
        });
        setReviews(response.data.data.pageData as unknown as SearchForReviewResponseModel["pageData"]);
        setTotalItems(response.data.data.pageInfo.totalItems);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [ refreshKey, currentPage, pageSize]);

  useEffect(() => {
    const filtered = reviews.filter(review =>
      review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReviews(filtered);
  }, [reviews, searchTerm]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <StarFilled key={i} className="text-yellow-500" /> : <StarOutlined key={i} className="text-yellow-500" />);
    }
    return stars;
  };

  const handleViewOriginalComment = (courseId: string, reviewId: string) => {
    navigate(`/course/${courseId}`, { state: { reviewId } });
  };

  // Function to group reviews by date
  const groupReviewsByDate = (reviews: any) => {
    return reviews.reduce((groups: any, review: any) => {
      const date = formatDate(new Date(review.created_at));
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(review);
      return groups;
    }, {});
  };

  const groupedReviews = groupReviewsByDate(filteredReviews);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 text-xl font-bold text-gray-800">
        Total Reviews: {totalItems}
      </div>
      
      {/* <div className="mb-4 flex gap-4">
        <DatePicker
          placeholder="Start Date"
          onChange={(date) => setStartDate(date)}
          value={startDate}
        />
        <DatePicker
          placeholder="End Date"
          onChange={(date) => setEndDate(date)}
          value={endDate}
        />
      </div> */}

      {Object.keys(groupedReviews).map((date) => (
        <div key={date} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">{date}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {groupedReviews[date].map((review: any) => (
              <div key={review._id} className="rounded-lg bg-white p-5 shadow-md transition-transform duration-300 hover:scale-105">
                <div className="flex items-center mb-4">
                  <img src={`https://ui-avatars.com/api/?name=${review.reviewer_name[0]}`} alt={review.reviewer_name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{review.reviewer_name}</h3>
                    <p className="text-sm text-gray-500">{formatDate(new Date(review.created_at))}</p>
                  </div>
                </div>
                <p className="mb-4 text-gray-600">
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8 3a1 1 0 100-2 1 1 0 000 2zm1-7a1 1 0 00-2 0v4a1 1 0 002 0V6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {review.comment}
                </p>
                <div className="mb-3 flex items-center gap-2">Rating: {renderStars(review.rating)}</div>
                <button
                  onClick={() => handleViewOriginalComment(review.course_id, review._id)}
                  className="mt-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-2 text-white shadow-md transition-all duration-300 hover:from-blue-600 hover:to-teal-600 hover:shadow-lg"
                >
                  View Original Comment
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={['10', '20', '50']}
      />
    </div>
  );
};

export default Reviews;
