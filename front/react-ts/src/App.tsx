import { BrowserRouter, Routes, Route } from "react-router-dom"

// pages
import Login from './Components/Other/Login'
import Dashboard from "./Components/Dashboard/index";
import CreatePassword from "./Components/Other/CreatePassword";


function App() {
  return (
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
  );
}

export default App;
