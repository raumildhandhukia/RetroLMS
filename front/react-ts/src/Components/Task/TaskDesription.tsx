// src/components/TaskDescription.tsx

import React from 'react';
import 'nes.css/css/nes.min.css';
import './TaskDescription.css'; // Import custom styles

interface TaskDescriptionProps {
  title: string;
  description: string;
  deadline: string;
  points: number;
  course: string;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({
  title,
  description,
  deadline,
  points,
  course,
}) => {
  return (
    <div className="task-description-container">
      <div className="nes-container with-title is-centered">
        <p className="title">{title}</p>
        <div className="field-container">
          <div className="nes-field">
            <label htmlFor="deadline_field">Deadline:</label>
            <input
              type="text"
              id="deadline_field"
              className="nes-input"
              value={deadline}
              readOnly
            />
          </div>
          <div className="nes-field">
            <label htmlFor="points_field">Points:</label>
            <input
              type="number"
              id="points_field"
              className="nes-input"
              value={points}
              readOnly
            />
          </div>
          <div className="nes-field">
            <label htmlFor="course_field">Course:</label>
            <input
              type="text"
              id="course_field"
              className="nes-input"
              value={course}
              readOnly
            />
          </div>
        </div>
        <div className="nes-field description-field">
          <label htmlFor="description_field">Description:</label>
          <textarea
            id="description_field"
            className="nes-textarea"
            value={description}
            readOnly
            rows={Math.max(5, description.split('\n').length)}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDescription;
