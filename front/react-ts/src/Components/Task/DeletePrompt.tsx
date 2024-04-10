import React from "react";

interface DeletePromptProps {
    task: {
        _id: string;
        title: string;
        deadline: string;
        details: string;
        point: number;
    };
    redirectToTaskList: Function;
}

const DeletePrompt: React.FC<DeletePromptProps> = ({task, redirectToTaskList}) => {

   const deleteTask =  async () => {
        try {
            const task_id = task._id;
            const response = await fetch('http://localhost:8080/task/delete/'+task_id, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Something went wrong!');
            }


        } catch (error) {
            console.error('Error updating task:', error);
        }
        
        redirectToTaskList();
    };


    return (
        <div>
            <div id="delete-prompt">
                Are you sure you want to delete this Task?
            </div>
            <div>
                <button onClick={deleteTask} style={{ marginRight: '20px' }} className='nes-btn is-error'>Yes</button>
                <button onClick={()=>{redirectToTaskList()}} className="nes-btn is-primary">No</button>
            </div>
            
        </div>
    )
}

export default DeletePrompt;