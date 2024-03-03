import { CircleUser, LogOut, BookText, LayoutDashboard } from 'lucide-react'
import React, { useState, useEffect } from "react";
import { ISidebarItem } from '.'


  
  interface SidebarItemProps extends ISidebarItem {
    onClick: (name: string) => void;
  }

  const SidebarItem: React.FC<SidebarItemProps> = ({ name, onClick }) => {
    
    const [role, setRole] = useState<string>('');
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

    const sidebarItemsMapper = {
      Account: <CircleUser />,
      Dashboard: <LayoutDashboard />,
      MyCourses: <BookText />,
      Logout: <LogOut />,
    };
    
  
    const handleItemClick = () => {
      onClick(name);
    };
  
    return (
      <div className='bg-zinc-700 w-full h-24 flex flex-col items-center justify-center' onClick={handleItemClick}>
        {React.cloneElement(sidebarItemsMapper[name] as React.ReactElement, { size: 35, color: 'white', strokeWidth: 1 })}
        <p className='text-white text-center text-sm font-medium'>{name === 'Account' ? role : name}</p>
      </div>
    );
  };
  
  export default SidebarItem;