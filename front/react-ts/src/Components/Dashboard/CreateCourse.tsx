import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const CreateCourse: React.FC = () => {
  const [title, setTitle] = useState('');
  const [courseKey, setCourseKey] = useState('');
  const [details, setDetails] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('Creating course...');
  const [stringOfExclamation, setStringOfExclamation] = useState('!');
  const navigate = useNavigate();

  // Update the loading message and animation dots over time
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

  const handleCreateCourse = async () => {
    if (!title || !courseKey || !details) {
      setErrorMessage('All fields are required.');
      return;
    }

    setIsLoading(true);
    setLoaderMessage('Sending course data...');

    try {
      const response = await fetch('http://localhost:8080/createcourse', {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, courseKey, details })
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'Something went wrong!');
      }

      navigate('/login');
    } catch (error) {
      console.error('Error creating course:', error);
      setErrorMessage('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="create-course-container" style={{ marginLeft: '20vh' }}>
        {isLoading ? (
            <div className="loading-container" style={{ textAlign: 'center', paddingTop: '50px' }}>
              <p>{loaderMessage}{stringOfExclamation}</p>
            </div>
        ) : (
            <div className="nes-container is-rounded with-title">
              <p className="title">Add Course</p>
              <div style={{ display: 'inline-block', width: '100%', marginBottom: '10px' }}>
                <div className="nes-field">
                  <label htmlFor="title_field">Title:</label>
                  <input type="text" id="title_field" className="nes-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="nes-field">
                  <label htmlFor="course_key_field">Course Key:</label>
                  <input type="text" id="course_key_field" className="nes-input" value={courseKey} onChange={(e) => setCourseKey(e.target.value)} />
                </div>
              </div>
              <div className="nes-field">
                <label htmlFor="details_field">Details:</label>
                <textarea id="details_field" className="nes-textarea" value={details} onChange={(e) => setDetails(e.target.value)} />
              </div>
              {errorMessage && <p className="nes-text is-error">{errorMessage}</p>}
              <div className="button-container">
                <button type="button" className={`nes-btn is-primary`} onClick={handleCreateCourse} disabled={isLoading}>
                  Create
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default CreateCourse;
