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
import CreateCourse from './CreateCourse';
import { ok } from 'assert';
import DeletePrompt from './DeletePrompt';
import GradingSubmission from '../GradingSubmission/GradingSubmission';
import Profile from './Profile';

export interface Course {
    _id: string;
    title: string;
    courseKey: string;
    details: string;
}

export interface ISidebarItem {
    name: "Account" | "Logout" | "MyCourses" | "Dashboard";
}



const Dashboard: React.FC = () => {
    const [role, setRole] = useState<string>('');

    useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Make a request to the server to check the authentication status
        const response = await fetch("http://localhost:8080/check-auth", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        }); 

        if (!response.ok) {
          // User is authenticated, redirect to the landing page
          navigate("/login");
        } else {
          // User is not authenticated, continue rendering the login page
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();
  }, []);
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

    const [courses, setCourses] = useState<Course[]>([]);
    
    useEffect(() => {
    const getCourses = async () => {
        try {
            const response = await fetch('http://localhost:8080/coursesById', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const res: Course[] = await response.json();
            console.log("Fetched courses:", res);
            setCourses(res);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };
    getCourses();
}, []);


    const sidebarItems: ISidebarItem[] = [
        { name: "Account" },
        { name: "Dashboard"},
        { name: "MyCourses" },
        { name: "Logout" }
    ]
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<React.ReactNode | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string>();
    const [selectedItem, setSelectedItem] = useState<string>('Home');
    const navigate = useNavigate();

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    const handleCourseClick = (_id: string) => {
        setSelectedCourse(_id);
        setSelectedItem('Home');
    };

   
    const menuItems = role === 'student' ? 
                    ['Home', 'Tasks', 'LeaderBoard', 'BuyItems'] : 
                    ['Home', 'Tasks', 'LeaderBoard', 'BuyItems', 'Delete', 'GradingSubmission'];

    const handleCourseCreate = () => {
        setSelectedItem('CreateCourse');
        setSelectedCourse('');
    };

    const handleItemClick = (item: string) => {
        setSelectedItem(item);
    };

    const handleLogOut = async () => {
        try {
            const response = await fetch('http://localhost:8080/logout', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/login');
            } else {
                console.log('Error logging out');
            }
        } catch (error) {
            console.error('Error logging out', error);
        }
    }
    
    const handleIconClick = (iconName: string) => {
        switch (iconName) {
            case 'Account':
                console.log('Account clicked');
                setSelectedComponent(
                <div className='overlay-profile'><Profile 
                    onClose={handleCloseSidebar} 
                    /></div>
                );
                setSidebarOpen(!isSidebarOpen);
                break;
            case 'MyCourses':
                setSelectedComponent(
                <div className='overlay-courses'>
                <CoursesSidebar 
                    onClose={handleCloseSidebar} 
                    courses={courses} 
                    onCourseClick={handleCourseClick}
                    setComponent={handleCourseCreate}
                    role={role}
                    /></div>
                );
                setSidebarOpen(!isSidebarOpen);
                break;
            case 'Logout':
                setSidebarOpen(false);
                // navigate('/login');
                handleLogOut();
                break;
            case 'Dashboard':
                setSelectedComponent(null);
                setSelectedCourse('');
                setSelectedItem('');
                setSidebarOpen(false);
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
                <>
                    {selectedComponent}
                </>
            )}
            <div className="flex flex-1 p-10 flex-col">
            {selectedCourse ? (<div>
                    <div>
                    <p className='text-2xl'>{courses.filter(course => course._id === selectedCourse)[0].courseKey}</p>
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
                    {selectedItem === 'Home' && <CourseDetailPage course={courses.filter(course => course._id === selectedCourse)[0]}/>}
                    {selectedItem === 'LeaderBoard' && <Leaderboard />}
                    {selectedItem === 'Tasks' && <Tasks courseId = {selectedCourse} role={role}/>}
                    {selectedItem === 'BuyItems' && <Items role={role} courseId={selectedCourse}/>}
                    {selectedItem === 'Delete' && <DeletePrompt/>}
                    {selectedItem === 'GradingSubmission' && <GradingSubmission />}
                    {/* {selectedItem === 'CreateCourse' && <CreateCourse/>} */}
                    </div>
                </div>
               
            </div>) : (
            selectedItem === 'CreateCourse' ? (<CreateCourse/>) : 
            (<div>
                <p className="text-3xl">Dashboard</p>
                <div className='w-full flex flex-wrap mt-10'>
                    {courses.map(course => <Card {...course} onCardClick={handleCourseClick}/>)}
                </div>
            </div>
            )
        ) }
            </div>
            {/* <Routes>
                <Route path="/dashboard/home" element={<Outlet />} />
            </Routes> */}
        </div>

    );
}

export default Dashboard;