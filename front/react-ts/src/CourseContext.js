// CourseContext.js
import React, { createContext, useState } from 'react';

// Create a context for the courses
export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {

    // State to hold the courses data
    const [coursesData, setCoursesData] = useState([
        {
            id: 1,
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
        // ... other courses
    ]);

    return (
        <CourseContext.Provider value={{ coursesData, setCoursesData }}>
            {children}
        </CourseContext.Provider>
    );
};
