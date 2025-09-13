import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: Option[]; 
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, className, error, ...rest }) => {
  const errorClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        className={`
          block w-full px-3 py-2 bg-white border rounded-md  
          sm:text-sm
          focus:outline-none focus:ring-1
          transition duration-150 ease-in-out
          ${errorClasses}
        `}
        {...rest}
      >
        <option value="" disabled>Selecione...</option>
        
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;