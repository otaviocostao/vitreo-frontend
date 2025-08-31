import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SidebarButtonProps {
  page_name: string;
  to: string;
  icon?: ReactNode;
  end?: boolean;
}

const SidebarButton = (props: SidebarButtonProps) => {
  return (
    <div className='flex w-full items-center'>
        <NavLink 
            to={props.to} 
            end={props.end}
            className={({ isActive }) => 
                `flex items-center gap-3 p-2 text-sm text-start w-full rounded-md transition-colors duration-150 ${
                    isActive 
                    ? 'bg-blue-100 text-blue-600 font-semibold' 
                    : 'text-gray-600 font-medium hover:bg-gray-100'
                }`
            }
        >
            {props.icon}
            <span>{props.page_name}</span>
        </NavLink>
    </div>
  );
};

export default SidebarButton