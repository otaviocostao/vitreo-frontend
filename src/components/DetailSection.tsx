import React from 'react';

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`py-3 px-3 border-b border-gray-200 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

export default DetailSection;