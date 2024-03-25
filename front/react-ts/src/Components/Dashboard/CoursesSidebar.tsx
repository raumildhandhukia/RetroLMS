import { CircleUser, LogOut, LucideIcon, LucideProps, X } from 'lucide-react'
import React from 'react'
import './CoursesSidebar.css'
import { Courses } from '.'

interface CoursesSidebarProps {
    onClose: () => void; 
    onCourseClick: (description: string) => void;
    courses: Courses[];
  }
  
const CoursesSidebar: React.FC<CoursesSidebarProps> = ({ onClose, courses,  onCourseClick}) => {
  const handleCourseClick = (description: string) => {
    // Pass the clicked course description to the parent function
    onCourseClick(description);
};
  return (
    <div>
      <div className='header-container'>
          <h1 className='heading'>Courses</h1>
          <div className='close-button'>
            <X onClick={onClose} />
          </div>
        </div>
        <hr />
        <h2 className='second-heading'>All courses</h2>
        <hr />
        <div>
        {courses.map(course => (
          <h3 className='third-heading' key={course._id} onClick={() => {
            onClose(); // Close the sidebar
            handleCourseClick(course.title); // Handle the course click
        }}>{course.title}</h3>
        ))}
      </div>
      </div>
    );
  };
  
  export default CoursesSidebar;