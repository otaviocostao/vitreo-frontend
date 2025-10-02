import React from 'react';
import {useNavigate } from 'react-router-dom';
import type { ClienteResponse } from '../types/cliente';
import LoadingSpinner from './LoadingSpinner';



interface ClientsTableProps {
  clients: ClienteResponse[];
  isLoading: boolean;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, isLoading }) => {
  const tableHeaders = ['#', 'Cliente', 'D/N', 'Telefone', 'Logradouro', 'Nº', 'Bairro', 'Cidade', 'Estado'];
    
  const navigate = useNavigate();
  const handleRowClick = ( clienteId: string) => {
    navigate(`/clientes/${clienteId}`);
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
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center p-8 text-gray-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                clients.map((client, i) => (
                    <tr key={client.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(client.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i+1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.nomeCompleto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.dataNascimento}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.telefone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.endereco.logradouro}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.endereco.numero}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.endereco.bairro}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.endereco.cidade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.endereco.estado}</td>
                    </tr>
                ))
              )}
            </tbody>
        </table>
        </div>
      </div>
  );
};

export default ClientsTable;