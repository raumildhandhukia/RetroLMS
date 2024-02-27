import React, { JSXElementConstructor, ReactElement, useState } from 'react';
import { BrowserRouter as Router, Route, Link, useParams, Routes, Outlet } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import CoursesSidebar from './CoursesSidebar';
import { CircleUser, LogOut } from 'lucide-react';
import Card from './Card';
import asulogo from '../../asu.png'

export interface Course {
    id: number;
    name: string;
    description: string;
    studentsEnrolled: number;
    highestScore: number;
    highestScorer: string;
}

export interface ISidebarItem {
    name: "Account" | "Logout" | "MyCourses";
}

const Dashboard: React.FC = () => {
    const courses: Course[] = [
        { id: 1, name: 'Course 1', description: 'Software Agility', studentsEnrolled: 20, highestScore: 95, highestScorer: 'Student A' },
        { id: 2, name: 'Course 2', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B' },
        { id: 3, name: 'Course 3', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B' },
        { id: 4, name: 'Course 4', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B' },
        { id: 5, name: 'Course 5', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B' }
    ];

    const sidebarItems: ISidebarItem[] = [
        { name: "Account" },
        { name: "MyCourses" },
        { name: "Logout" }
    ]
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<React.ReactNode | null>(null);
    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };
    const handleIconClick = (iconName: string) => {
        // Handle the click of a particular icon
        switch (iconName) {
            case 'Account':
                setSelectedComponent(<div>Account Component</div>);
                break;
            case 'MyCourses':
                setSelectedComponent(<CoursesSidebar onClose={handleCloseSidebar} />);
                setSidebarOpen(!isSidebarOpen);
                break;
            case 'Logout':
                setSelectedComponent(<div>Logout Component</div>);
                break;
            default:
                setSelectedComponent(null);
                break;
        }
    };

    return (
        <div className="container flex relative">
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
                <p className="text-3xl">Dashboard</p>
                <div className='w-full flex flex-wrap mt-10'>
                    {courses.map(course => <Card {...course} />)}
                </div>
            </div>
            <Routes>
                <Route path="/dashboard/home" element={<Outlet />} />
            </Routes>
        </div>

    );
}

export default Dashboard;