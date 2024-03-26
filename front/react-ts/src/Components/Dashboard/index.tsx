import React, { JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, useParams, Routes, Outlet, useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import CoursesSidebar from './CoursesSidebar';
import { CircleUser, LogOut } from 'lucide-react';
import Card from './Card';
import asulogo from '../../asu.png'
import {Link} from "react-router-dom";
import CourseDetailPage from '../../CourseDetailPage';
import Leaderboard from '../Leaderboard/Leaderboard';
import Tasks from '../Task/Tasks';
import Items from '../Shop/Items';

export interface Course {
    id: number;
    name: string;
    description: string;
    studentsEnrolled: number;
    highestScore: number;
    highestScorer: string;
    content: string;
}

export interface ISidebarItem {
    name: "Account" | "Logout" | "MyCourses" | "Dashboard";
}

const details= "SER 517: Software Factory Capstone (2024 Spring)\n" +
    "Welcome to SER 517!\n" +
    "\n" +
    "Course Instructor:\n" +
    "\n" +
    " Dr. Nouh Alhindawi,  nalhinda@asu.edu\n" +
    "\n" +
    "Office Hours: Tuesdays and Thursdays 11:00 - 12:00 - or by appointment\n" +
    "\n" +
    "Zoom Link: https://asu.zoom.us/j/4154409963Links to an external site. \n" +
    "\n" +
    " \n" +
    "\n" +
    "Course TA : James Smith , jsmit106@asu.edu - Office Hours: Mondays and Wednesdays 1:00p - 2:00p (https://asu.zoom.us/my/jsmit106Links to an external site.)\n" +
    "\n" +
    "Course Grade : Anmol Girish More, amore9@asu.edu \n" +
    "\n" +
    "Course Grade : Smit Ashokbhai Jasani,   sjasani2@asu.edu\n" +
    "\n" +
    " \n" +
    "\n" +
    "Make sure to review the course Syllabus for further details and information.\n" +
    "The course content will be added to the Modules section.\n" +
    "\n" +
    "I'm looking forward to meeting you all in class.";

const Dashboard: React.FC = () => {
    const [role, setRole] = useState<string>('');
    useEffect(() => {
      const checkProfile = async () => {
        try {
          const response = await fetch("http://localhost:8080/profile", {
            method: "GET",
            credentials: "include", // Include cookies in the request
          });
          if (response.ok) {
            const data = await response.json();
            setRole(data.role);
          } else {
            console.log("User not found");
          }
        } catch (error) {
          console.error("Error checking for profile", error);
        }
      };
  
      checkProfile();
    }, []);
    const coursesData: Course[] = [
        { id: 1, name: 'Course 1', description: 'Software Agility', studentsEnrolled: 20, highestScore: 95, highestScorer: 'Student A', content:details},
        { id: 2, name: 'Course 2', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B', content:details },
        { id: 3, name: 'Course 3', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B', content:details },
        { id: 4, name: 'Course 4', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B', content:details },
        { id: 5, name: 'Course 5', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B', content:details }
    ];

    const sidebarItems: ISidebarItem[] = [
        { name: "Account" },
        { name: "Dashboard"},
        { name: "MyCourses" },
        { name: "Logout" }
    ]
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<React.ReactNode | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<string>('Home');
    const navigate = useNavigate();

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    const handleCourseClick = (description: string) => {
        setSelectedCourse(description);
        setSelectedItem('Home');
    };

    const menuItems = ['Home', 'Tasks', 'LeaderBoard', 'BuyItems'];
    if(role === 'instructor') {
        menuItems.push('Grading Submission')
    }

    const handleItemClick = (item: string) => {
        setSelectedItem(item);
    };
    
    const handleIconClick = (iconName: string) => {
        switch (iconName) {
            case 'Account':
                setSelectedComponent(<div>Account Component</div>);
                break;
            case 'MyCourses':
                setSelectedComponent(<CoursesSidebar onClose={handleCloseSidebar} courses={coursesData} onCourseClick={handleCourseClick}/>);
                setSidebarOpen(!isSidebarOpen);
                break;
            case 'Logout':
                navigate('/login');
                break;
            case 'Dashboard':
                setSelectedComponent(null);
                setSelectedCourse('');
                setSelectedItem('');
                break;
            default:
                setSelectedComponent(null);
                break;
        }
    };

    return (
        <div className="container flex">
          <div className="w-20 bg-gray-100 h-lvh flex flex-col">
             <img src={asulogo} />
              {sidebarItems.map(sidebarItem =>
                  <SidebarItem key={sidebarItem.name} name={sidebarItem.name} onClick={handleIconClick} role={role}/>
              )}
          </div>
           {isSidebarOpen && (
                <div className="overlay">
                    {selectedComponent}
                </div>
            )}
            <div className="flex flex-1 p-10 flex-col">
            {selectedCourse ? (<div>
                    <div>
                    <p className='text-2xl'>{selectedCourse}</p>
                    {role === 'student' ? (
                        <div className='text-2xl'>Currency balance: 150$</div>
                     ) : null}
                    </div>
                <hr/>
                <div className='main-content'>
                    <div>
                        {menuItems.map((item, index) => <div className='text-1xl custom-styling' onClick={() => handleItemClick(item)}>{item}</div>)}
                    </div>
                    <div className='detail-container'>
                    {selectedItem === 'Home' && <CourseDetailPage />}
                    {selectedItem === 'LeaderBoard' && <Leaderboard />}
                    {selectedItem === 'Tasks' && <Tasks />}
                    {selectedItem === 'BuyItems' && <Items />}
                    </div>
                </div>
               
            </div>) : (<div>
                <p className="text-3xl">Dashboard</p>
                <div className='w-full flex flex-wrap mt-10'>
                    {coursesData.map(course => <Card {...course} onCardClick={handleCourseClick}/>)}
                </div>
            </div>) }
            </div>
            {/* <Routes>
                <Route path="/dashboard/home" element={<Outlet />} />
            </Routes> */}
        </div>

    );
}

export default Dashboard;