import React, { JSXElementConstructor, ReactElement, useState, useEffect } from 'react';
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
    
    // interface Course {
    //     _id: string;
    //     title: string;
    //     courseKey: string;

    // };
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

    const handleCourseCreate = () => {
        setSelectedItem('CreateCourse');
        setSelectedCourse('');
    };

    const menuItems = ['Home', 'Tasks', 'LeaderBoard', 'BuyItems', 'Delete'];

    const handleItemClick = (item: string) => {
        setSelectedItem(item);
    };
    
    const handleIconClick = (iconName: string) => {
        switch (iconName) {
            case 'Account':
                setSelectedComponent(<div>Account Component</div>);
                break;
            case 'MyCourses':
                setSelectedComponent(
                <CoursesSidebar 
                    onClose={handleCloseSidebar} 
                    courses={courses} 
                    onCourseClick={handleCourseClick}
                    setComponent={handleCourseCreate}
                    />
                );
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
                  <SidebarItem key={sidebarItem.name} name={sidebarItem.name} onClick={handleIconClick} />
              )}
          </div>
           {isSidebarOpen && (
                <div className="overlay">
                    {selectedComponent}
                </div>
            )}
            <div className="flex flex-1 p-10 flex-col">
            {selectedCourse ? (<div>
                    <p className='text-2xl'>{selectedCourse}</p>
                <hr/>
                <div className='main-content'>
                    <div>
                        {menuItems.map((item, index) => <div className='text-1xl custom-styling' onClick={() => handleItemClick(item)}>{item}</div>)}
                    </div>
                    <div className='detail-container'>
                    {selectedItem === 'Home' && <CourseDetailPage course={courses.filter(course => course._id === selectedCourse)[0]}/>}
                    {selectedItem === 'LeaderBoard' && <Leaderboard />}
                    {selectedItem === 'Tasks' && <Tasks />}
                    {selectedItem === 'BuyItems' && <Items />}
                    {selectedItem === 'Delete' && <DeletePrompt/>}
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