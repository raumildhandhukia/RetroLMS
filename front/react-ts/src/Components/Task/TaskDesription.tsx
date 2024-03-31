import React, { useState } from 'react';
import 'nes.css/css/nes.min.css';
import './TaskDescription.css';
import {useLocation} from "react-router-dom";

// Assuming this component is now for editing, not just displaying
const TaskDescription: React.FC<{}> = () => {
    const location = useLocation(); // If using React Router
    const { task } = location.state;
    const [title, setTitle] = useState(task.title);
    const [details, setDetails] = useState(task.details);
    const [deadline, setDeadline] = useState(task.deadline);
    const [point, setPoint] = useState(task.point+"");
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleUpdateTask = async () => {
        if (!title || !deadline || !details || !point) {
            setErrorMessage('All fields are required.');
            return;
        }

        try {
            setIsLoading(true);
            const task_id = task._id;
            const response = await fetch('http://localhost:8080/task/update/'+task_id, {
                method: "PUT",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title, details, point, deadline
                })
            });

            setIsLoading(false);
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Something went wrong!');
            }

        } catch (error) {
            console.error('Error updating task:', error);
            setErrorMessage('Something went wrong!');
        }
    };

    return (
        <div className="task-description-container">
            <div className="nes-container with-title is-centered">
                <p className="title">{title}</p>
                <div className="field-container">
                    <div className="nes-field">
                        <label htmlFor="title_field">Title:</label>
                        <input
                            type="text"
                            id="title_field"
                            className="nes-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="nes-field">
                        <label htmlFor="deadline_field">Deadline:</label>
                        <input
                            type="text"
                            id="deadline_field"
                            className="nes-input"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                    <div className="nes-field">
                        <label htmlFor="points_field">Points:</label>
                        <input
                            type="number"
                            id="points_field"
                            className="nes-input"
                            value={point}
                            onChange={(e) => setPoint(e.target.value)}
                        />
                    </div>
                </div>
                <div className="nes-field description-field">
                    <label htmlFor="description_field">Description:</label>
                    <textarea
                        id="description_field"
                        className="nes-textarea"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        rows={5}
                    />
                </div>
                {/* Error Message */}
                {errorMessage && <p className="nes-text is-error">{errorMessage}</p>}
                {/* Add Task Button */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                    <button type="button" className={`nes-btn is-primary ${isLoading && 'is-disabled'}`}
                            onClick={handleUpdateTask} disabled={isLoading}>
                        {isLoading ? 'Updating Task...' : 'Update Task'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDescription;
