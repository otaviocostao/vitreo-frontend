import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...rest }) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    px-4 py-2 text-sm font-medium rounded-md 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transition-colors duration-200 cursor-pointer
  `;

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;