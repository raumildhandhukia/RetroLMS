import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'nes.css/css/nes.min.css';
import "./TaskList.css";
import { Edit } from 'lucide-react';
import EightBitButton from '../Buttons/EightBitButton';

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
}
const InstructorTaskList: React.FC<TaskListProps> = ({ tasks, courseName }) => {
    const navigate = useNavigate();
    const handleEditClick = (task: Task, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent triggering click events on parent elements

        // Navigate to task description
        navigateToTaskDescription(task);

        // Then handle editing task logic
        handleEditTask(task._id);
    };
    const navigateToTaskDescription =( task: Task) => {
        navigate('/task', {state: {task}});
    };

    const handleEditTask = async (taskId: string) => {
        try {
            const response = await fetch("http://localhost:8080/task/updateTask?taskId={taskId}", {
                method: "POST",
                body: JSON.stringify({
                    _id: taskId,
                    taskName: "New Task",
                    taskDeadline: "Task Deadline",
                    taskDetails: "This is the updated Task",
                    taskPoints: 300,
                    courseId: "SER 517"
                })
            });

            if (response.ok) {
                console.log("Task was updated.")
            }

        } catch (error) {
            console.error("Error updating task", error);
        }
    };
    return (
        <div className="task-list-container">
            <div className="nes-container with-title is-centered">
                <p className="title">{courseName}</p>
                <div className="task-list-content">
                    <h2>Tasks List</h2>
                    <table className="nes-table is-bordered is-centered">
                        <thead>
                        <tr>
                            <th className="task-title">Task Title</th>
                            <th className="task-deadline">Task Deadline</th>
                            <th className="price">Edit</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tasks.map((task) => (
                            <tr key={task._id} className="task-item">
                                <td>{task.title}</td>
                                <td>{task.deadline}</td>
                                <td>
                                    <button onClick={(event) => handleEditClick(task, event)}>
                                        <Edit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex task-start ml-6">
                    <EightBitButton
                        classNames="bg-[#A52A2A] my-5"
                        onClick={() => {
                            navigate('/tasks/add')
                        }}
                    >
                        <p className="m-0 text-white">Add Task</p>
                    </EightBitButton>
                </div>
            </div>
        </div>
    );
};
export default InstructorTaskList