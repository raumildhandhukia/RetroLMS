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
        <div className="nes-container is-centered">
            <div id="delete-prompt">
                Are you sure you want to delete this course?
            </div>
            <div style={{
                marginTop: "10vh",
            }}>
                <button className="nes-btn is-error" onClick={handleYes}>Yes</button>
                <button className="nes-btn is-success" onClick={()=>{
                    handleBack();
                }} style={{marginLeft:"10vh"}}>No</button>
            </div>
            
        </div>
    )
}

export default DeletePrompt;