import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { VendaRecente } from '../../types/dashboard';
interface SaleListItemProps {
  sale: VendaRecente;
}

const SaleListItem: React.FC<SaleListItemProps> = ({ sale }) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const formatarLocalDateTimeParaData = (dataHoraString: string | null | undefined): string => {
    if (!dataHoraString) {
        return '';
    }
    
    const dateObj = new Date(dataHoraString);

    if (isNaN(dateObj.getTime())) {
        return 'Data inválida';
    }

    return new Intl.DateTimeFormat('pt-BR').format(dateObj);
  };


  return (
    <li
      onClick={() => navigate(`/vendas/${sale.id}`)}
      className="flex items-center justify-between p-3 box-border rounded-md transition-colors duration-200 hover:bg-white/10 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
          {getInitials(sale.nomeCliente)}
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{sale.nomeCliente}</p>
          <p className="text-xs text-white/70">{formatarLocalDateTimeParaData(sale.dataPedido)}</p>
        </div>
      </div>
      <p className="font-medium text-white text-sm">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valorFinal)}
      </p>
    </li>
  );
};

export default SaleListItem;