import React from "react";

interface DeletePromptProps {
    handleBack: Function;
    handleBackToDashboard: Function;
    courseId: string;
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
    handleBack,
    handleBackToDashboard,
    courseId
}) => {

    const deleteCourse = async () => {
        try {
            const response = await fetch("http://localhost:8080/courses", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId
                })
            });

            if (!response.ok) {
                console.log('Failed to delete course')
            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    }

    const handleYes = () => {
        deleteCourse();
        handleBackToDashboard();
    }

    return (
        <div className="">
        <div className="nes-container is-rounded with-title" style={{width:'100vh'}}>
          <p className="title" style={{color:"red"}}>Warning !!!</p>
          <section className="message-right">
            <div className="nes-balloon from-left">
              <p>You are about to delete this course, professor !!! All the tasks, students, and items will be destroyed. Are you sure?</p>
            </div>
          </section>
          <img style={{width:'80px'}} src={require('../Leaderboard/avatar0.png')} alt="My Icon" />
          <section className="message -right">
            <div style={{marginLeft:'30%', marginTop:'-50px'}}className="nes-balloon from-right">
              <p>Let me think about it. This was an amazing course.</p>
                      <button className="nes-btn is-error" onClick={handleYes}>Yes</button>
                <button className="nes-btn is-success" onClick={()=>{
                    handleBack();
                }} style={{marginLeft:"10vh"}}>No</button>
            </div>
            <img style={{width: '100px', marginLeft:'88%'}} src={require('../Shop/avatar.png')} alt="My Icon" />
          </section>
        </div>
      </div>
    )
}

export default DeletePrompt;