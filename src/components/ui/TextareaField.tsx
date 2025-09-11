import React from 'react';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ label, id, className, error, ...rest }) => {
  const errorClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className={`
          block w-full px-3 py-2 bg-white border rounded-md shadow-sm 
          placeholder-gray-400 sm:text-sm
          focus:outline-none focus:ring-1
          transition duration-150 ease-in-out
          ${errorClasses}
        `}
        {...rest}
      ></textarea>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default TextareaField;