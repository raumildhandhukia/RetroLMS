
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "nes.css/css/nes.min.css";
import ItemList from './ItemList';
import InstructorItemList from "./InstructorItemList";

export interface Item {
    _id: string;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    courseName: string;
    courseId: string;
    itemExpiry: number;

}

const Items: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [courseName, setCourseName] = useState<string>('SER517');
    const [role, setRole] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
      const checkProfile = async () => {
        try {
          const response = await fetch("http://localhost:8080/profile", {
            method: "GET",
            credentials: "include", // Include cookies in the request
          });
          if (response.ok) {
            const data = await response.json();
            setRole(data.role);
          } else {
            console.log("User not found");
          }
        } catch (error) {
          console.error("Error checking for profile", error);
        }
      };
  
      checkProfile();
    }, []);
  
    useEffect(() => {
      // Function to fetch items from the server
      const fetchItems = async () => {
        try {


          //fetch course by calling '/coursesById' and use this courseID to fetch all the Items
          const courseId = '65ee276576ac94ef4a77bdba'
          // await fetch('http://localhost:8080/coursesById', {
          //   method: 'GET',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          // })
          //const courseName = '65d7c8254df4ea811a701b00'; // Replace with the actual courseName
          const response = await fetch(`http://localhost:8080/items/course/${courseId}`, {
            method: 'GET',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
            },

          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch items');
          }
          
         const items : Item[] = await response.json();
         console.log(items)
         const updatedItems = items.map(item => ({ ...item, course: courseName}));
         setItems(updatedItems); // Update tasks state with the received data
        } catch (error) {
          console.error('Error fetching items:', error);
          // You can handle the error appropriately (e.g., show an error message)

        }
      };
  
      fetchItems();
    }, []);
  
    return (
      role === "student" ? 
      <ItemList items={items} courseName={courseName} /> : 
      <InstructorItemList items={items} courseName={courseName} />
    );
  };


export default Items