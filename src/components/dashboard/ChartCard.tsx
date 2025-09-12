import React from 'react';

interface ChartCardProps {
  title: string;
  actions?: React.ReactNode; // Para botões como 'Filter', 'Manage'
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, actions, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">{actions}</div>
      </header>
      <div className="h-72 w-full"> 
        {children}
      </div>
    </div>
  );
};

export default ChartCard;