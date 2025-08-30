import React from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarButtonProps {
  page_name: string;
  to: string;
}


const SidebarButton = (props: SidebarButtonProps) => {
  return (
    <div className='flex w-full items-center radius'>
        <NavLink to={props.to} className='p-2 text-start w-full hover:bg-gray-100 text-gray-600 font-normal rounded-sm' end>
            {props.page_name}
        </NavLink>
    </div>
  )
}

export default SidebarButton
