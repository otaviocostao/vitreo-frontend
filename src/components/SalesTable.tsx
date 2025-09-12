import { useNavigate } from 'react-router-dom';
import type { SaleStatus } from './ui/StatusBadge';
import StatusBadge from './ui/StatusBadge';

export interface Sale {
  id: number;
  os: number;
  name: string;
  saleDate: string;
  deliveryDate: string;
  lens: string;
  frame: string;
  value: number;
  status: SaleStatus;
}

interface SalesTableProps {
  sales: Sale[];
}

const SalesTable: React.FC<SalesTableProps> = ({ sales }) => {
  const tableHeaders = ['#', 'O.S', 'Cliente', 'D. Venda', 'D. Entrega', 'Lentes', 'Armação', 'Valor', 'Status'];
  const navigate = useNavigate();

  const handleRowClick = (vendaId: number) => {
    navigate(`/vendas/${vendaId}`);
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
            {sales.map((sale) => (
              <tr 
                key={sale.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(sale.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.os}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.saleDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.deliveryDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.lens}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sale.frame}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <StatusBadge status={sale.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;