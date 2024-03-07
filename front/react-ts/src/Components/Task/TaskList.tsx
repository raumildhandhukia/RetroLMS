// src/components/TaskList.tsx

import React from 'react';
import 'nes.css/css/nes.min.css';
import './TaskList.css'; // Import custom styles

interface Task {
  id: number;
  title: string;
  deadline: string;
}

interface TaskListProps {
  tasks: Task[];
  courseName: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, courseName }) => {
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
                <tr key={task.id} className="task-item">
                    <td>{task.title}</td>
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
