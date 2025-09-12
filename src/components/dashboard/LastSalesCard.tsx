import React from 'react';
import SaleListItem from './SaleListItem';
import Button from '../ui/Button';

export interface Sale {
  id: number;
  client: string;
  price: number; 
  timeAgo: string;
}

interface LastSalesCardProps {
  sales: Sale[];
}

const LastSalesCard: React.FC<LastSalesCardProps> = ({ sales }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 box-border flex flex-col h-full shadow-lg">
      <header className="mb-4">
        <h3 className="text-xl font-bold text-white">Últimas vendas</h3>
      </header>

      <ul className="flex-1 space-y-1 -mx-3">
        {sales.map((sale) => (
          <SaleListItem key={sale.id} sale={sale} />
        ))}
      </ul>
      
      <Button
        variant="secondary"
        className="mt-4 w-full bg-white/20 text-white border-none hover:bg-white/30"
      >
        <span>Ver todas as vendas →</span>
      </Button>
    </div>
  );
};

export default LastSalesCard;