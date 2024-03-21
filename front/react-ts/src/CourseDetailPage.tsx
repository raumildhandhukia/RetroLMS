import React, { useState } from 'react';

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

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8080/editCourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: course._id,
                    title: editedTitle,
                    courseKey: editedCourseKey,
                    details: editedDetails
                })
            });

            if (!response.ok) {
                throw new Error('Failed to edit course');
            }

            // Optionally, handle success

            // Exit edit mode
            setIsEditingTitle(false);
            setIsEditingCourseKey(false);
            setIsEditingDetails(false);
        } catch (error) {
            console.error('Error editing course:', error);
            // Optionally, handle error
        }
    };

    return (
        <div className="container flex">
            <div className="flex flex-1 flex-col">
                <h1 className="text-3xl" onDoubleClick={handleTitleDoubleClick}>
                    {isEditingTitle ? (
                        <input type="text" className="nes-input" value={editedTitle} onChange={handleTitleChange} onBlur={handleSubmit} />
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
                <p onDoubleClick={handleDetailsDoubleClick}>
                    {isEditingDetails ? (
                        <textarea className="nes-textarea" value={editedDetails} onChange={handleDetailsChange} onBlur={handleSubmit} />
                    ) : (
                        course.details
                    )}
                </p>
            </div>
        </div>
    );
};

export default CourseDetailPage;
