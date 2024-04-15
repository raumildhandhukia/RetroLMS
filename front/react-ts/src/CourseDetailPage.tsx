import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.bubble.css'; // Import Quill CSS
import './RichEditor.css';
import RichTextEditor from './RichTextEditor';
const demo = {
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
}

interface Course {
    _id: string;
    title: string;
    courseKey: string;
    details: string;
}

interface CourseDetailPageProps {
    course: Course;
    updateCourses: Function;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course, updateCourses }) => {
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [editedDetails, setEditedDetails] = useState(course.details);
    const [title, setTitle] = useState(course.title);
    const [courseKey, setCourseKey] = useState(course.courseKey);

    const handleDetailsDoubleClick = () => {
        setIsEditingDetails(true);
    };

    const handleDetailsChange = (content: string) => {
        setEditedDetails(content);
    };

const editCourseDetails = async () => {
    try {
        debugger;
        const response = await fetch(`http://localhost:8080/editCourse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                courseId: course._id,
                details: editedDetails,
                title,
                courseKey
            })
        });

        if (!response.ok) {
            console.log('Failed to edit course details');
            return false;
        }
    } catch (error) {
        console.error('Error fetching items:', error);
        return false;
        // You can handle the error appropriately (e.g., show an error message)
    }
    return true;
};

    const handleSubmit = async () => {
        setIsEditingDetails(false);
        const success = await editCourseDetails();
        if (success) {
            updateCourses(course._id, title, courseKey, editedDetails);
        } else {
            setEditedDetails(course.details);
            setTitle(course.title);
            setCourseKey(course.courseKey);
        }
    }

    return (
        <div className="container flex">
            <div className="flex flex-1 flex-col">
                <div onDoubleClick={handleDetailsDoubleClick}>
                    {isEditingDetails ? (
                        <div>
                            <input
                                type="text"
                                className="text-3xl"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <br/>
                            <input
                                type="text"
                                className="text-3xl"
                                value={courseKey}
                                onChange={(e) => setCourseKey(e.target.value)}
                            />
                            <ReactQuill
                                theme='bubble'
                                value={editedDetails}
                                onChange={handleDetailsChange}
                                // onBlur={handleSubmit}
                            />
                            <button className='nes-btn is-primary' style={{marginTop: "50px", marginLeft:"10px"}} onClick={handleSubmit}>Save</button>
                        </div>
                        
                    ) : <div>
                            <h1 className="text-3xl">{title}</h1>
                            <h1 className="text-3xl">{courseKey}</h1>
                            <div dangerouslySetInnerHTML={{ __html: editedDetails }}></div>
                        </div>
                        }
                    
                    
                </div>
                {/* <p><strong>Term:</strong> {demo.term}</p>
                <p><strong>Instructor:</strong> {demo.instructor.name} (<a href={`mailto:${demo.instructor.email}`}>{demo.instructor.email}</a>)</p>
                <p><strong>Office Hours:</strong> {demo.officeHours}</p>
                <p><strong>Zoom Link:</strong> <a href={demo.zoomLink}>{demo.zoomLink}</a></p>
                <p><strong>Teaching Assistant:</strong> {demo.ta.name} (<a href={`mailto:${demo.ta.email}`}>{demo.ta.email}</a>)</p>
                <p><strong>Grader:</strong> {demo.grader.name} (<a href={`mailto:${demo.grader.email}`}>{demo.grader.email}</a>)</p>
                <p><strong>Syllabus:</strong> <a href={demo.syllabusLink}>Download Syllabus</a></p>
                <p><strong>Modules:</strong> <a href={demo.modulesLink}>Go to Modules</a></p> */}
            </div>
        </div>
    );
};

export default CourseDetailPage;
