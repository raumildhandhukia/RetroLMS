import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';
import { BrowserRouter, Route, Routes } from"react-router-dom";
import InstructorDashboard from "./InstructorDashboard";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
      <BrowserRouter>
          <Routes>
              <Route index element={<Login />} />
              <Route path="/" element={<Login />} />
              <Route path="/instructorDashboard" element={<InstructorDashboard />} />
              <Route path="/courses" element={<InstructorDashboard />} />
          </Routes>
      </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
