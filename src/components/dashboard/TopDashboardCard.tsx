import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'; // Ícones mais específicos

interface TopCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  percentage: number;
  contextText: string;
}

const TopDashboardCard: React.FC<TopCardProps> = ({ title, value, trend, percentage, contextText }) => {
  const isPositive = trend === 'up';

  const trendClasses = {
    bg: isPositive ? 'bg-green-100' : 'bg-red-100',
    text: isPositive ? 'text-green-700' : 'text-red-700',
    icon: isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />,
  };

  return (
    <div className="w-full flex flex-col gap-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
      <div className="flex items-baseline gap-2">
        <h1 className="text-3xl font-bold text-gray-900">{value}</h1>
        
        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${trendClasses.bg} ${trendClasses.text}`}>
          {trendClasses.icon}
          <span>{percentage}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{contextText}</p>
    </div>
  );
};

export default TopDashboardCard;