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
    } else if (role === 'instructor') {
    } else {
      // Handle invalid credentials or role here
      window.location.href="http://localhost:3000/instructorDashboard";
      console.error('Invalid credentials or role');
    }
  };

  // Dummy function to determine role based on username (for illustration purposes)
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
        <div id="NewRootRoot" className="flex justify-center items-center min-h-[100vh] bg-white">
          <div className="flex flex-col items-center w-full max-w-[400px] rounded-lg shadow border-2 border-black bg-gray-100">
            <img src="https://file.rendit.io/n/mWZVWPIwAmEIOBF3b0E9.png" alt="Arizona State University"
                 className="logo rounded-t-lg"></img>
            <div className="form-container px-4 pb-4">
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
                <button className="bg-[#8C1D40]/95 hover:bg-[#69293d] p-2 rounded-md text-white mt-4" type="submit">Sign In</button>
              </form>
            </div>
          </div>
        </div>
  );}
export default App;
