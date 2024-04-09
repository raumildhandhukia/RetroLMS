import React, { useState, useEffect } from "react";
import "nes.css/css/nes.min.css";
import TaskList from "./TaskList";
import InstructorTaskList from "./InstructorTaskList";

interface Task {
  _id: string;
  title: string;
  deadline: string;
  details: string;
  point: number;
  course: string;
}
interface TaskProps {
  courseId: string;
}

const Tasks: React.FC<TaskProps> = ({courseId}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courseName, setCourseName] = useState<string>('SER517');
  const [role, setRole] = useState<string>('');
  useEffect(() => {
    console.log(courseId);
    const checkProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/profile", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error checking for profile", error);
      }
    };

    checkProfile();
  }, []);

  useEffect(() => {
    // Function to fetch tasks from the server
    const fetchTasks = async () => {
      try {

        const courseId = '65ee276576ac94ef4a77bdba'; // Replace with the actual courseId
        const response = await fetch(`http://localhost:8080/task/getTasksByCourseId`, {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            courseId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        setTasks(await response.json()); //await response.json();
      } catch (error) {
        console.error('Error fetching items:', error);
        // You can handle the error appropriately (e.g., show an error message)
      }
    };

    // Call the fetchTasks function when the component mounts
    fetchTasks();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts
  return (
      role === "student" ?
          <TaskList tasks={tasks} courseName={courseName} courseId = {courseId}/> :
    <InstructorTaskList tasks={tasks} courseName={courseName} courseId = {courseId}/>
  );
};

export default Tasks;
