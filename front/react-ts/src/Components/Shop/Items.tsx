
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
    courseId: string;
    itemExpiry: number;
}

interface ItemProps {
  role: string;
  courseId: string;
  studentBalance: number;
}

const Items: React.FC<ItemProps> = ({ role, courseId, studentBalance }) => {
    const [items, setItems] = useState<Item[]>([]);
    // const [courseName, setCourseName] = useState<string>('SER517');
    // const [role, setRole] = useState<string>('');
    const navigate = useNavigate();

    const [updateItems, setUpdateItems] = useState<boolean>(false);


    const updateItemList = () => {
      setUpdateItems(!updateItems);
    }

    useEffect(() => {
      // Function to fetch items from the server
      const fetchItems = async () => {
        try {
          // const courseId = '65ee276576ac94ef4a77bdba'; // Replace with the actual courseName
          console.log(courseId)
          const response = await fetch(`http://localhost:8080/items/course/${courseId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });
          // console.log(response)
  
          if (!response.ok) {
            throw new Error('Failed to fetch items');
          }

          const items: Item[] = await response.json();
          console.log(items)
          setItems(items)
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
  
      fetchItems();
    }, [updateItems]);
  
    return (
      <InstructorItemList items={items} courseId={courseId} role={role} update = {updateItemList} studentBalance={studentBalance} />
    );
  };


export default Items