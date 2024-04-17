import React, { useState, useEffect, } from "react";
import "nes.css/css/nes.min.css";
import StudentPoints from "./StudentPoints";
import * as XLSX from 'xlsx';

interface GradingProps {
    taskId: string;
}

const Grading: React.FC<GradingProps> = ({ taskId }) => {
    const [submissionRecords, setSubmissionRecords] = useState([]);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchSubmissionRecords = async () => {
            console.log('tasks', taskId);
            try {
                const response = await fetch(`http://localhost:8080/getSubmissionsByTask/${taskId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch submission records");
                }
                const data = await response.json();
                setSubmissionRecords(data);
                console.log('data from backend', data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchSubmissionRecords();
    }, [taskId]);

      
        const HandleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (!file) {
            console.log("No file selected");
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            const binaryStr = e.target?.result as string;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const newData = XLSX.utils.sheet_to_json(sheet);
            submissionRecords.map((record: any) => {
                if(newData){
                    newData.map((newRecord: any) => {
                        if (newRecord.studentName == record.studentName) {
                            record.points = newRecord.points
                        }
                    })
                }
            })
            setRecords(submissionRecords);
          };
          reader.readAsBinaryString(file);
        };  
      
    return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={HandleFile}
          id="fileInput"
          className="nes-input"
          style={{marginBottom: '20px'}}
        />
        <div>
            {  records ? 
                submissionRecords.map((sub: any) => {
                    return (<StudentPoints studentName={sub.studentName} points={sub.points} submissionId={sub._id} key={sub._id} />)
                }) : submissionRecords.map((sub: any) => {
                    return (<StudentPoints studentName={sub.studentName} points={sub.points} submissionId={sub._id} key={sub._id} />)
                })
            }
        </div>
        </div>
    </div>
);


};

export default Grading;