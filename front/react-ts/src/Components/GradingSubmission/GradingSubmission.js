import React, { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './GradingSubmission.css';

const GradingSubmission = () => {
  useEffect(() => {
    const fetchTasksByCourseId = async () => {
      const courseId = '65ee27ba76ac94ef4a77bdc0';
      try {
        const response = await fetch(`http://localhost:8080/task/getTaskByCourseId?courseId=${courseId}`, {
          method: "GET", 
          credentials: "include", 
        });
        if (response.ok) {
          const tasks = await response.json();
          console.log("Tasks:", tasks);
          // Handle tasks data as needed (e.g., update state)
        } else {
          console.log("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // You can handle the error appropriately (e.g., show an error message)
      }
    };
  
    fetchTasksByCourseId();
  }, []);
  
  // Sample student data
  const [students, setStudents] = useState([
    { id: 1, name: 'Student 1', points: '' },
    { id: 2, name: 'Student 2', points: '' },
    { id: 3, name: 'Student 3', points: '' },
    { id: 4, name: 'Student 4', points: '' },
    { id: 5, name: 'Student 5', points: '' }
  ]);

  // Sample tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' },
    { id: 3, name: 'Task 3' }
  ]);

  // State for selected task
  const [selectedTask, setSelectedTask] = useState('');

  // Handler for input change
  const handleInputChange = (id, value) => {
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, points: value } : student
    );
    setStudents(updatedStudents);
  };

  // Handler for selecting task
  const handleTaskSelect = e => {
    setSelectedTask(e.target.value);
  };

  // Handler for saving points
  const handleSavePoints = () => {
    // Implement your logic for saving points here
    console.log('Points saved:', students);
  };

  return (
    <div>
      <div className='grading-header'>
            <select value={selectedTask} onChange={handleTaskSelect} className="eightBitSelect">
                <option value="">Select a Task</option>
                {tasks.map(task => (
                <option key={task.id} value={task.id}>
                    {task.name}
                </option>))} 
            </select>
      </div>
      <h2>List of Students for Selected Task</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Points Earned</th>
            <th>Save Points</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through students and render input fields */}
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <input
                  type="number"
                  value={student.points}
                  onChange={e => handleInputChange(student.id, e.target.value)}
                />
              </td>
              <td><button onClick={handleSavePoints}>Save</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to save points */}
      
    </div>
  );
};

export default GradingSubmission;


