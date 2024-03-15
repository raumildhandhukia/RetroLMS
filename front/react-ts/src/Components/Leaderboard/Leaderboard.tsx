import React, { useState, useEffect } from "react";
import "nes.css/css/nes.min.css";
import LeaderboardList from "./LeaderboardList";
import studentsData from './students.json'

export interface Student {
  userId: string;
  enrolledCourses: EnrolledCourse[];
}

interface EnrolledCourse {
  courseId: string;
  completedTasks: CompletedTask[];
}

interface CompletedTask {
  taskId: string;
  title: string;
  point: number;
  deadline: string;
}

const Leaderboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Function to fetch students enrolled in the specified course
    const fetchStudents = async () => {
      try {
        const courseId = 'xxxx'; 
        //const response = await fetch(`http://localhost:8080/course/${courseId}/students`);

        // if (!response.ok) {
        //   throw new Error('Failed to fetch students');
        // }

        // const students: Student[] = await response.json();
        // Update students state with the received data and set course name
        setStudents(studentsData.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []); 

  return (
    <LeaderboardList students={students} />
  );
};

export default Leaderboard;
