import { useNavigate } from 'react-router-dom';
import StatusBadge from './ui/StatusBadge';
import type { OrderResponse } from '../types/order';
import LoadingSpinner from './LoadingSpinner';
import ActionDropdown from './ui/ActionDropdown';


interface SalesTableProps {
  orders: OrderResponse[];
  isLoading: boolean;
  onRowClick: (order: OrderResponse) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ orders, isLoading, onRowClick }) => {
  const tableHeaders = ['O.S', 'Cliente', 'D. Venda', 'D. Entrega', 'Lentes', 'Armação', 'Valor', 'Status', ''];
  const navigate = useNavigate();

  const formatarData = (data: string | null | undefined): string => {
    if (!data) {
        return '';
    }
    
    const dateObj = new Date(`${data}T00:00:00`);

    if (isNaN(dateObj.getTime())) {
        return 'Data inválida';
    }

    return new Intl.DateTimeFormat('pt-BR').format(dateObj);
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
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
      <div className="max-h-[60vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="sticky top-0">
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
          <tr>
            <td colSpan={tableHeaders.length} className="text-center p-8">
              <LoadingSpinner 
                size="h-8 w-8"
                text="Carregando vendas..." 
              />
            </td>
          </tr> 
      ) : orders.length === 0 ? (
        <tr>
          <td colSpan={tableHeaders.length} className="text-center p-8 text-gray-500">
            Nenhuma venda encontrada.
          </td>
        </tr>
      ) : (
        orders.map((order) => {
          const lente = order.items.find(item => item.product.productType === 'lens');
          const armacao = order.items.find(item => item.product.productType === 'frame');
          
          const nomeLente = lente ? lente.product.name : '-';
          const nomeArmacao = armacao ? armacao.product.name : '-';
          const nomeCliente = `${order.customer.firstName} ${order.customer.lastName}`;

          return (
            <tr 
              key={order.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick(order)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.serviceOrder || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{nomeCliente}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatarLocalDateTimeParaData(order.orderDate)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatarData(order.deliveryDate)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{nomeLente}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{nomeArmacao}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.finalValue)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ActionDropdown 
                  onEdit={() => navigate(`/vendas/${order.id}`)} 
                  onPrint={() => navigate(`/vendas/${order.id}/detalhes`, { state: { hideSuccessBanner: true, triggerPrint: true } })}
                />
              </td>
            </tr>
          );
        })
      )}
        </tbody>
      </table>
    </div>
  </div>

  );
};
export default SalesTable;