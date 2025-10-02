import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { FornecedorResponse } from '../types/fornecedor';
import LoadingSpinner from './LoadingSpinner';

interface SuppliersTableProps {
  fornecedores: FornecedorResponse[];
  isLoading: boolean;
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({ fornecedores, isLoading }) => {
  const tableHeaders = ['#', 'Razão Social', 'N. Fantasia', 'CNPJ', 'Logradouro', 'Nº', 'Bairro', 'Cidade', 'Estado'];
    
  const navigate = useNavigate();
  const handleRowClick = ( fornecedorId: string) => {
    navigate(`/fornecedores/${fornecedorId}`);
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
                    text="Carregando produtos..." 
                  />
                </td>
              </tr> 
            ) : fornecedores.length === 0 ? (

              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-8 text-gray-500">
                  Nenhum fornecedor encontrado.
                </td>
              </tr>
            ) : (
              fornecedores.map((fornecedor, i) => (
                  <tr key={fornecedor.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(fornecedor.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i+1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.razaoSocial}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.nomeFantasia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.cnpj}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.logradouro}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.numero}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.bairro}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.cidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.estado}</td>
                  </tr>
              )))
            }
            </tbody>
        </table>
        </div>
      </div>
  );
};

export default SuppliersTable;