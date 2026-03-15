import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SidebarButtonProps {
  page_name: string;
  to?: string;
  onClick?: () => void; 
  icon?: ReactNode;
  end?: boolean;
}

const SidebarButton = (props: SidebarButtonProps) => {
  const baseClass = "flex items-center gap-3 p-2 text-sm text-start w-full rounded-md transition-colors duration-300 cursor-pointer";
  const inactiveClass = "text-gray-600 font-medium hover:bg-gray-100";
  const activeClass = "bg-blue-100 text-blue-600 font-semibold";

  return (
    <div className='flex w-full items-center'>
      {props.to ? (
        <NavLink 
            to={props.to} 
            end={props.end}
            className={({ isActive }) => 
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
        >
            {props.icon}
            <span>{props.page_name}</span>
        </NavLink>
      ) : (
        <button 
            onClick={props.onClick}
            className={`${baseClass} ${inactiveClass}`}
        >
            {props.icon}
            <span>{props.page_name}</span>
        </button>
      )}
    </div>
  );
};

export default SidebarButton;