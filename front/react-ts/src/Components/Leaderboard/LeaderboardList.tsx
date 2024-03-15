import React from 'react';
import 'nes.css/css/nes.min.css';
import './LeaderboardList.css'
import { Student } from './Leaderboard';

interface LeaderboardListProps {
  students: Student[];
}
  
const LeaderboardList: React.FC<LeaderboardListProps> = ({ students }) => {
  // Extract completed tasks and calculate total points for each student
  const leaderboardData = students.map((student) => {
    const completedTasks = student.enrolledCourses.flatMap((course) => course.completedTasks);
    const totalPoints = completedTasks.reduce((sum, task) => sum + task.point, 0);
    return {
      userId: student.userId,
      totalPoints,
      completedTasks,
    };
  });
  leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);
  return (
    <div className="nes-container with-title is-centered">
      <p className="title">Leaderboard</p>
      <div className="leaderboard-content">
        <table className="nes-table is-bordered is-centered">
          <thead className='sticky-head'>
            <tr>
              <th>Rank</th>
              <th>User ID</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr key={entry.userId}>
                <td>{index + 1}</td>
                <td>{entry.userId}</td>
                <td>{entry.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardList;
