import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Sale } from './LastSalesCard';

interface SaleListItemProps {
  sale: Sale;
}

const SaleListItem: React.FC<SaleListItemProps> = ({ sale }) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <li
      onClick={() => navigate(`/sales/${sale.id}`)}
      className="flex items-center justify-between p-3 box-border rounded-md transition-colors duration-200 hover:bg-white/10 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
          {getInitials(sale.client)}
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{sale.client}</p>
          <p className="text-xs text-white/70">{sale.timeAgo}</p>
        </div>
      </div>
      <p className="font-medium text-white text-sm">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.price)}
      </p>
    </li>
  );
};

export default SaleListItem;