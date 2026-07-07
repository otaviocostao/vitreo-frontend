import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CustomerResponse } from '../types/customer';
import LoadingSpinner from './LoadingSpinner';
import Button from './ui/Button';
import { Trash2 } from 'lucide-react';



interface ClientsTableProps {
  customers: CustomerResponse[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onDeleteClick: (productId: string, fornecedorNome: string) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ customers, isLoading, currentPage, pageSize, onDeleteClick }) => {
  const tableHeaders = ['#', 'Cliente', 'D/N', 'Telefone', 'Logradouro', 'Nº', 'Bairro', 'Cidade', 'Estado', ''];

  const navigate = useNavigate();
  const handleRowClick = (clienteId: string) => {
    navigate(`/clientes/${clienteId}`);
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

  return (
    <div className="bg-white border-1 border-gray-200 rounded-lg overflow-x-auto">
      <div className="max-h-[60vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    text="Carregando clientes..."
                  />
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-8 text-gray-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              customers.map((customer, i) => {
                const rowNumber = (currentPage - 1) * pageSize + i + 1;
                const nomeCompleto = `${customer.firstName} ${customer.lastName}`;

                return (
                  <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(customer.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rowNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{nomeCompleto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatarData(customer.birthDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.phone || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.street || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.number || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.neighborhood || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.city || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.state || ''}</td>
                    <td>
                      <Button
                        variant="smallDelete"
                        onClick={
                          (e) => {
                            e.stopPropagation();
                            onDeleteClick(customer.id, nomeCompleto);
                          }
                        }
                      >
                        <Trash2 className="w-4 h-4 " />
                      </Button>
                    </td>
                  </tr>
                )
              }
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTable;