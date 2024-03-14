import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
interface LeaderboardEntry {
    _id: string; // Assuming this is the student ID for potential future use
    name: string;
    email: string;
    totalScore: number;
}

const Leaderboard: React.FC = () => {
    const { courseId } = useParams();
    // State to hold leaderboard data
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    // State to handle loading status
    const [isLoading, setIsLoading] = useState(true);
    // State to handle any errors
    const [error, setError] = useState('');

    useEffect(() => {
        // Define async function inside useEffect
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            try {
                // Assuming your server runs on localhost:8080 and uses /course/:courseId/leaderboard route
                const response = await fetch(`http://localhost:8080/course/${courseId}/leaderboard`, {
                    credentials: 'include', // If your API requires credentials
                    headers: {
                        'Content-Type': 'application/json',
                        // Any other headers you need like authorization
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard data');
                }
                const data = await response.json();
                setLeaderboardData(data.leaderboard); // Assuming the response has a 'leaderboard' property
            } catch (error) {
                //setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [courseId]); // Dependency array ensures this effect runs again if courseId changes

    if (isLoading) return <div>Loading leaderboard...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Leaderboard for Course ID: {courseId}</h2>
            {leaderboardData.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leaderboardData.map((student, index) => (
                        <tr key={index}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.totalScore}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div>No data available.</div>
            )}
        </div>
    );
};

export default Leaderboard;
