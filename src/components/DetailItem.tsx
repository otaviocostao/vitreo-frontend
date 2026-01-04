import React from 'react';

interface DetailItemProps {
  label: string;
  value: React.ReactNode; 
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  if (!value && value !== 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:items-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 text-left sm:text-right">{value}</p>
    </div>
  );
};

export default DetailItem;