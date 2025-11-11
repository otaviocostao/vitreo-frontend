import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { FornecedorResponse } from '../types/fornecedor';
import LoadingSpinner from './LoadingSpinner';
import Button from './ui/Button';
import { Trash2 } from 'lucide-react';

interface SuppliersTableProps {
  fornecedores: FornecedorResponse[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onDeleteClick: (productId: string, fornecedorNome: string) => void;

}

const SuppliersTable: React.FC<SuppliersTableProps> = ({ fornecedores, isLoading, currentPage, pageSize, onDeleteClick}) => {
  const tableHeaders = ['#', 'Razão Social', 'N. Fantasia', 'CNPJ', 'Logradouro', 'Nº', 'Bairro', 'Cidade', 'Estado', ''];
    
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
                    text="Carregando fornecedores..." 
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
              fornecedores.map((fornecedor, i) => {
                const rowNumber = (currentPage - 1) * pageSize + i + 1;
                return(
                  <tr key={fornecedor.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(fornecedor.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rowNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.razaoSocial}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.nomeFantasia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.cnpj}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.logradouro}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.numero}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.bairro}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.cidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fornecedor.endereco.estado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <Button 
                        variant="smallDelete" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClick(fornecedor.id, fornecedor.nomeFantasia); 
                        }}
                        >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                  </tr>
                )}
              ))
            }
            </tbody>
        </table>
        </div>
      </div>
  );
};

export default SuppliersTable;