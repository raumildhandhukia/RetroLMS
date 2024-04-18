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
  graded: boolean;
}

interface TaskListProps {
  tasks: Task[];
  courseName: string;
  courseId: string;
  updateTasks: Function;
  role: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, courseName ,courseId, updateTasks, role}) => {
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

          <TaskDescription selectedTask={selectedTask} onClickBack={onClickBack} updateTasks={updateTasks} role={role}/> 
          
      );
    } else {
      return null;
    }
  };

  const convertIsoToReadable = (iso: string) => {
    const date = new Date(iso);

    const readableDate = date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
    });

    return readableDate == "Invalid Date" ? "" : readableDate;
  }

  return (
    <div className="task-list-container">
      {!selectedTask ? (<div className="nes-container with-title is-centered is-rounded">
        <p className="title text-[#305974]">{courseName} {createTask ? "Create Task": "Task List"}</p>
        {createTask ? (
          
          <AddTask createTask = {createTask} showTaskList = {showTaskList} courseId = {courseId} update={updateTasks}/> ) : 
          (<div className="task-list-content">
          <table className="nes-table is-bordered is-centered is-dark">
            <thead>
              <tr className='text-[#a4c7de] task-header'>
                <th className="task-title">Task Title</th>
                <th className="task-deadline">Task Deadline</th>
                <th className="task-points">Task Points</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="task-item text-[#5facdf]" onClick={() => handleTaskClick(task)}>
                  {/* Use onClick to call handleTaskClick on click */}
                  <td>{task.title}</td>
                  <td>{convertIsoToReadable(task.deadline)}</td>
                  <td>{task.point}</td>
                </tr>
              ))}
            </tbody>
            
          </table>
          {role === 'instructor' ? (
          <div className='mt-10'>
            <button 
              className="nes-btn is-primary"
              onClick={() => setCreateTask(true)}>
                  Add Task
            </button>
          </div>
        ) : null}
          
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
