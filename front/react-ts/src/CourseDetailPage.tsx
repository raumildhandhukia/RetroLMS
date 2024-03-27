import React, { useState, useEffect, useRef } from 'react';

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
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingCourseKey, setIsEditingCourseKey] = useState(false);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [editedTitle, setEditedTitle] = useState(course.title);
    const [editedCourseKey, setEditedCourseKey] = useState(course.courseKey);
    const [editedDetails, setEditedDetails] = useState(course.details);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleTitleDoubleClick = () => {
        setIsEditingTitle(true);
    };

    const handleCourseKeyDoubleClick = () => {
        setIsEditingCourseKey(true);
    };

    const handleDetailsDoubleClick = () => {
        setIsEditingDetails(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(e.target.value);
    };

    const handleCourseKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedCourseKey(e.target.value);
    };

    const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedDetails(e.target.value);
    };

    

    const editCourse = async () => {
        console.log('Called Handle Submit')
        try {
            const response = await fetch('http://localhost:8080/editCourse', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    id: course._id,
                    title: editedTitle,
                    courseKey: editedCourseKey,
                    details: editedDetails
                })
            });

            if (!response.ok) {
                console.log('Failed to edit course');
            }

            // Optionally, handle success
        } catch (error) {
            console.error('Error editing course:', error);
            // Optionally, handle error
        }
       
    };

    const handleSubmit = () => {
        console.log('On Blur Called')
        setIsEditingTitle(false);
        setIsEditingCourseKey(false);
        setIsEditingDetails(false);
        editCourse();
    }

    useEffect(() => {
        if (isEditingTitle && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditingTitle]);

    return (
        <div className="container flex">
            <div className="flex flex-1 flex-col">
                <h1 className="text-3xl" onDoubleClick={handleTitleDoubleClick}>
                    {isEditingTitle ? (
                        <input type="text" ref={inputRef} className="nes-input" value={editedTitle} onChange={handleTitleChange} onBlur={handleSubmit} />
                    ) : (
                        course.title
                    )}
                </h1>
                <h1 className="text-3xl" onDoubleClick={handleCourseKeyDoubleClick}>
                    {isEditingCourseKey ? (
                        <input type="text" className="nes-input" value={editedCourseKey} onChange={handleCourseKeyChange} onBlur={handleSubmit} />
                    ) : (
                        course.courseKey
                    )}
                </h1>
                {/* <p onDoubleClick={handleDetailsDoubleClick}>
                    {isEditingDetails ? (
                        <textarea className="nes-textarea" value={editedDetails} onChange={handleDetailsChange} onBlur={handleSubmit} />
                    ) : (
                        course.details
                    )}
                </p> */}
                <p><strong>Term:</strong> {demo.term}</p>
                <p><strong>Instructor:</strong> {demo.instructor.name} (<a href={`mailto:${demo.instructor.email}`}>{demo.instructor.email}</a>)</p>
                <p><strong>Office Hours:</strong> {demo.officeHours}</p>
                <p><strong>Zoom Link:</strong> <a href={demo.zoomLink}>{demo.zoomLink}</a></p>
                <p><strong>Teaching Assistant:</strong> {demo.ta.name} (<a href={`mailto:${demo.ta.email}`}>{demo.ta.email}</a>)</p>
                <p><strong>Grader:</strong> {demo.grader.name} (<a href={`mailto:${demo.grader.email}`}>{demo.grader.email}</a>)</p>
                <p><strong>Syllabus:</strong> <a href={demo.syllabusLink}>Download Syllabus</a></p>
                <p><strong>Modules:</strong> <a href={demo.modulesLink}>Go to Modules</a></p>
            </div>
        </div>
    );
};

export default CourseDetailPage;
