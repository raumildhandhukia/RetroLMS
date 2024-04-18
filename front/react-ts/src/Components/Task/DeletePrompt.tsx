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


    const renderDeletePrompt = () => (
        <div className="">
          <section className="message-right" style={{marginRight:'50%'}}>
            <div className="nes-balloon from-left">
              <p style={{textAlign:'left'}}>You are about to delete this task. Are you sure?</p>
            </div>
          </section>
          <img style={{width:'80px'}} src={require('../Leaderboard/avatar0.png')} alt="My Icon" />
          <section className="message -right" style={{marginLeft:'30%'}}>
            <div style={{marginLeft:'30%', marginTop:'-50px'}}className="nes-balloon from-right">
              <p style={{textAlign:'left'}}>I decide things.</p>
                      <button className="nes-btn is-error" onClick={deleteTask}>Yes</button>
                <button className="nes-btn is-success" onClick={()=>{
                    redirectToTaskList();
                }} style={{marginLeft:"10vh"}}>No</button>
            </div>
            <img style={{width: '100px', marginLeft:'88%'}} src={require('../Shop/avatar.png')} alt="My Icon" />
          </section>
        </div>
     
    );

    return (
        <div>
            {renderDeletePrompt()}
            
        </div>
    )
}

export default DeletePrompt;