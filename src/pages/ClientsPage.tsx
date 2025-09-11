import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import ClientsTable, { type Client } from '../components/ClientsTable';
import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';

const mockClients: Client[] = Array.from({ length: 13    }, (_, i) => ({
  id: i + 1,
  name: 'Maria José Gonçalves dos Santos',
  address: 'Rua José Pinheiro, 73, Centro, Araci-Ba',
  birthDate: '20/02/1974',
  phone: '(75) - 9.9121-9211',
}));

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5

  const handlePageChange = (page: number) => {
    console.log(`Buscando dados para a página ${page}...`);
    setCurrentPage(page);
  };

  return (
    <div className='flex flex-col w-full box-border'>
        <HeaderTitlePage page_name='Clientes' />

        <div className="w-full flex flex-1 flex-col p-4 box-border">
            <div className="mb-6 p-4 border-b-1 border-gray-200">
                <div className="flex justify-between items-center ">
                <h2 className="text-lg font-semibold text-gray-800">Buscar cliente</h2>
                </div>
            
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            
                    <div className="relative w-full md:max-w-md">
                        <InputField
                            id="client-search"
                            name="search"
                            placeholder="Buscar pelo nome ou CPF do cliente..."
                            className="pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Button variant="primary">
                            <Plus size={18} />
                            <span>Novo cliente</span>
                        </Button>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        <ClientsTable clients={clients} />
        </div>
    </div>
  );
};

export default ClientsPage;