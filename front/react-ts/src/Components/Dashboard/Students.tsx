import React, { useState, useEffect} from 'react';
import StudentData from './Student';

interface StudentProps {
    courseId: string;
}

export interface Student {
    studentId: string;
    userId: string;
    userName: string;
    fullName: string;
    password: string;
}

const Students:React.FC<StudentProps> = ({courseId}) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [studentCount, setStudentCount] = useState<number>(1);
    const [updateStudents, setUpdateStudents] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`http://localhost:8080/getEnrolledStudents/${courseId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }
                const students = await response.json();
                setStudents(students);
                console.log("Fetched students:", students)
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
        fetchStudents();
    }
    , [updateStudents, courseId]);

    const handleGenerateStudents = async () => {
        try {
            const response = await fetch(`http://localhost:8080/studentSignup`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseId: courseId,
                    count: studentCount,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to generate students");
            }
            setUpdateStudents(!updateStudents);
            setStudentCount(1);
            console.log("Generated students:", students)
        } catch (error) {
            console.error("Error generating students:", error);
        }
    };

    const handleStudentClick = (student: Student) => {
        setSelectedStudent(student);
    }

    const handleBack = () => {
        setSelectedStudent(null);
        setUpdateStudents(!updateStudents);
    }

   return (
    <div className="nes-container with-title" style={{ fontSize: "0.8rem" }}>

        {selectedStudent ? (<StudentData student={selectedStudent} handleBack = {handleBack}/>) : (
            <div className='all-students-container'>
                <p className="title">Students</p>
                <label htmlFor="studentCount" className="nes-text" style={{ marginRight: "1rem" }}>Enter number of students to generate:</label>
                <div className="nes-field" style={{ display: "flex", alignItems: "center" }}>
                    <input 
                        type="number" 
                        id="studentCount" 
                        className="nes-input" 
                        placeholder="E.g., 10" 
                        value={studentCount} 
                        onChange={(e) => setStudentCount(Math.floor(Number(e.target.value)))}
                        style={{ flex: 1, marginRight: "1rem" }}
                    />
                    <button 
                        type="button" 
                        onClick={handleGenerateStudents} 
                        className="nes-btn is-primary"
                        style={{ width: "80%" }}
                    >
                        Generate Students
                    </button>
                </div>
                <div className="student-list" style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem" }}>
                    {students.map((student, index) => (
                        <div key={index} onClick={()=>{handleStudentClick(student)}}
                        className="nes-container" style={{ marginRight: index%2 === 0 ? "1rem" : "0rem" , marginBottom: "1rem", width: "44vh"}}>
                            <p>{student.fullName}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        
    </div>
)



};
export default Students;