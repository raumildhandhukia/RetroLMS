import { CircleUser, LogOut, LucideIcon, LucideProps, BookText } from 'lucide-react'
import React from 'react'
import { ISidebarItem } from '.'


  
  interface SidebarItemProps extends ISidebarItem {
    onClick: (name: string) => void;
  }

  const SidebarItem: React.FC<SidebarItemProps> = ({ name, onClick }) => {
    const sidebarItemsMapper = {
      Account: <CircleUser />,
      MyCourses: <BookText />,
      Logout: <LogOut />,
    };
  
    const handleItemClick = () => {
      onClick(name);
    };
  
    return (
      <div className='bg-zinc-700 w-full h-24 flex flex-col items-center justify-center' onClick={handleItemClick}>
        {React.cloneElement(sidebarItemsMapper[name] as React.ReactElement, { size: 35, color: 'white', strokeWidth: 1 })}
        <p className='text-white text-center text-sm font-medium'>{name}</p>
      </div>
    );
  };
  
  export default SidebarItem;