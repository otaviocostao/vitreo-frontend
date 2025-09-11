import React from 'react';

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, children, className }) => {
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 pb-2 mb-3 border-b border-gray-200">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default InfoSection;