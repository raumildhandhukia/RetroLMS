import React from "react";

const DeletePrompt: React.FC = () => {

    return (
        <div>
            <div id="delete-prompt">
                Are you sure you want to delete this course?
            </div>
            <div>
                <button>Yes</button>
                <button>No</button>
            </div>
            
        </div>
    )
}

export default DeletePrompt;