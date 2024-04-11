import React, { useState } from 'react';
import 'nes.css/css/nes.min.css';
import './TaskDescription.css';
import DeletePrompt from './DeletePrompt';


interface TaskDescriptionProps {    
    selectedTask: {
        _id: string;
        title: string;
        deadline: string;
        details: string;
        point: number;
    };
    onClickBack: Function;
    updateTasks: Function;
    role: string;

}

// Assuming this component is now for editing, not just displaying
const TaskDescription: React.FC<TaskDescriptionProps> = ({selectedTask:task, onClickBack, updateTasks, role}) => {
    const [title, setTitle] = useState(task.title);
    const [details, setDetails] = useState(task.details);
    const [deadline, setDeadline] = useState(task.deadline);
    const [point, setPoint] = useState(task.point+"");
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleating, setIsDeleating] = useState(false);
    const handleUpdateTask = async () => {
        if (isEditing) {

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
            setErrorMessage('');
            setIsEditing(false);
            updateTasks();
            task.title = title;
            task.details = details;
            task.deadline = deadline;
            task.point = parseInt(point);
        } else {
            setIsEditing(true);
        }
    };

    const handleEditMode = () => {
        setIsEditing(true);
    }

    const handleDelete = async () => {
        setIsDeleating(true);
    }

    return (
        <div className="task-description-container">
            <div className="nes-container with-title is-centered">
                <p className="title">{title}</p>
                {!isDeleating ? (<div>
                    <div className="field-container">
                        <div className="nes-field">
                            <label htmlFor="title_field">Title:</label>
                            {!isEditing ?
                            <p onDoubleClick={handleEditMode}>{task.title}</p>
                            :
                            <input
                                type="text"
                                id="title_field"
                                className="nes-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            }
                        </div>
                        <div className="nes-field">
                            <label htmlFor="deadline_field">Deadline:</label>
                            {!isEditing ?
                            <p onDoubleClick={handleEditMode}>{task.deadline}</p>
                            :
                            <input
                                type="text"
                                id="deadline_field"
                                className="nes-input"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                            }
                        </div>
                        <div className="nes-field">
                            <label htmlFor="points_field">Points:</label>
                            {!isEditing ?
                            <p onDoubleClick={handleEditMode}>{task.point}</p>
                            :
                            <input
                                type="number"
                                id="points_field"
                                className="nes-input"
                                value={point}
                                onChange={(e) => setPoint(e.target.value)}
                            />}
                        </div>
                    </div>
                    <div className="nes-field description-field">
                        <label htmlFor="description_field">Description:</label>
                        {!isEditing ?
                        <p onDoubleClick={handleEditMode}>{task.details}</p>
                        :
                        <textarea
                            id="description_field"
                            className="nes-textarea"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={5}
                        />}
                    </div>

                    {/* Error Message */}
                    {errorMessage && <p className="nes-text is-error">{errorMessage}</p>}
                    {/* Add Task Button */}
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                        <button type="button" className='nes-btn is-error' onClick={() => {
                            onClickBack();
                        }}>
                            Back
                        </button>
                         {role === 'instructor' ? (<>
                            
                            <button type="button" className={`nes-btn is-primary ${isLoading && 'is-disabled'}`}
                                    onClick={handleUpdateTask} disabled={isLoading}>
                                {isLoading ? 'Updating Task...' : 'Update Task'}
                            </button>

                            <button type='button' className='nes-btn is-primary' onClick={handleDelete} >Delete</button>

                        </>) : null}
                        
                    </div>
                </div>) : <DeletePrompt task={task} redirectToTaskList={onClickBack}/>}
                
            </div>
        </div>
    );
};

export default TaskDescription;
