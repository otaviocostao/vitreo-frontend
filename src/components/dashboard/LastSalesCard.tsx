import React from 'react';
import SaleListItem from './SaleListItem';
import Button from '../ui/Button';
import type { VendaRecente } from '../../types/dashboard';
import { useNavigate } from 'react-router-dom';

interface LastSalesCardProps {
  sales: VendaRecente[];
}

const LastSalesCard: React.FC<LastSalesCardProps> = ({ sales }) => {

  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 box-border flex flex-col h-full">
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
        onClick={() => navigate(`/vendas`)}
      >
        <span>Ver todas as vendas →</span>
      </Button>
    </div>
  );
};

export default LastSalesCard;