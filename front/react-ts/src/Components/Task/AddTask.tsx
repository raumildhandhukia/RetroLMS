import React, { useState} from 'react';
import 'nes.css/css/nes.min.css';
import {useLocation} from "react-router-dom";

const AddTask: React.FC<{}> = () => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [details, setDetails] = useState('');
    const [point, setPoint] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Use useLocation to access navigation state
    const location = useLocation();
    // Extract courseId from location state
    const {courseId} = location.state||{};
    const handleCreateTask = async () => {
        if (!title|| !details || !point) {
            setErrorMessage('All fields are required.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:8080/task/create', {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title, details, point, courseId
                })
            });
            console.log(response)
            setIsLoading(false);
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Something went wrong!');
            }

        } catch (error) {
            console.error('Error creating task:', error);
            setErrorMessage('Something went wrong!');
        }
    };

    return (
        <div className="nes-container is-rounded with-title">
            <p className="title">Add Task</p>
            {/* Task Name Input */}
            <div className="nes-field">
                <label htmlFor="title">Task Name</label>
                <input type="text" id="title" className="nes-input" value={title}
                       onChange={(e) => setTitle(e.target.value)}/>
            </div>
            {/* Task Deadline Input */}
            <div className="nes-field">
                <label htmlFor="deadline">Task Deadline</label>
                <input type="text" id="deadline" className="nes-input" value={deadline}
                       onChange={(e) => setDeadline(e.target.value)}/>
            </div>
            {/* Task Details Input */}
            <div className="nes-field">
                <label htmlFor="details">Task Details</label>
                <input type="text" id="details" className="nes-input" value={details}
                       onChange={(e) => setDetails(e.target.value)}/>
            </div>
            {/* Task Point Input */}
            <div className="nes-field">
                <label htmlFor="point">Task Points</label>
                <input type="number" id="point" className="nes-input" value={point}
                       onChange={(e) => setPoint(e.target.value)}/>
            </div>
            {/* Error Message */}
            {errorMessage && <p className="nes-text is-error">{errorMessage}</p>}
            {/* Add Task Button */}
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                <button type="button" className={`nes-btn is-primary ${isLoading && 'is-disabled'}`}
                        onClick={handleCreateTask} disabled={isLoading}>
                    {isLoading ? 'Adding Task...' : 'Add Task'}
                </button>
            </div>
        </div>
    );
};

export default AddTask;
