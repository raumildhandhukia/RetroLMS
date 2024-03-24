
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "nes.css/css/nes.min.css";
import ItemList from './ItemList';
import InstructorItemList from "./InstructorItemList";

interface Item{
    _id: string;
    title: string;
    description: string;
    price: number;
    courseName: string;

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
      // Function to fetch tasks from the server
      const fetchItems = async () => {
        try {

          //fetch course by calling '/coursesById' and use this courseID to fetch all the Items
          const courseId = await fetch('http://localhost:8080/coursesById', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          //const courseName = '65d7c8254df4ea811a701b00'; // Replace with the actual courseName
          const response = await fetch(`http://localhost:8080/items/course/${courseId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch items');
          }

          //const items: Item[] = response; //await response.json();

          const updatedItems = items.map(item => ({ ...item, course: courseName}));
          setItems(updatedItems); // Update tasks state with the received data
        } catch (error) {
          console.error('Error fetching items:', error);
          // You can handle the error appropriately (e.g., show an error message)
        }
      };
  
      // Call the fetchTasks function when the component mounts
      fetchItems();
    }, []); // The empty dependency array ensures that this effect runs only once when the component mounts
  
    return (
      role === "student" ? 
      <ItemList items={items} courseName={courseName} /> : 
      <InstructorItemList items={items} courseName={courseName} />
    );
  };


export default Items