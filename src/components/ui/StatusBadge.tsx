import React from 'react';
import { CheckCircle, Cog, Clock, PackageCheck, XCircle } from 'lucide-react';

export type SaleStatus = 'Solicitado' | 'Em Produção' | 'Pronto' | 'Entregue' | 'Cancelado';

interface StatusBadgeProps {
  status: SaleStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    Solicitado: {
      icon: <Clock size={14} />,
      text: 'text-blue-700',
      bg: 'bg-blue-100',
    },
    'Em Produção': {
      icon: <Cog size={14} />,
      text: 'text-yellow-700',
      bg: 'bg-yellow-100',
    },
    Pronto: {
      icon: <PackageCheck size={14} />,
      text: 'text-cyan-700',
      bg: 'bg-cyan-100',
    },
    Entregue: {
      icon: <CheckCircle size={14} />,
      text: 'text-green-700',
      bg: 'bg-green-100',
    },
    Cancelado: {
      icon: <XCircle size={14} />,
      text: 'text-red-700',
      bg: 'bg-red-100',
    },
  };

  const config = statusConfig[status] || statusConfig.Cancelado; 

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 box-border rounded-lg text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

export default StatusBadge;