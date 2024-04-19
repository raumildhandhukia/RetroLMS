import React, {useEffect, useState} from "react";

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
    const [isLoading, setIsLoading] = useState(false);
    const [loaderMessage, setLoaderMessage] = useState('Deleting course...');
    const [stringOfExclamation, setStringOfExclamation] = useState('!');

    useEffect(() => {
        if (isLoading) {
            const t1 = setTimeout(() => {
                setLoaderMessage('Just a bit longer');
            }, 3000);

            const t2 = setTimeout(() => {
                setLoaderMessage('Almost done');
            }, 6000);

            const t3 = setInterval(() => {
                setStringOfExclamation((prev) => prev.length < 3 ? prev + '!' : '!');
            }, 500);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearInterval(t3);
            };
        }
    }, [isLoading]);

    const deleteCourse = async () => {
        setIsLoading(true);
        setLoaderMessage('Deleting course data...');
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
        finally {
            setIsLoading(false);
        }
    }

    const handleYes = () => {
        deleteCourse();
        handleBackToDashboard();
    }

    return (
        <div className="">
            {isLoading ? (
                <div className="loading-container" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <p>{loaderMessage}{stringOfExclamation}</p>
                </div>
            ) : (
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
                )}
      </div>
    )
}

export default DeletePrompt;