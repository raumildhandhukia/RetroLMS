import { BrowserRouter, Routes, Route } from "react-router-dom"

// pages
import Login from './Components/Login'
import Dashboard from "./Components/Dashboard/index";
import {CourseProvider} from "./CourseContext";
import CreatePassword from "./Components/CreatePassword";


function App() {
  return (
      <CourseProvider>
    <BrowserRouter>
      <main>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createPassword" element={<CreatePassword />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
      </CourseProvider>
  );
}

export default App;
