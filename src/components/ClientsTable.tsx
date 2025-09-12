import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export interface Client {
  id: number;
  name: string;
  address: string;
  birthDate: string;
  phone: string;
}

interface ClientsTableProps {
  clients: Client[];
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
  const tableHeaders = ['#', 'Cliente', 'Endereço', 'D/N', 'Telefone', ' '];
    
  const navigate = useNavigate();
  const handleRowClick = ( clienteId: number) => {
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
            {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(client.id)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.birthDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-800">
                    Ver mais
                    </Link>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
      </div>
  );
};

export default ClientsTable;