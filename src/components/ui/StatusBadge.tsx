import React from 'react';
import { CheckCircle, Cog, Clock, PackageCheck, XCircle, FileText } from 'lucide-react';
import type { StatusPedido } from '../../types/pedido';

interface StatusBadgeProps {
  status: StatusPedido;
}

interface StatusConfig {
  icon: React.ReactNode;
  label: string; 
  text: string;  
  bg: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<StatusPedido, StatusConfig> = {
    ORCAMENTO: {
      icon: <FileText size={14} />,
      label: 'Orçamento',
      text: 'text-indigo-700',
      bg: 'bg-indigo-100',
    },
    SOLICITADO: {
      icon: <Clock size={14} />,
      label: 'Solicitado',
      text: 'text-blue-700',
      bg: 'bg-blue-100',
    },
    EM_PRODUCAO: {
      icon: <Cog size={14} />,
      label: 'Em produção',
      text: 'text-yellow-700',
      bg: 'bg-yellow-100',
    },
    PRONTO: {
      icon: <PackageCheck size={14} />,
      label: 'Pronto',
      text: 'text-cyan-700',
      bg: 'bg-cyan-100',
    },
    ENTREGUE: {
      icon: <CheckCircle size={14} />,
      label: 'Entregue',
      text: 'text-green-700',
      bg: 'bg-green-100',
    },
    CANCELADO: {
      icon: <XCircle size={14} />,
      label: 'Cancelado',
      text: 'text-red-700',
      bg: 'bg-red-100',
    },
  };

  const config = statusConfig[status] || statusConfig.CANCELADO; 

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