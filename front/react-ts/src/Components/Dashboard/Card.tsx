import React from 'react'
import { Course } from '.'

interface CardProps extends Course {
    onCardClick: (_id: string) => void;
  }
  

const Card: React.FC<CardProps> = (props) => {
    const { courseKey, _id, title, onCardClick } = props;
    const handleClick = () => {
      onCardClick(_id);
    };

    return (
      <div onClick={handleClick} className="cursor-pointer">
         <div className="mr-4 mb-8 shadow-lg w-72 rounded-lg">
            <div className="w-full h-32 bg-zinc-700 rounded-t-lg"></div>
            <div className="p-4">
                <p className="text-sm font-bold text-zinc-700">{courseKey}: {title}</p>
            </div>
        </div>
      </div>
    );
  };
  
  export default Card;
