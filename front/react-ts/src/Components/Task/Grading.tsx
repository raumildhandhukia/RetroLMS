import React, { useState, useEffect, useRef } from "react";
import "nes.css/css/nes.min.css";
import StudentPoints from "./StudentPoints";

interface GradingProps {
  taskId: string;
}

const Grading: React.FC<GradingProps> = ({ taskId }) => {
  const [submissionRecords, setSubmissionRecords] = useState([]);
  useEffect(() => {
    const fetchSubmissionRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/getSubmissionsByTask/${taskId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch submission records");
        }
        const data = await response.json();
        setSubmissionRecords(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubmissionRecords();
  }, [taskId]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          {submissionRecords.map((sub: any) => {
            return (
              <StudentPoints
                studentName={sub.studentName}
                points={sub.points}
                submissionId={sub._id}
                key={sub._id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Grading;
