import React, { useState } from 'react';

interface StudentPointsProps {
    studentName: string;
    points: number;
    submissionId: string;
}

const StudentPoints: React.FC<StudentPointsProps> = ({ studentName, points, submissionId }) => {

    const [point, setPoint] = useState(points);

    const handleOnBlur = async (event: any) => {
        try {
            const response = await fetch(`http://localhost:8080/updateSubmission/${submissionId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    points: point
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update points");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="nes-container with-title is-centered" onBlur={handleOnBlur}
        key={submissionId} style={{marginBottom:"10px" }}>
            <p className="title">{studentName}</p>
            <div style={{ display: "inline-flex" }}>
                <div style={{backgroundColor:"#212522", padding: "1rem"}} className="nes-field is-inline">
                    <label style={{color:"#fff"}}>Points</label>
                    <input type="number" id="dark_field" className="nes-input is-dark" placeholder="0" value={point} onChange={(e)=>{setPoint(Number(e.target.value))}}/>
                </div>
            </div>
        </div>
    );
}

export default StudentPoints;