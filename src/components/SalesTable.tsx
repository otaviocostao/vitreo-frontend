import { useNavigate } from 'react-router-dom';
import StatusBadge from './ui/StatusBadge';
import type { ItemPedidoResponse, PedidoResponse } from '../types/pedido';
import LoadingSpinner from './LoadingSpinner';


interface SalesTableProps {
  pedidos: PedidoResponse[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
}

const SalesTable: React.FC<SalesTableProps> = ({ pedidos, isLoading, currentPage, pageSize }) => {
  const tableHeaders = ['O.S', 'Cliente', 'D. Venda', 'D. Entrega', 'Lentes', 'Armação', 'Valor', 'Status'];
  const navigate = useNavigate();

  const handleRowClick = (pedidoId: string) => {
    navigate(`/vendas/${pedidoId}`);
  };

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
  
  const getNomesDosItens = (itens: ItemPedidoResponse[]) => {
    const lente = itens.find(item => item.tipoProduto === 'LENTE');
    
    const armacao = itens.find(item => item.tipoProduto === 'ARMACAO');

    return {
      nomeLente: lente ? lente.nomeProduto : 'N/A', 
      nomeArmacao: armacao ? armacao.nomeProduto : 'N/A'
    };
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
      ) : pedidos.length === 0 ? (
        <tr>
          <td colSpan={tableHeaders.length} className="text-center p-8 text-gray-500">
            Nenhuma venda encontrada.
          </td>
        </tr>
      ) : (
        pedidos.map((pedido, i) => {
          const rowNumber = (currentPage - 1) * pageSize + i + 1;
          const lente = pedido.itens.find(item => item.tipoProduto === 'LENTE');
          const armacao = pedido.itens.find(item => item.tipoProduto === 'ARMACAO');
          
          const nomeLente = lente ? lente.nomeProduto : '-';
          const nomeArmacao = armacao ? armacao.nomeProduto : '-';

          return (
            <tr 
              key={pedido.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(pedido.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pedido.ordemServico}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pedido.cliente.nomeCompleto}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatarLocalDateTimeParaData(pedido.dataPedido)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatarData(pedido.dataEntrega)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{nomeLente}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{nomeArmacao}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valorFinal)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <StatusBadge status={pedido.status} />
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