import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'smallDelete';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...rest }) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
     text-sm font-medium rounded-md 
    transition-colors duration-200 cursor-pointer
  `;

  const variantClasses = {
    primary: "px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
    secondary: "px-4 py-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
    destructive: "px-4 py-2 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500",
    smallDelete: 
    'px-2 py-2 bg-none bg-input/30 border-none hover:text-red-500 hover:bg-gray-100',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;