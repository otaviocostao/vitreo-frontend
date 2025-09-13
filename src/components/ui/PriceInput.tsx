import React from 'react';
import { cn } from '../../lib/utils'; 
interface PriceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
}

const PriceInput: React.FC<PriceInputProps> = ({ label, id, containerClassName, ...rest }) => {
  return (
    <div className={cn("flex justify-between items-center", containerClassName)}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          'block w-28 px-3 py-1.5 bg-white border border-gray-300 rounded-md',
          'placeholder-gray-400 text-sm',
          'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
          'transition duration-150 ease-in-out'
        )}
        {...rest}
      />
    </div>
  );
};

export default PriceInput;