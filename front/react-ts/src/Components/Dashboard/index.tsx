import React, { JSXElementConstructor, ReactElement } from 'react';
import { BrowserRouter as Router, Route, Link, useParams, Routes } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { CircleUser, LogOut } from 'lucide-react';
import Card from './Card';

export interface Course {
    id: number;
    name: string;
    description: string;
    studentsEnrolled: number;
    highestScore: number;
    highestScorer: string;
}

export interface ISidebarItem {
    name: "Account" | "Logout";
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
        { name: "Account" },
        { name: "Account" },
        { name: "Account" },
        { name: "Logout" },
    ]

    return (
        <div className="container flex">
            <div className="w-20 bg-gray-100 h-lvh flex flex-col">
                {sidebarItems.map(sidebarItem => 
                    <SidebarItem name={sidebarItem.name} />
                )}
            </div>
            <div className="flex flex-1 p-10 flex-col">
                <p className="text-3xl">Dashboard</p>
                <div className='w-full flex flex-wrap mt-10'>
                    {courses.map(course => <Card {...course} />)}
                </div>
            </div>
        </div>

    );
}

export default Dashboard;