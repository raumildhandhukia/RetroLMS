import { CircleUser, LogOut, LucideIcon, LucideProps } from 'lucide-react'
import React from 'react'
import { ISidebarItem } from '.'
import {Link} from "react-router-dom";

export default function SidebarItem(props: ISidebarItem) {
    const { name} = props

    /* 
    "value" of below mapper is a component from the lucide-react library, change to appropriate one by 
    1. Visiting https://lucide.dev/icons/
    2. Choosing appropriate icon
    3. Copy JSX
    */
    const sidebarItemsMapper = {
        Account: <CircleUser />,
        Logout: <LogOut />,
    }

    return (
      <Link to={"/dashboard"}>
          <div className="bg-zinc-700 w-full h-24 flex flex-col items-center justify-center icon-link-hover">
              {React.cloneElement(sidebarItemsMapper[name] as React.ReactElement, { size: 35, color: 'white', strokeWidth: 1 })}
              <p className='text-white text-center text-sm font-medium'>{name}</p>
          </div>
      </Link>
    )
}
