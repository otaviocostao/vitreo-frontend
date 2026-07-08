import { useEffect, useRef, useState } from "react";
import type { OrderStatus } from "../types/order";
import { CheckCircle, ChevronDown, Clock, Cog, XCircle } from "lucide-react";

const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};


interface StatusSelectorProps {
    currentStatus: OrderStatus;
    onStatusChange: (newStatus: OrderStatus) => void;
    disabled?: boolean;
}

interface StatusConfig {
    icon: React.ReactNode;
    label: string;
    text: string;
    bg: string;
}

const statusOptions: OrderStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus, onStatusChange, disabled = false }) => {
    
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const statusConfig: Record<OrderStatus, StatusConfig> = {
    PENDING: { icon: <Clock size={14} />, label: 'Pendente', text: 'text-blue-700', bg: 'bg-blue-100' },
    PROCESSING: { icon: <Cog size={14} />, label: 'Em processamento', text: 'text-yellow-700', bg: 'bg-yellow-100' },
    COMPLETED: { icon: <CheckCircle size={14} />, label: 'Finalizado', text: 'text-green-700', bg: 'bg-green-100' },
    CANCELLED: { icon: <XCircle size={14} />, label: 'Cancelado', text: 'text-red-700', bg: 'bg-red-100' },
  };

  const currentConfig = statusConfig[currentStatus] || statusConfig.PENDING;

  const handleSelect = (newStatus: OrderStatus) => {
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-fit flex items-center justify-between gap-1.5 px-2.5 py-3 box-border rounded-md text-xs font-medium transition-all ${currentConfig.bg} ${currentConfig.text} ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:ring-2 hover:ring-offset-1 hover:ring-blue-500'}`}
      >
        <div className="flex items-center gap-1.5">
          {currentConfig.icon}
          {currentConfig.label}
        </div>
        {!disabled && <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border rounded-md p-1">
          <ul className="space-y-1">
            {statusOptions.map((status) => {
              const config = statusConfig[status];
              return (
                <li
                  key={status}
                  onClick={() => handleSelect(status)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                    status === currentStatus ? `${config.bg} ${config.text}` : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {config.icon}
                  {config.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusSelector;