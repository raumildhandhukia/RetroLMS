import React, { useState, useEffect } from 'react';
import { Student } from './Students';

interface StudentProps {
    student: Student;
    handleBack: () => void;
}

const StudentData: React.FC<StudentProps> = ({ student, handleBack }) => {
    
    const handleDrop = async () => {
        try {
            const response = await fetch(`http://localhost:8080/deleteStudent/${student.studentId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete student");
            }
            handleBack();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    return (
        <div className="nes-container with-title is-centered student-data-container">
            <p className="title">Student Information</p>
            <div className="nes-container is-rounded is-dark student-info" style={{ textAlign: "left" }}>
                <p>Full Name: {student.fullName}</p>
                <p>Password: {student.password}</p>
            </div>
            <button className="nes-btn is-success" style={{
                marginTop: "5rem",
                width: "15vh"
            }} type="button"
            onClick={handleBack}>Back</button>
            <button className="nes-btn is-error" style={{
                marginTop: "5rem",
                marginLeft: "2rem",
                width: "15vh"
            }} type="button"
            onClick={handleDrop}>Delete</button>
        </div>
    )
}

export default StudentData;
