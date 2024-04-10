import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'nes.css/css/nes.min.css';
import './TaskList.css';
import AddTask from './AddTask';
import TaskDescription from './TaskDesription';

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
  updateTasks: Function;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, courseName ,courseId, updateTasks}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createTask, setCreateTask] = useState<boolean>(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const showTaskList = () => {
    setCreateTask(false);
    updateTasks();
  };

  const onClickBack = () => {
    setSelectedTask(null);
    updateTasks();
  }

  const renderTaskDescription = () => {
    if (selectedTask) {
      return (

          <TaskDescription selectedTask={selectedTask} onClickBack={onClickBack} updateTasks={updateTasks}/> 
          
      );
    } else {
      return null;
    }
  };

  return (
    <div className="task-list-container">
      {!selectedTask ? (<div className="nes-container with-title is-centered">
        <p className="title">{courseName}</p>
        {createTask ? (
          
          <AddTask createTask = {createTask} showTaskList = {showTaskList} courseId = {courseId}/> ) : 
          (<div className="task-list-content">
          <h2>Task List</h2>
          <table className="nes-table is-bordered is-centered">
            <thead>
              <tr>
                <th className="task-title">Task Title</th>
                <th className="task-deadline">Task Deadline</th>
                <th className="task-points">Task Title</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="task-item" onClick={() => handleTaskClick(task)}>
                  {/* Use onClick to call handleTaskClick on click */}
                  <td >{task.title}</td>
                  <td >{task.deadline}</td>
                  <td >{task.point}</td>
                </tr>
              ))}
            </tbody>
            
          </table>
          <button 
            className="nes-btn is-primary"
            onClick={() => setCreateTask(true)}>
                Add Task
          </button>
        </div>
          )
      }
      </div>
      ) :
      (
        <div className="task-description">
        {/* Render the task description component conditionally */}
        {renderTaskDescription()}
      </div>
      )
    }
    </div>
  );
};

export default TaskList;
