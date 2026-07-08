import React from 'react';
import { CheckCircle, Cog, Clock, XCircle } from 'lucide-react';
import type { OrderStatus } from '../../types/order';

interface StatusBadgeProps {
  status: OrderStatus;
}

interface StatusConfig {
  icon: React.ReactNode;
  label: string; 
  text: string;  
  bg: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<OrderStatus, StatusConfig> = {
    PENDING: {
      icon: <Clock size={14} />,
      label: 'Pendente',
      text: 'text-blue-700',
      bg: 'bg-blue-100',
    },
    PROCESSING: {
      icon: <Cog size={14} />,
      label: 'Em processamento',
      text: 'text-yellow-700',
      bg: 'bg-yellow-100',
    },
    COMPLETED: {
      icon: <CheckCircle size={14} />,
      label: 'Finalizado',
      text: 'text-green-700',
      bg: 'bg-green-100',
    },
    CANCELLED: {
      icon: <XCircle size={14} />,
      label: 'Cancelado',
      text: 'text-red-700',
      bg: 'bg-red-100',
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING; 

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 box-border rounded-lg text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.icon}
      {config.label} 
    </span>
  );
};

export default StatusBadge;