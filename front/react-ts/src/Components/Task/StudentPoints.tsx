import React, { useState } from 'react';

interface StudentPointsProps {
    studentName: string;
    points: number;
    submissionId: string;
}

const StudentPoints: React.FC<StudentPointsProps> = ({ studentName, points, submissionId }) => {

    const [point, setPoint] = useState(points);

    const handleOnBlur = async (event: any) => {
        console.log('props', submissionId );
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
    console.log('props', studentName, points, submissionId )
    return (
        <div className="nes-container with-title is-centered" onBlur={handleOnBlur}
        key={submissionId} style={{marginBottom:"10px" }}>
            <p className="title">{studentName}</p>
            <div style={{ display: "inline-flex" }}>
                <div style={{backgroundColor:"#212522", padding: "1rem"}} className="nes-field is-inline">
                    <label style={{color:"#fff"}}>Points</label>
                                    <span>{points}</span>
                                    <input
                                        type="number"
                                        id="dark_field"
                                        className="nes-input is-dark"
                                        placeholder="0"
                                        value={points || ""}
                                        onChange={(e)=>{setPoint(Number(e.target.value))}}
                                    />
                              
                </div>
            </div>
        </div>
    );
}

export default StudentPoints;