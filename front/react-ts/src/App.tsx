import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"

// pages
import Login from './Components/Login'
import StudentPage from './Components/StudentPage'
import InstructorDashboard from "./InstructorDashboard";
import Dashboard from "./Components/Dashboard";
import EightBitArrowButton from "./Components/Buttons/EightBitArrowButton";

function App() {
  return (

    <BrowserRouter>
      <main>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<StudentPage />} />
            <Route path="/instructorDashboard" element={<InstructorDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
