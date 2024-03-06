import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "nes.css/css/nes.min.css";
import TaskList from "./TaskList";

interface Task {
  id: number;
  description: string;
  deadline: string;
}

const Tasks: React.FC = () => {
  // Example task data
  const tasks: Task[] = [
    { id: 1, description: 'Complete React project', deadline: '2024-03-10' },
    { id: 2, description: 'Submit report', deadline: '2024-03-15' },
    // Add more tasks as needed
  ];
  const courseName = 'SER517';

  return (
    <div className="nes-container with-title is-centered">
      <p className="title">{courseName}</p>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Tasks;