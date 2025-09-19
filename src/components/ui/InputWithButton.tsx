import React from 'react';

interface InputWithButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  buttonIcon: React.ReactNode;
  onButtonClick: () => void;
  className?: string;
  error?: string;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({
  label,
  id,
  buttonIcon,
  onButtonClick,
  className,
  error,
  ...rest 
}) => {
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`
            block w-full px-3 py-2 bg-white border rounded-md  
          placeholder-gray-400 text-sm pr-10
            focus:outline-none focus:ring-1 
            transition duration-150 ease-in-out
            ${errorClasses}
          `}
          {...rest}
        />
        <button
          type="button" 
          onClick={onButtonClick}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
          aria-label="Adicionar novo item" 
        >
          {buttonIcon}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default InputWithButton;