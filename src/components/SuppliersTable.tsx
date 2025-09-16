import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export interface Supplier {
  id: number;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  street: string;
  city: string;
  state: string;
}

interface SuppliersTableProps {
  suppliers: Supplier[];
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({ suppliers }) => {
  const tableHeaders = ['#', 'CNPJ', 'Razão Social', 'N. Fantasia', 'Logradouro', 'Cidade', 'Estado'];
    
  const navigate = useNavigate();
  const handleRowClick = ( supplierId: number) => {
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
            {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(supplier.id)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.cnpj}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.razao_social}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.nome_fantasia}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.street}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.city}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.state}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
      </div>
  );
};

export default SuppliersTable;