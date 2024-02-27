import { CircleUser, LogOut, LucideIcon, LucideProps, X } from 'lucide-react'
import React from 'react'
import './CoursesSidebar.css'

interface CoursesSidebarProps {
    onClose: () => void; 
  }
  
const CoursesSidebar: React.FC<CoursesSidebarProps> = ({ onClose }) => {
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
        <h3 className='third-heading'>SER 517</h3>
      </div>
    );
  };
  
  export default CoursesSidebar;