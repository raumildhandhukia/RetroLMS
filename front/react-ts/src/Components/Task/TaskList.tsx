import React from 'react';
import 'nes.css/css/nes.min.css';
// import './TaskList.css';

interface Task {
  id: number;
  description: string;
  deadline: string;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="task-list-container">
      <h2>Task List</h2>
      <ul className="nes-list is-disc">
        {tasks.map((task) => (
          <li key={task.id} className="nes-text nes-container is-rounded">
            <strong>{task.description}</strong> - Deadline: {task.deadline}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
