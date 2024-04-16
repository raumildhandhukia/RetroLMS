import React, { useState, useEffect, useRef } from 'react';
import 'nes.css/css/nes.min.css';
import './GradingSubmission.css';
import * as XLSX from 'xlsx';

const GradingSubmission = () => {
  useEffect(() => {
    const fetchTasksByCourseId = async () => {
      const courseId = '661c32cd3a41487e46b0d48e';
      try {
        const response = await fetch(`http://localhost:8080/task/getTasksByCourseId?courseId=${courseId}`, {
          
          method: "GET", 
          credentials: "include", 
        });
        if (response.ok) {
          const tasks = await response.json();
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
  const [data, setData] = useState([]);

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, {type:'binary'});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setData(data);
    };
    reader.readAsBinaryString(file);
  };

  // Sample tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' },
    { id: 3, name: 'Task 3' }
  ]);

  // State for selected task
  const [selectedTask, setSelectedTask] = useState('');

  // Handler for selecting task
  const handleTaskSelect = e => {
    setSelectedTask(e.target.value);
  };

  // Handler for saving points
  const handleSavePoints = () => {
    // Implement your logic for saving points here
  };

  return (
    <div>
      <div className='submission-header'>
      <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFile}
          id="fileInput"
          className="input"
        />
      <div className='grading-header'>
            <select value={selectedTask} onChange={handleTaskSelect} className="eightBitSelect">
                <option value="">Select a Task</option>
                {tasks.map(task => (
                <option key={task.id} value={task.id}>
                    {task.name}
                </option>))} 
            </select>
      </div>
      
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
          {data.map((item, index) => (
          <tr key={index}>
            <td>{item.username}</td>
            <td>{item.points}</td>
            <td><button onClick={handleSavePoints}>Save</button></td>
          </tr>
        ))}
        </tbody>
      </table>     
    </div>
  );
};

export default GradingSubmission;