# Edu Learn - Online Learning Platform

Edu Learn is a modern, feature-rich online learning platform built with React, TypeScript, and Vite. It offers a seamless experience for both students and instructors, with a focus on interactive learning and course management.

## Demo

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://final-project-react-12-team-2.vercel.app/)

## Features

- **User-friendly Interface**: Clean and intuitive design for easy navigation.
- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile devices.
- **Course Catalog**: Browse a wide range of courses across various categories.
- **User Authentication**: Secure login and registration system.
- **Admin Dashboard**: Comprehensive admin panel for managing users, courses, and site content.
- **Instructor Tools**: Dedicated features for course creation and management.
- **Student Dashboard**: Personalized learning experience with progress tracking.
- **Dynamic Home Page**: Engaging cover section with animated text slider and course mockups.
- **Advanced Search**: Efficient course search functionality.
- **Shopping Cart**: Easy-to-use cart system for course purchases.
- **Payout Management**: Streamlined payout process for instructors.
- **Data Visualization**: Interactive charts for admin analytics.

## Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Ant Design
- **Animations**: Framer Motion
- **Routing**: React Router
- **State Management**: React Context API
- **Charts**: Recharts

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

The project follows a modular structure:

- `src/components`: Reusable UI components
  - `generic`: Generic components for the website
  - `instructor`: Instructor-specific components
  - `student`: Student-specific components
  - `admin`: Admin dashboard components
- `src/pages`: Main page components
  - `admin`: Admin dashboard pages
  - `instructor`: Instructor dashboard pages
  - `student`: Student dashboard pages
  - `home`: Home page components
  - `login`: Login page components
  - `register`: Register page components
- `src/layout`: Layout components for different user roles
- `src/routes`: Route definitions
  - `publish`: Publish routes
  - `protected`: Protected routes
  - `admin`: Admin routes
  - `instructor`: Instructor routes
  - `student`: Student routes
  - `common`: Common routes
- `src/utils`: Utility functions
- `src/models`: TypeScript interfaces and types
- `src/context`: React context for state management
- `src/data`: Mock data for development
- `src/const`: Constant values and lazy-loaded components

## Key Components

### User Experience

- **MainNavbar**: Responsive navigation bar with dynamic menu items and search functionality.
- **Cover**: Engaging hero section with animated text and course mockups.
- **Courses**: Dynamic course listing with category filtering and pagination.
- **InstructorSlider**: Showcase of top instructors.

### Admin Dashboard

- **AdminNavbar**: Comprehensive sidebar navigation for admin functions.
- **DashBoard**: Overview of key metrics and recent activities.
- **TransactionChart**: Visual representation of financial data.
- **BuyerProfileChart**: Pie chart displaying user demographics.

### Instructor Tools

- **CourseManagement**: Interface for creating and editing courses.
- **PayoutManagement**: System for managing instructor earnings and withdrawals.

### Student Dashboard

- **StudentDashboardNavbar**: Navigation for student-specific features.
- **OrderManagement**: View and manage course purchases.
- **LearningProgress**: Track course completion and achievements.

## Styling

The project uses a combination of Tailwind CSS for utility classes and custom CSS for specific components. The design follows a cohesive color scheme with gradients and modern UI elements.

## Future Enhancements

- Implement real backend integration
- Add payment processing for course purchases
- Enhance the course creation interface for instructors
- Implement a rating and review system for courses

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
