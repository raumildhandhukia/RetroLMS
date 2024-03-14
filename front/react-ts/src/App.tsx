import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"

// pages
import Login from './Components/Login'
import StudentPage from './Components/StudentPage'
import InstructorDashboard from "./InstructorDashboard";
import Dashboard from "./Components/Dashboard/index";
import Tasks from "./Components/Task/Tasks";
import Task from "./Components/Task/Task";
import CourseDetailPage from "./CourseDetailPage";
import {CourseProvider} from "./CourseContext";
import LeaderboardList from "./Components/Leaderboard/LeaderboardList";
import studentsData from './Components/Leaderboard/students.json'

function App() {
  return (
      <CourseProvider>
    <BrowserRouter>
      <main>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<StudentPage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/task" element={<Task />} />
            <Route path="/instructorDashboard" element={<InstructorDashboard />} />
            <Route path="/course/:id" element={<CourseDetailPage/>} />
            <Route path="/leaderboard" element={<LeaderboardList students={studentsData.students}/>} />
        </Routes>
      </main>
    </BrowserRouter>
      </CourseProvider>
  );
}

export default App;
