import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface AccordionItem {
  page_name: string;
  to: string;
}

interface SidebarAccordionProps {
  page_name: string;
  icon: ReactNode;
  items: AccordionItem[];
}

const SidebarAccordion = ({ page_name, icon, items }: SidebarAccordionProps) => {
  const location = useLocation();

  const isAnySubItemActive = items.some(
    (item) => location.pathname === item.to || location.pathname.startsWith(item.to + "/")
  );

  const [isOpen, setIsOpen] = useState(isAnySubItemActive);

  useEffect(() => {
    if (isAnySubItemActive) {
      setIsOpen(true);
    }
  }, [location.pathname, isAnySubItemActive]);

  const baseClass = "flex items-center justify-between p-2 text-sm text-start w-full rounded-md transition-colors duration-300 cursor-pointer select-none";
  const inactiveClass = "text-gray-600 font-medium hover:bg-gray-100";
  const activeParentClass = "text-blue-600 font-semibold bg-blue-50/50 hover:bg-blue-50";

  return (
    <div className="w-full flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseClass} ${isAnySubItemActive ? activeParentClass : inactiveClass}`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{page_name}</span>
        </div>
        <ChevronRight
          size={16}
          className={`transition-transform duration-300 text-gray-400 ${isOpen ? "rotate-90 text-gray-600" : ""
            }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col pl-3 gap-1 ml-1 py-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 text-sm text-start w-full rounded-md transition-colors duration-200 cursor-pointer ${isActive
                  ? "text-blue-600 font-semibold bg-blue-50"
                  : "text-gray-500 font-medium hover:bg-gray-50"
                }`
              }
            >
              <span>{item.page_name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarAccordion;
