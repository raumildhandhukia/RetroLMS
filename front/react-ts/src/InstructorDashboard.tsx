import React from 'react';
import {BrowserRouter as Router, Route, Link, useParams, BrowserRouter, Routes} from 'react-router-dom';
import './InstructorDashboard.css';

const Navbar: React.FC = () => {
    return (
        <header className="navbar">
            <Link to="/">
                <img src="https://file.rendit.io/n/mWZVWPIwAmEIOBF3b0E9.png" alt="Arizona State University" className="logo" /> {/* Replace with your logo */}
            </Link>
            <div className="dropdown">
                <button className="dropbtn">Instructor Details</button>
                <div className="dropdown-content">
                    <Link to="/profile">Profile</Link>
                    <Link to="/settings">Settings</Link>
                </div>
            </div>
            <Link to="/courses">
                <button className="courses-btn">Courses</button>
            </Link>
            <Link to="/add-course">
                <button className="add-course-btn">Add Course</button>
            </Link>
            <Link to="/">
                <button className="logout-btn">Logout</button>
            </Link>
        </header>
    );
}

interface Course {
    id: number;
    name: string;
    description: string;
    studentsEnrolled: number;
    highestScore: number;
    highestScorer: string;
}

const LeaderboardSection: React.FC<{ course: Course }> = ({ course }) => {
    return (
        <Link to={`/course/${course.id}`} className="leaderboard-section">
            <h2>{course.name}</h2>
            <p>Description: {course.description}</p>
            <p>Students Enrolled: {course.studentsEnrolled}</p>
            <p>Highest Score: {course.highestScore} by {course.highestScorer}</p>
        </Link>
    );
}

const CourseDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Dummy data (replace with actual data fetched from the database)
    const courses: Course[] = [
        { id: 1, name: 'Course 1', description: 'Software Agility', studentsEnrolled: 20, highestScore: 95, highestScorer: 'Student A' },
        { id: 2, name: 'Course 2', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B' }
    ];
    let course: Course | undefined;
    if (typeof id === "string") {
        course = courses.find(course => course.id === parseInt(id));
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div>
            <Navbar />
            <main className="course-details">
                <h2>{course.name}</h2>
                <p>Description: {course.description}</p>
                <p>Students Enrolled: {course.studentsEnrolled}</p>
                <p>Highest Score: {course.highestScore} by {course.highestScorer}</p>
            </main>
        </div>
    );
}

const App: React.FC = () => {
    const courses: Course[] = [
        { id: 1, name: 'Course 1', description: 'Software Agility', studentsEnrolled: 20, highestScore: 95, highestScorer: 'Student A' },
        { id: 2, name: 'Course 2', description: 'Software Design', studentsEnrolled: 15, highestScore: 90, highestScorer: 'Student B' }
    ];

    return (
        <div className="App">
            <Navbar />
            <main className="dashboard">
                {courses.map(course => (
                    <LeaderboardSection key={course.id} course={course} />
                ))}
            </main>
            <Routes>
                <Route path="/">
                </Route>
                <Route path="/course/:id" Component={CourseDetailsPage} />
            </Routes>
        </div>

    );
}

export default App;