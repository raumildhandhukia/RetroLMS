import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"

// pages
import Login from './Components/Login'
import StudentPage from './Components/StudentPage'
import InstructorDashboard from "./InstructorDashboard";
import EightBitArrowButton from "./Components/Buttons/EightBitArrowButton";
import Dashboard from "./Components/Dashboard/index";
import Tasks from "./Components/Task/Tasks";
import Task from "./Components/Task/Task";
import CourseDetailPage from "./CourseDetailPage";
import {CourseProvider} from "./CourseContext";
import Items from "./Components/Shop/Items";
import Item from "./Components/Shop/Item";
import LeaderboardList from "./Components/Leaderboard/LeaderboardList";
import studentsData from './Components/Leaderboard/students.json'
import AddItem from "./Components/Shop/AddItem";
import Leaderboard from './Components/Leaderboard/Leaderboard';
import AddTask from "./Components/Task/AddTask";


function App() {
  return (
      <CourseProvider>
    <BrowserRouter>
      <main>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/courses" element={<StudentPage />} />
            {/*<Route path="/tasks" element={<Tasks />} />*/}
            <Route path="/task" element={<Task />} />
            <Route path="/instructorDashboard" element={<InstructorDashboard />} />
            {/* <Route path="/course/:id" element={<CourseDetailPage/>} /> */}
            {/* <Route path="/items" element={<Items />} /> */}
            {/* <Route path="/items/add" element={<AddItem />} /> */}
            <Route path="/item" element={<Item />} />
            {/* <Route path="/task/create" element={<AddTask />} /> */}
            <Route path="/task" element={<Task />} />
            <Route path="/leaderboard" element={<LeaderboardList students={studentsData.students}/>} />
        </Routes>
      </main>
    </BrowserRouter>
      </CourseProvider>
  );
}

export default App;
