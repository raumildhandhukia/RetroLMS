import React, {useEffect, useState} from "react";

const CreateCourse: React.FC = () => {
    const [title, setTitle] = useState('');
    const [courseKey, setCourseKey] = useState('');
    const [details, setDetails] = useState('');

    const handleCreateCourse = async () => {
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
    }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button type="button" className="nes-btn is-primary" onClick={handleCreateCourse}>Create</button>
        {/* <button type="button" className="nes-btn" onClick={onClose}>Cancel</button> */}
      </div>
    </div>
  );

}

export default CreateCourse;
