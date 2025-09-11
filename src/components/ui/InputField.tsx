import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;      
  id: string;         
  error?: string;
  labelClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, className, error, ...rest }) => {
  
  const errorClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  return (

    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}

        className={`
          block w-full px-3 py-2 bg-white border rounded-md  
          placeholder-gray-400 sm:text-sm
          focus:outline-none focus:ring-1 
          transition duration-150 ease-in-out
          ${errorClasses}
        `}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;