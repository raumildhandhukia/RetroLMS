
import React, { useState, ChangeEvent } from 'react';
import 'nes.css/css/nes.min.css';
import EightBitButton from '../Buttons/EightBitButton';

interface CreateTaskRequest {
    taskName: string;
    taskDeadline: string;
    taskDetails: string;
    taskPoint: number;
    courseId: string;
}

const AddTask: React.FC<{}> = () => {
    const [request, setRequest] = useState<CreateTaskRequest>({
        taskName: "",
        taskDeadline: "",
        taskDetails: "",
        taskPoint: 0,
        courseId: ""
    })

    const inputFields: {
        id: keyof CreateTaskRequest
        name: string
        type: string
    }[] = [
        {id: "taskName", name: "Task Name" , type: "string"},
        {id: "taskDeadline", name: "Task Deadline" , type: "string"},
        {id: "taskDetails", name: "Task Details" , type: "string"},
        {id: "taskPoint", name: "Task Point", type:"number"},
        {id: "courseId", name: "Course ID", type: "string" }
    ]

    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        let { id, value } = event.target
        let valueToUpdate
        id === "taskPoint"?
            valueToUpdate = parseInt(value) :
            valueToUpdate = value

        setRequest({
            ...request,
            [id]: valueToUpdate
        })
    }

    const handleAddItem = async () => {
        try {
            const {
                taskName,
                taskDeadline,
                taskDetails,
                taskPoint,
                courseId,
            } = request
            const response = await fetch("http://localhost:8080/tasks/add", {
                method: "POST",
                body: JSON.stringify({
                    taskName,
                    taskDeadline,
                    taskDetails,
                    taskPoint,
                    courseId,
                })
            });

            if (response.ok) {
                console.log("Task was created.")
            }

        } catch (error) {
            console.error("Error creating task.", error);
        }
    }

    return (
        <div className="task-description-container mt-28">
            <div className="nes-container with-title is-centered">
                <p className="title">Add Item</p>
                <div className="field-container">
                    {inputFields.map(({id, name, type}) => {
                        return (
                            <div className="nes-field">
                                <label htmlFor={id}>{name}</label>
                                <input
                                    type={type}
                                    id={id}
                                    className="nes-input"
                                    value={request[id]}
                                    onChange={(event) => handleInputChange(event)}
                                />
                            </div>
                        )
                    })}
                </div>
                <div className='flex tasks-start my-10'>
                    <EightBitButton onClick={handleAddItem}>ADD</EightBitButton>
                </div>
            </div>
        </div>
    );
};
export default AddTask;
