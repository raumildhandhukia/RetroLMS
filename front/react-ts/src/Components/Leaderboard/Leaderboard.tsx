import React, { useState, useEffect } from "react";
import Loader from "../Loader";
import { render } from "@testing-library/react";

interface LBProps {
  courseId: string;

}
interface StudentScore  {
    name: string;
    score: number;
  }
const Leaderboard: React.FC<LBProps> = ({courseId}) => {
  const [data, setData] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to fetch students enrolled in the specified course
    const fetchStudents = async () => {
      try {

        const response = await fetch(`http://localhost:8080/leaderboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseId }),
          credentials: 'include',
        })
        if (!response.ok) {
          console.log('no data or error')
        } else {
          setData(await response.json());
        } 
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
          setLoading(false);
      }
    };
    fetchStudents();
  }, []); 

const renderLeaderboard = () => {
  return (
    <div className="nes-container with-title is-dark">
      <p className="title" style={{
        color: 'yellow',
      }}>Leaderboard</p>
      {data.map((student, index) => (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100vh',
        }}>
          <div key={index} className="nes-container is-rounded with-title is-dark" style={{
            width: '80%',
            textAlign: 'center'
          }}>
            <p className="title" style={{color:'red'}}>{index + 1}</p>
              <p style={{color:'yellow', margin:'-10px 0px 8px 0px'}}>{student.name}</p>
          </div>
          <div className="nes-container is-rounded with-title is-dark" style={{
            textAlign: 'center',
          }}>
            <p className="title" style={{
              color: 'red',
            }}>Score</p>
            <p style={{color:'yellow', margin:'-10px 0px 8px 0px'}}>{student.score}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

  const renderNoData = () => {
    return (
      <div>
        <h1>No data</h1>
      </div>
    );
  }

  return (
    <>
      {
        loading ? <Loader /> : data.length ? renderLeaderboard() : renderNoData()
      }
    </>
  );
};

export default Leaderboard;
