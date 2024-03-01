import React from 'react';
import {useLocation, useParams} from 'react-router-dom';
import SidebarItem from "./Components/Dashboard/SidebarItem";
import {Course, ISidebarItem} from "./Components/Dashboard";


const CourseDetailPage: React.FC = () => {
    const { id } = useParams();

    // You would typically fetch the course details using the ID here
    // For the example, we'll just display the ID
    const coursesData = {
        "1": {
            id: "1",
            title: "SER 517: Software Factory Capstone",
            term: "2024 Spring",
            instructor: {
                name: "Dr. Nouh Alhindawi",
                email: "nalhinda@asu.edu"
            },
            officeHours: "Tuesdays and Thursdays 11:00 - 12:00 - or by appointment",
            zoomLink: "https://asu.zoom.us/j/4154409963",
            ta: {
                name: "James Smith",
                email: "jsmit106@asu.edu"
            },
            grader: {
                name: "Anmol Girish More",
                email: "amore9@asu.edu"
            },
            syllabusLink: "/path-to-syllabus",
            modulesLink: "/modules"
        },
        "2": {
            id: "2",
            title: "SER 517: Software Factory Capstone",
            term: "2024 Spring",
            instructor: {
                name: "Dr. Nouh Alhindawi",
                email: "nalhinda@asu.edu"
            },
            officeHours: "Tuesdays and Thursdays 11:00 - 12:00 - or by appointment",
            zoomLink: "https://asu.zoom.us/j/4154409963",
            ta: {
                name: "James Smith",
                email: "jsmit106@asu.edu"
            },
            grader: {
                name: "Anmol Girish More",
                email: "amore9@asu.edu"
            },
            syllabusLink: "/path-to-syllabus",
            modulesLink: "/modules"
        },
        "3": {
            id: "3",
            title: "SER 517: Software Factory Capstone",
            term: "2024 Spring",
            instructor: {
                name: "Dr. Nouh Alhindawi",
                email: "nalhinda@asu.edu"
            },
            officeHours: "Tuesdays and Thursdays 11:00 - 12:00 - or by appointment",
            zoomLink: "https://asu.zoom.us/j/4154409963",
            ta: {
                name: "James Smith",
                email: "jsmit106@asu.edu"
            },
            grader: {
                name: "Anmol Girish More",
                email: "amore9@asu.edu"
            },
            syllabusLink: "/path-to-syllabus",
            modulesLink: "/modules"
        },
        "4": {
            id: "4",
            title: "SER 517: Software Factory Capstone",
            term: "2024 Spring",
            instructor: {
                name: "Dr. Nouh Alhindawi",
                email: "nalhinda@asu.edu"
            },
            officeHours: "Tuesdays and Thursdays 11:00 - 12:00 - or by appointment",
            zoomLink: "https://asu.zoom.us/j/4154409963",
            ta: {
                name: "James Smith",
                email: "jsmit106@asu.edu"
            },
            grader: {
                name: "Anmol Girish More",
                email: "amore9@asu.edu"
            },
            syllabusLink: "/path-to-syllabus",
            modulesLink: "/modules"
        },
        "5": {
            id: "5",
            title: "SER 517: Software Factory Capstone",
            term: "2024 Spring",
            instructor: {
                name: "Dr. Nouh Alhindawi",
                email: "nalhinda@asu.edu"
            },
            officeHours: "Tuesdays and Thursdays 11:00 - 12:00 - or by appointment",
            zoomLink: "https://asu.zoom.us/j/4154409963",
            ta: {
                name: "James Smith",
                email: "jsmit106@asu.edu"
            },
            grader: {
                name: "Anmol Girish More",
                email: "amore9@asu.edu"
            },
            syllabusLink: "/path-to-syllabus",
            modulesLink: "/modules"
        }
    };
    const sidebarItems: ISidebarItem[] = [
        { name: "Account" },
        { name: "Account" },
        { name: "Account" },
        { name: "Account" },
        { name: "Logout" },
    ]

    const location = useLocation();
    //const { course } = location.state as { course: Course }; // Type casting for TypeScript
    // @ts-ignore
    const course = coursesData[id];
    return (
        <div className="container flex">
            <div className="w-20 bg-gray-100 h-lvh flex flex-col">
                {sidebarItems.map(sidebarItem =>
                    <SidebarItem name={sidebarItem.name} />
                )}
            </div>
            <div className="flex flex-1 p-10 flex-col">
                <h1 className="text-3xl">{course.title}</h1>
                <p><strong>Term:</strong> {course.term}</p>
                <p><strong>Instructor:</strong> {course.instructor.name} (<a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a>)</p>
                <p><strong>Office Hours:</strong> {course.officeHours}</p>
                <p><strong>Zoom Link:</strong> <a href={course.zoomLink}>{course.zoomLink}</a></p>
                <p><strong>Teaching Assistant:</strong> {course.ta.name} (<a href={`mailto:${course.ta.email}`}>{course.ta.email}</a>)</p>
                <p><strong>Grader:</strong> {course.grader.name} (<a href={`mailto:${course.grader.email}`}>{course.grader.email}</a>)</p>
                <p><strong>Syllabus:</strong> <a href={course.syllabusLink}>Download Syllabus</a></p>
                <p><strong>Modules:</strong> <a href={course.modulesLink}>Go to Modules</a></p>
            </div>
        </div>
    );
};

export default CourseDetailPage;
