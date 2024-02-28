import React from 'react';
import SidebarItem from './SidebarItem';
import { CircleUser, LogOut } from 'lucide-react';
import Card from './Card';
import {Link} from "react-router-dom";

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
    name: "Account" | "Logout";
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
    const coursesData: Course[] = [
        { id: 1, name: 'Course 1', description: 'Software Agility', studentsEnrolled: 20, highestScore: 95, highestScorer: 'Student A', content:details},
        { id: 2, name: 'Course 2', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B', content:details },
        { id: 3, name: 'Course 3', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B', content:details },
        { id: 4, name: 'Course 4', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B', content:details },
        { id: 5, name: 'Course 5', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B', content:details }
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
                    {coursesData.map(course => <Card {...course} />)}
                </div>
            </div>
        </div>

    );
}

export default Dashboard;