import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"

// pages
import Login from './Components/Login'
import StudentPage from './Components/StudentPage'
import InstructorDashboard from "./InstructorDashboard";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<StudentPage />} />
            <Route path="/instructorDashboard" element={<InstructorDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App