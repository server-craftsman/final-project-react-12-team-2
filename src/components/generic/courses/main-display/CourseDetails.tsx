import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { CourseService } from "../../../../services/course/course.service";
import { HomeOutlined, InfoCircleOutlined, StarOutlined, BookOutlined } from "@ant-design/icons";
import { Card, Row, Col, Tabs } from "antd";
import { motion } from "framer-motion";
// import { CartStatusEnum } from "../../../../app/enums";

//==========connect components==========
//tabs
import CourseInsights from "../tabs-course/CourseInsights";
import CourseContent from "../tabs-course/CourseContent";
import CourseReviews from "../tabs-course/CourseReviews";

//subs
import CourseHeader from "../subs-course/CourseHeader";
import CourseSidebar from "../subs-course/CourseSidebar";
import CourseVideoModal from "../subs-course/CourseVideoModal";
import { GetPublicCourseDetailResponse } from "../../../../models/api/responsive/course/course.response.model";
import { ReviewService } from "../../../../services/review/review.service";
import animationData from "../../../../data/courseAnimation.json";
import Lottie from "lottie-react";
//=====================================

// Add this utility function to validate ObjectId
const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

const CourseDetails: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(location.state?.triggerHover || false);
  const reviewId = location.state?.reviewId;

  // Validate the id
  if (!id || !isValidObjectId(id)) {
    return <div className="mt-8 text-center text-2xl">Invalid course ID</div>;
  }

  const [course, setCourse] = useState<any>(null);
  const [instructor, setInstructor] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [discountedPrice, setDiscountedPrice] = useState<string>("0.00");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [courseStatus, setCourseStatus] = useState({ is_in_cart: false, is_purchased: false });
  const [activeTabKey, setActiveTabKey] = useState<string>("1");

    const fetchCourseDetails = async () => {
      if (!id) {
        console.error("Course ID is undefined");
        return;
      }
      try {
        // Fetch course details
        const response = await CourseService.getPublicCourseDetail(id);
        const courseData = response.data.data as GetPublicCourseDetailResponse;

        // Set course status directly from course data
        setCourseStatus({
          is_in_cart: courseData.is_in_cart,
          is_purchased: courseData.is_purchased
        });

        // Set course data
        setCourse(courseData);
        setInstructor(courseData.instructor_id);
        setCategory(courseData.category_name);
        setDiscountedPrice(((courseData.price ?? 0) - ((courseData.discount ?? 0) * (courseData.price ?? 0)) / 100).toFixed(2));

        // Process sessions
        const sessionList = courseData.session_list.map((session) => ({
          ...session,
          _id: session._id
        }));
        setSessions(sessionList);

        // Process lessons
        const lessonList = sessionList.flatMap((session) =>
          session.lesson_list.map((lesson) => ({
            ...lesson,
            _id: lesson._id,
            session_id: session._id
          }))
        );
        setLessons(lessonList);

        setVideoId(courseData.video_url);
        setReviews(courseData.session_list);

        // Define averageRating and reviewCount here
        setAverageRating(courseData.average_rating ?? 0);
        setReviewCount(courseData.review_count ?? 0);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    };
  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await ReviewService.searchForReview({
          searchCondition: {
            course_id: id,
            rating: 0,
            is_instructor: false,
            is_rating_order: false,
            is_deleted: false
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        });
        setReviews(response.data.data.pageData);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    if (activeTabKey === "3") {
      // Clear existing reviews
      setReviews([]);
      // Fetch reviews again when switching to the "Reviews" tab
      fetchReviews();
    }
  }, [activeTabKey, id]);

  useEffect(() => {
    if (isHovered) {
      // Optionally, reset hover state after some time
      const timer = setTimeout(() => setIsHovered(false), 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  useEffect(() => {
    // if (reviewId) {
    //   // Logic to scroll to or highlight the specific review
    //   // This could be a ref or a scrollIntoView call
    //   console.log("Highlight review with ID:", reviewId);
    // }
  }, [reviewId]);

  const showVideoModal = () => {
    if (videoId) {
      setIsModalVisible(true);
    } else {
      console.error("Video URL is not available");
    }
  };

  const handleCancel = () => {
    // Reset video playback by forcing video element to pause and reset time
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
    setIsModalVisible(false);
  };

  const handleTabChange = (key: string): void => {
    setActiveTabKey(key);
  };

  const handlePreviewClick = () => {
    setIsHovered(true);
    // Optionally, reset hover state after some time
    setTimeout(() => setIsHovered(false), 3000); // 3 seconds
  };

  const handleReviewUpdate = async () => {
    await fetchCourseDetails();
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="tab-title bg-gradient-tone rounded-full px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <InfoCircleOutlined className="text-gold mr-2 animate-pulse" />
          <span className="font-semibold tracking-wide">Course Insights</span>
        </span>
      ),
      children: course ? <CourseInsights course={course} instructor={instructor} content={course.content} /> : null
    },
    {
      key: "2",
      label: (
        <span className="tab-title bg-gradient-tone rounded-full px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <BookOutlined className="text-gold mr-2 animate-pulse" />
          <span className="font-semibold tracking-wide">Course Content</span>
        </span>
      ),
      children: course ? <CourseContent course={course} sessions={sessions} lessons={lessons} courseId={course?._id} activeSessionId={activeSessionId} setActiveSessionId={setActiveSessionId} /> : null
    },
    {
      key: "3",
      label: (
        <span className="tab-title bg-gradient-tone rounded-full px-4 py-2 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <StarOutlined className="text-gold mr-2 animate-pulse" />
          <span className="font-semibold tracking-wide">Reviews</span>
        </span>
      ),
      children: course ? (
        <CourseReviews
          reviews={reviews}
          users={course.users}
          courseId={course._id}
          course={course}
          averageRating={averageRating}
          reviewCount={reviewCount}
          onReviewUpdate={handleReviewUpdate} // Pass the callback function
        />
      ) : null
    }
  ];

  if (course) {
    return (
      <div className="min-h-screen w-full bg-white py-12">
        <div className="container mx-auto">
          <Link to="/" className="mb-6 flex items-center text-[#1a237e] hover:text-[#1a237e]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3949ab] px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:transform hover:from-[#3949ab] hover:to-[#1a237e] hover:shadow-xl active:scale-95"
              onClick={handlePreviewClick}
            >
              <HomeOutlined className="text-xl" />
              Back to Home
            </motion.button>
          </Link>
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <Card className={`overflow-hidden rounded-lg text-left shadow-lg ${isHovered ? 'hover-effect-class' : ''}`}>
                <CourseHeader course={course} category={category} instructor={instructor} showVideoModal={() => showVideoModal()} />
                <div className="p-4 text-left">
                  <Tabs
                    defaultActiveKey="1"
                    className="custom-tabs"
                    animated={{ inkBar: true, tabPane: true }}
                    tabBarStyle={{
                      marginBottom: "24px",
                      borderBottom: "2px solid #f0f0f0"
                    }}
                    tabBarGutter={32}
                    items={tabItems}
                    onChange={handleTabChange}
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <CourseSidebar course={course} lessons={lessons} discountedPrice={discountedPrice} courseStatus={courseStatus} />
            </Col>
          </Row>
        </div>
        <CourseVideoModal isModalVisible={isModalVisible} handleCancel={handleCancel} videoId={videoId} />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Lottie height={400} width={400} animationData={animationData} />
      </div>
    );
  }
};

export default CourseDetails;
