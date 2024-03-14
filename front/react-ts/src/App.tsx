import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"

// pages
import Login from './Components/Login'
import StudentPage from './Components/StudentPage'
import InstructorDashboard from "./InstructorDashboard";
import EightBitArrowButton from "./Components/Buttons/EightBitArrowButton";
import Dashboard from "./Components/Dashboard/index";
import CourseDetailPage from "./CourseDetailPage";
import {CourseProvider} from "./CourseContext";
import LeaderBoard from "./Components/Dashboard/LeaderBoard"

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
            <Route path="/instructorDashboard" element={<InstructorDashboard />} />
            <Route path="/course/:id" element={<CourseDetailPage/>} />
            <Route path="/course/:id/leaderboard" element={<LeaderBoard/>} />
        </Routes>
      </main>
    </BrowserRouter>
      </CourseProvider>
  );
}

export default App;
