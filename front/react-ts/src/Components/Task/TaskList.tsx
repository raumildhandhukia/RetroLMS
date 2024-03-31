import React from 'react';
import {useNavigate } from 'react-router-dom';
import 'nes.css/css/nes.min.css';
import './TaskList.css';

interface Task {
  _id: string;
  title: string;
  deadline: string;
  details: string;
  point: number;
  course: string;
}

interface TaskListProps {
  tasks: Task[];
  courseName: string;
  courseId: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, courseName ,courseId}) => {
  const navigate = useNavigate();

  const navigateToTaskDescription = (task: Task) => {
    // Use the navigate function to navigate to the task description page
    navigate('/task', { state: { task, courseId } });
  };

  return (
    <div className="task-list-container">
      <div className="nes-container with-title is-centered">
        <p className="title">{courseName}</p>
        <div className="task-list-content">
          <h2>Task List</h2>
          <table className="nes-table is-bordered is-centered">
            <thead>
              <tr>
                <th className="task-title">Task Title</th>
                <th className="task-deadline">Task Deadline</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="task-item">
                  {/* Use onClick to call navigateToTaskDescription on click */}
                  <td onClick={() => navigateToTaskDescription(task)}>{task.title}</td>
                  <td>{task.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
