import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CustomerResponse } from '../types/customer';
import LoadingSpinner from './LoadingSpinner';
import ActionDropdown from './ui/ActionDropdown';
import { formatDate, formatPhone } from '../helpers/formatters';



interface ClientsTableProps {
  customers: CustomerResponse[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onDeleteClick: (productId: string, fornecedorNome: string) => void;
  onDeactivateClick?: (id: string, currentStatus: boolean) => void;
  onRowClick: (customer: CustomerResponse) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ customers, isLoading, currentPage, pageSize, onDeleteClick, onDeactivateClick, onRowClick }) => {
  const tableHeaders = ['#', 'Cliente', 'D/N', 'Telefone', 'Logradouro', 'Nº', 'Bairro', 'Cidade', 'Estado', 'Status', ''];

  const navigate = useNavigate();

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
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onRowClick(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rowNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{nomeCompleto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(customer.birthDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatPhone(customer.phone)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.street || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.number || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.neighborhood || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.city || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.state || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs ${
                        customer.isActive !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {customer.isActive !== false ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ActionDropdown
                        onEdit={() => navigate(`/clientes/${customer.id}`)}
                        onDelete={() => onDeleteClick(customer.id, nomeCompleto)}
                        isActive={customer.isActive}
                        onDeactivate={onDeactivateClick ? () => onDeactivateClick(customer.id, customer.isActive) : undefined}
                      />
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