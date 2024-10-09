import { Card } from 'antd';

// Define the course interface
interface Course {
  id: string;
  name: string;
  description: string;
  video_url: string;
  image_url: string;
}

// List of courses
const courses: Course[] = [
  {
    id: '1',
    name: 'Introduction to React',
    description: 'Learn the basics of React development',
    video_url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
  },
  {
    id: '2',
    name: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts',
    video_url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
  },
  {
    id: '3',
    name: 'Python for Data Science',
    description: 'Explore data science with Python',
    video_url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png',
  },
  {
    id: '4',
    name: 'Machine Learning Fundamentals',
    description: 'Get started with machine learning',
    video_url: 'https://www.youtube.com/watch?v=mJeNghZXtMo',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Hey_Machine_Learning_Logo.png',
  },
  {
    id: '5',
    name: 'iOS App Development with Swift',
    description: 'Learn to build iOS apps using Swift',
    video_url: 'https://www.youtube.com/watch?v=comQ1-x2a1Q',
    image_url: 'https://developer.apple.com/assets/elements/icons/swift/swift-64x64_2x.png',
  }
  
];

// The component to display courses
const CourseList = () => {
  // Inline style for hover animation and card appearance
  const cardStyle = {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  // const cardHoverStyle = {
  //   transform: 'translateY(-10px)',
  //   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  // };

  const imgStyle = {
    borderRadius: '8px 8px 0 0', 
    width: "100%",
    maxWidth: "330px",
    // textAlign: "center",
    margin: "0 30px",
  };

  const cardBodyStyle = {
    padding: '16px', // Tidy up the padding inside the card
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Purchased Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            hoverable
            style={cardStyle}
            className="course-card" // Optional class if you want to add any other styles later
            cover={<img alt={course.name} src={course.image_url} style={imgStyle} />}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-10px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={cardBodyStyle}>
              <Card.Meta title={course.name} description={course.description} />
              <a
                href={course.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-blue-500 underline"
              >
                Watch Course Video
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
