// src/App.tsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TaskDescription from './TaskDesription';

function Task() {
  const location = useLocation();
  const task = location.state?.task || {}; 
  return (
    <div className="Task">
      {(
        <TaskDescription {...task} />
      )}
    </div>
  );
}

export default Task;
