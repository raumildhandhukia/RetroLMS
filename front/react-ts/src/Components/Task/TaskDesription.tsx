import React, { useState, useEffect, useRef } from "react";
import "nes.css/css/nes.min.css";
// import "./TaskDescription.css";
import DeletePrompt from "./DeletePrompt";
import Grading from "./Grading";
import Loader from "../Other/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TaskDescriptionProps {
  selectedTask: {
    _id: string;
    title: string;
    deadline: string;
    details: string;
    point: number;
    graded: boolean;
  };
  onClickBack: Function;
  updateTasks: Function;
  role: string;
}

// Assuming this component is now for editing, not just displaying
const TaskDescription: React.FC<TaskDescriptionProps> = ({
  selectedTask: task,
  onClickBack,
  updateTasks,
  role,
}) => {
  const [title, setTitle] = useState(task.title);
  const [details, setDetails] = useState(task.details);
  const [deadline, setDeadline] = useState(task.deadline);
  const [point, setPoint] = useState(task.point + "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleating, setIsDeleating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [graded, setGraded] = useState(task.graded);
  const [gradePoints, setGradePoints] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taskId = task._id;;

  useEffect(() => {
    const getGrades = async () => {
      const response = await fetch(
        "http://localhost:8080/getGradePoints/" + task._id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log("Failed to fetch grade points");
      }
      const data = await response.json();
      setGradePoints(data.grade);
    };

    if (graded && role === "student") {
      getGrades();
    }
  }, [graded, task._id, role]);

  const handleUpdateTask = async () => {
    if (isEditing) {
      if (!title || !deadline || !details || !point) {
        setErrorMessage("All fields are required.");
        return;
      }

      try {
        setIsLoading(true);
        const task_id = task._id;
        const response = await fetch(
          "http://localhost:8080/task/update/" + task_id,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              details,
              point,
              deadline,
              graded,
            }),
          }
        );

        setIsLoading(false);
        if (!response.ok) {
          const responseData = await response.json();
          throw new Error(responseData.message || "Something went wrong!");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        setErrorMessage("Something went wrong!");
      }
      setErrorMessage("");
      setIsEditing(false);
      updateTasks();
      task.title = title;
      task.details = details;
      task.deadline = deadline;
      task.point = parseInt(point);
      task.graded = graded;
    } else {
      setIsEditing(true);
    }
  };

  const handleExcelUpload = () => {
    console.log(taskId);
  };

  const handleEditMode = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    setIsDeleating(true);
  };

  const handleGrade = async () => {
    setIsGrading(true);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) { 
        fileInputRef.current.click();
    }
};
    


const handleFileChange = async (event:any) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('taskId', taskId);
  setIsLoading(true);

  try {
      const response = await fetch('http://localhost:8080/gradingMutipleSubmission', {
          method: 'POST',
          body: formData,
      });
      console.log(response)
      const result = await response.json();
      if (response.ok) {
          toast.info('File uploaded successfully: ' + JSON.stringify(result.message), {
            position: toast.POSITION.TOP_CENTER,
          });
      } else {
          toast.info('Currupt File !!! ' + result.message, {
            position: toast.POSITION.TOP_CENTER,
          });
      }
  } catch (error:any) {
      toast.info('Error uploading file: ' + error.message, {
            position: toast.POSITION.TOP_CENTER,
          });
  } finally {
      event.target.value = null;
      setIsLoading(false);
  }
  };
     const renderDescriptionPage = () => (
            <div style={{
                minWidth: '100vh',
            }}>
                <div className="field-container-two">
                    <div className="nes-field">
                        <label htmlFor="title_field">Title:</label>
                        {!isEditing ?
                        <p onDoubleClick={handleEditMode}>{task.title}</p>
                        :
                        <input
                            type="text"
                            id="title_field"
                            className="nes-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        }
                    </div>
      
                    <div className="nes-field">
                        <label htmlFor="points_field">Max Points:</label>
                        {!isEditing ?
                        <p onDoubleClick={handleEditMode}>{task.point}</p>
                        :
                        <input
                            type="number"
                            id="points_field"
                            className="nes-input"
                            value={point}
                            onChange={(e) => setPoint(e.target.value)}
                        />}
                    </div>
                </div>
                <div className="nes-field description-field">
                    <label htmlFor="description_field">Description:</label>
                    {!isEditing ?
                    <p style={{
                        textAlign: 'left',
                        minHeight: '40vh',
                    }} onDoubleClick={handleEditMode}>{task.details}</p>
                    :
                    <textarea
                        id="description_field"
                        className="nes-textarea"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        rows={12}
                    />}
                </div>
                <div className="nes-field description-field">
            
                    {!isEditing ?
                    <div style={{display:role==='instructor'?"block":"none"}}>
                        <div className="nes-badge is-splited" style={{width:'40%'}}>
                        <span className="is-dark">Graded</span>
                            <span className={graded ? 'is-primary' : 'is-error' }>
                                {graded ? 'YES' : 'NO'}
                            </span>
                    </div>  
                    </div>
                    :

                    <label htmlFor="graded_field">
                    <input
                        type="checkbox"
                        id="graded_field"
                        className="nes-checkbox"
                        checked={graded}
                        onChange={(e) => setGraded(!graded)}
                    />
                    <span>Graded</span>
                    </label>
                    }
                </div>

                {/* Error Message */}
                {errorMessage && <p className="nes-text is-error">{errorMessage}</p>}
                {/* Add Task Button */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize:'8px'}}>
                    <button type="button" className='nes-btn is-error' onClick={() => {
                        onClickBack();
                    }}>
                        Back
                    </button>
                    <div className="nes-badge is-splited" style={{width:'40%', display:role==='student'?"block":"none"}}>
                        <span className="is-dark">{graded?"Points":"Graded"}</span>
                            <span className={graded ? 'is-primary' : 'is-error' }>
                                {graded ? gradePoints : 'NO'}
                            </span>
                    </div>  

                    {role === 'instructor' ? (<>
                        
                        <button type="button" className={`nes-btn is-primary`}
                                onClick={handleUpdateTask} disabled={isLoading}>
                            Update Task
                        </button>

                        <button type='button' className='nes-btn is-error' onClick={handleDelete} >Delete</button>
                        <button type='button' className='nes-btn is-success' onClick={handleGrade} >Grade</button>
                        <div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".xlsx, .xls"
              />
              <button
                type="button"
                className="nes-btn is-primary"
                onClick={handleButtonClick}
              >
                Upload Excel
              </button>
            </div>

                    </>) : null}
                    
                </div>
            </div>);

const renderLoadingPage = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vh',
        height: '80vh',
    }}>
        <div className="" style={{
            width: '50%',
            height: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Loader style={{color:'black'}}/>
        </div>
    </div>
);

return (
    <div className="task-description-container" >
        <div className="nes-container with-title is-centered" style={{marginTop:"auto", minWidth:'100vh', minHeight:'70vh'}} >
            <p className="title">{title}{isGrading && ' Grading Panel'}</p>
            {
              isLoading ? renderLoadingPage() :
            !isGrading ?
                !isDeleating ? 
                    renderDescriptionPage() : 
                        <DeletePrompt task={task} redirectToTaskList={onClickBack}/> : 
                            <Grading taskId={task._id}/>
            }
            
        </div>
    </div>
);

};

export default TaskDescription;
