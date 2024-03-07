import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "nes.css/css/nes.min.css";
import TaskList from "./TaskList";

interface Task {
  id: number;
  title: string;
  deadline: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courseName, setCourseName] = useState<string>('SER517');
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch tasks from the server
    const fetchTasks = async () => {
      try {
        const courseId = '65d7c8254df4ea811a701b00'; // Replace with the actual courseId
        const response = await fetch('http://localhost:8080/task/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data); // Update tasks state with the received data
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // You can handle the error appropriately (e.g., show an error message)
      }
    };

    // Call the fetchTasks function when the component mounts
    fetchTasks();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  return (
    <TaskList tasks={tasks} courseName={courseName} />
  );
};

export default Tasks;
