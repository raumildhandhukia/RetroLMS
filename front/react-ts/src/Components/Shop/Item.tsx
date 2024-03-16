// src/App.tsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ItemDescription from './ItemDescription';

function Item() {
  const location = useLocation();
  const item = location.state?.item || {}; 
  return (
    <div className="Item">
      {(
        <ItemDescription {...item} />
      )}
    </div>
  );
}

export default Item;
