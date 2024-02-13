import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes, Route,
} from "react-router-dom";
import StudentPage from './Components/Student/StudentPage';
import { Link } from 'react-router-dom';

const App: React.FC = () => {

  const handleLogin = (credentials: { username: string, password: string }) => {
    // Perform authentication logic here...
    // Assuming authentication is successful and role is determined
    const role = determineRole(credentials.username);
    console.log(role);
    // You need to implement this function
    if (role === 'student') {
      // We need to integrate student page here
    } else if (role === 'instructor') {
      // We need to integrate Instructor page here
    } else {
      // Handle invalid credentials or role here
      window.location.href="http://localhost:3000/instructorDashboard";
      console.error('Invalid credentials or role');
    }
  };

  // Function to determine role based on username
  const determineRole = (username: string): string => {
    if (username==="rohith") {
      console.log("hello rohith");
      return 'student';
    } else if(username==="vamsi") {
      return 'instructor';
    } else {
      // Default to invalid role
      return '';
    }
  };
  return (
        <div id="NewRootRoot" className="center-container">
          <div className="login-container">
            <img src="https://file.rendit.io/n/mWZVWPIwAmEIOBF3b0E9.png" alt="Arizona State University"
                 className="logo"></img>
            <div className="form-container">
              <h1 className="form-title">Sign In</h1>
              <div className="form-group">
                <label htmlFor="asuriteId" className="form-label">ASURITE User ID</label>
                <input id="asuriteId" type="text" placeholder="" className="form-input"></input>
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input id="password" type="password" placeholder="" className="form-input"></input>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const username = formData.get('username') as string;
                const password = formData.get('password') as string;
                handleLogin({username, password});
              }}>
                <button className="form-button" type="submit">Sign In</button>
              </form>
            </div>
          </div>
        </div>
  );}
export default App;
