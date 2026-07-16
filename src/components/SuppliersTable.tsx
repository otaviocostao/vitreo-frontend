import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SupplierResponse } from '../types/supplier';
import LoadingSpinner from './LoadingSpinner';
import ActionDropdown from './ui/ActionDropdown';
import { formatCNPJ } from '../lib/utils';

interface SuppliersTableProps {
  suppliers: SupplierResponse[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onDeleteClick: (productId: string, fornecedorNome: string) => void;

}

const SuppliersTable: React.FC<SuppliersTableProps> = ({ suppliers = [], isLoading, currentPage, pageSize, onDeleteClick }) => {
  const tableHeaders = ['#', 'Razão Social', 'N. Fantasia', 'CNPJ', 'Logradouro', 'Nº', 'Bairro', 'Cidade', 'Estado', ''];

  const navigate = useNavigate();
  const handleRowClick = (supplierId: string) => {
    navigate(`/fornecedores/${supplierId}`);
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
                    text="Carregando fornecedores..."
                  />
                </td>
              </tr>
            ) : suppliers.length === 0 ? (

              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-8 text-gray-500">
                  Nenhum fornecedor encontrado.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier, i) => {
                const rowNumber = (currentPage - 1) * pageSize + i + 1;
                return (
                  <tr key={supplier.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(supplier.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rowNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.corporateName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.tradeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCNPJ(supplier.cnpj)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.street}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.neighborhood}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ActionDropdown
                        onEdit={() => handleRowClick(supplier.id)}
                        onDelete={() => onDeleteClick(supplier.id, supplier.tradeName)}
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

export default SuppliersTable;