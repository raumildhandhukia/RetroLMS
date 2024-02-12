import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes, Route,
} from "react-router-dom";
import StudentPage from './Components/Student/StudentPage';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/student" element={<StudentPage />} />
      </Routes>
    </Router>
    {/* </header> */}   
     </div>
  );
}

export default App;
