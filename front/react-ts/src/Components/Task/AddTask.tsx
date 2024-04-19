import React, {useEffect, useState} from 'react';
import 'nes.css/css/nes.min.css';
import {useLocation} from "react-router-dom";

interface AddTaskProps {
  showTaskList: Function;
  courseId: string;
  createTask: boolean;
  update: Function;
}

const AddTask: React.FC<AddTaskProps> = ({showTaskList, courseId, update}) => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [details, setDetails] = useState('');
    const [point, setPoint] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('Creating Task...');
    const [stringOfExclamation, setStringOfExclamation] = useState('!');
    // Use useLocation to access navigation state
    const location = useLocation();
    // Extract courseId from location state
    // const {courseId} = location.state||{};
    useEffect(() => {
        if (isLoading) {
            const t1 = setTimeout(() => {
                setLoaderMessage('Just a bit longer');
            }, 3000);

            const t2 = setTimeout(() => {
                setLoaderMessage('Almost done');
            }, 6000);

            const t3 = setInterval(() => {
                setStringOfExclamation((prev) => prev.length < 3 ? prev + '!' : '!');
            }, 500);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearInterval(t3);
            };
        }
    }, [isLoading]);

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
                    title, details, point, courseId, deadline
                })
            });
            console.log(response)
            setIsLoading(false);
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Something went wrong!');
            } else {
                update();
                showTaskList();
            }
            

        } catch (error) {
            console.error('Error creating task:', error);
            setErrorMessage('Something went wrong!');
        }
        finally{
            setIsLoading(false);
        }
    };

    return (
        <div style={{width:'100vh'}}>
            <div className='field-container-two'>
                {isLoading ? (
                    <div className="loading-container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                        <p>{loaderMessage}{stringOfExclamation}</p>
                    </div>
                ) : (
            <div className="nes-field mt-5">
                <label htmlFor="title"><span className=''>Task Name</span></label>
                <input type="text" id="title" className="nes-input" value={title}
                       onChange={(e) => setTitle(e.target.value)}/>
            </div>)}
            {/* Task Point Input */}
            <div className="nes-field mt-5">
                <label htmlFor="point"><span className=''>Task Points</span></label>
                <input type="number" id="point" className="nes-input" value={point}
                       onChange={(e) => setPoint(e.target.value)}/>
            </div>
            </div>
            {/* Task Details Input */}
            <div className="nes-field mt-5">
                <label htmlFor="details"><span className=''>Task Details</span></label>
                <textarea  id="details" className="nes-input" value={details}
                       onChange={(e) => setDetails(e.target.value)}/>
            </div>
            
            {/* Error Message */}
            {errorMessage && <p className="nes-text is-error">{errorMessage}</p>}
            {/* Add Task Button */}
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '30px'}}>
                <button type="button" className={`nes-btn is-primary ${isLoading && 'is-disabled'}`}
                        onClick={handleCreateTask} disabled={isLoading}>
                    {isLoading ? 'Adding Task...' : 'Add Task'}
                </button>
            </div>
        </div>
    );
};

export default AddTask;
