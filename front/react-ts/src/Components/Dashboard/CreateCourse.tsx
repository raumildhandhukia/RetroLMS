import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCourse: React.FC = () => {
  const [title, setTitle] = useState('');
  const [courseKey, setCourseKey] = useState('');
  const [details, setDetails] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateCourse = async () => {
    if (!title || !courseKey || !details) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:8080/createcourse',{
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title, courseKey, details
        })
      });

      setIsLoading(false);

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'Something went wrong!');
      }

      // Reset input fields after successful creation
    //   setTitle('');
    //   setCourseKey('');
    //   setDetails('');
    //   setErrorMessage('');
    navigate('/login');
      
    } catch (error: any) { // Type assertion or annotation to specify error type
      console.error('Error creating course:', error.message);
      setErrorMessage(error.message || 'Something went wrong!');
    }
  };

  return (
    <div className="nes-container is-rounded with-title">
      <p className="title">Add Course</p>
      <div className="nes-field">
        <label htmlFor="title_field">Title:</label>
        <input type="text" id="title_field" className="nes-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="nes-field">
        <label htmlFor="course_key_field">Course Key:</label>
        <input type="text" id="course_key_field" className="nes-input" value={courseKey} onChange={(e) => setCourseKey(e.target.value)} />
      </div>
      <div className="nes-field">
        <label htmlFor="details_field">Details:</label>
        <input type="text" id="details_field" className="nes-input" value={details} onChange={(e) => setDetails(e.target.value)} />
      </div>
      {errorMessage && <p className="nes-text is-error">{errorMessage}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button type="button" className={`nes-btn is-primary ${isLoading && 'is-disabled'}`} onClick={handleCreateCourse} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default CreateCourse;
