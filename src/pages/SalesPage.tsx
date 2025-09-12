import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SalesTable, { type Sale } from '../components/SalesTable';

const mockSales: Sale[] = [
  { id: 1, os: 101, name: 'João da Silva', saleDate: '01/08/2023', deliveryDate: '10/08/2023', lens: 'Varilux', frame: 'Ray-Ban', value: 1250.00, status: 'Entregue' },
  { id: 2, os: 102, name: 'Maria Oliveira', saleDate: '02/08/2023', deliveryDate: '12/08/2023', lens: 'Zeiss', frame: 'Oakley', value: 980.50, status: 'Em Produção' },
  { id: 3, os: 103, name: 'Carlos Pereira', saleDate: '03/08/2023', deliveryDate: '15/08/2023', lens: 'Hoya', frame: 'Prada', value: 2100.00, status: 'Solicitado' },
  { id: 4, os: 104, name: 'Ana Costa', saleDate: '04/08/2023', deliveryDate: '14/08/2023', lens: 'Essilor', frame: 'Vogue', value: 750.00, status: 'Cancelado' },
  { id: 1, os: 101, name: 'João da Silva', saleDate: '01/08/2023', deliveryDate: '10/08/2023', lens: 'Varilux', frame: 'Ray-Ban', value: 1250.00, status: 'Entregue' },
  { id: 2, os: 102, name: 'Maria Oliveira', saleDate: '02/08/2023', deliveryDate: '12/08/2023', lens: 'Zeiss', frame: 'Oakley', value: 980.50, status: 'Em Produção' },
  { id: 3, os: 103, name: 'Carlos Pereira', saleDate: '03/08/2023', deliveryDate: '15/08/2023', lens: 'Hoya', frame: 'Prada', value: 2100.00, status: 'Solicitado' },
  { id: 4, os: 104, name: 'Ana Costa', saleDate: '04/08/2023', deliveryDate: '14/08/2023', lens: 'Essilor', frame: 'Vogue', value: 750.00, status: 'Cancelado' },
  { id: 1, os: 101, name: 'João da Silva', saleDate: '01/08/2023', deliveryDate: '10/08/2023', lens: 'Varilux', frame: 'Ray-Ban', value: 1250.00, status: 'Entregue' },
  { id: 2, os: 102, name: 'Maria Oliveira', saleDate: '02/08/2023', deliveryDate: '12/08/2023', lens: 'Zeiss', frame: 'Oakley', value: 980.50, status: 'Em Produção' },
  { id: 3, os: 103, name: 'Carlos Pereira', saleDate: '03/08/2023', deliveryDate: '15/08/2023', lens: 'Hoya', frame: 'Prada', value: 2100.00, status: 'Solicitado' },
  { id: 4, os: 104, name: 'Ana Costa', saleDate: '04/08/2023', deliveryDate: '14/08/2023', lens: 'Essilor', frame: 'Vogue', value: 750.00, status: 'Cancelado' },
  { id: 1, os: 101, name: 'João da Silva', saleDate: '01/08/2023', deliveryDate: '10/08/2023', lens: 'Varilux', frame: 'Ray-Ban', value: 1250.00, status: 'Entregue' },
  { id: 2, os: 102, name: 'Maria Oliveira', saleDate: '02/08/2023', deliveryDate: '12/08/2023', lens: 'Zeiss', frame: 'Oakley', value: 980.50, status: 'Em Produção' },
  { id: 3, os: 103, name: 'Carlos Pereira', saleDate: '03/08/2023', deliveryDate: '15/08/2023', lens: 'Hoya', frame: 'Prada', value: 2100.00, status: 'Solicitado' },
  { id: 4, os: 104, name: 'Ana Costa', saleDate: '04/08/2023', deliveryDate: '14/08/2023', lens: 'Essilor', frame: 'Vogue', value: 750.00, status: 'Cancelado' },
  { id: 1, os: 101, name: 'João da Silva', saleDate: '01/08/2023', deliveryDate: '10/08/2023', lens: 'Varilux', frame: 'Ray-Ban', value: 1250.00, status: 'Entregue' },
  { id: 2, os: 102, name: 'Maria Oliveira', saleDate: '02/08/2023', deliveryDate: '12/08/2023', lens: 'Zeiss', frame: 'Oakley', value: 980.50, status: 'Em Produção' },
  { id: 3, os: 103, name: 'Carlos Pereira', saleDate: '03/08/2023', deliveryDate: '15/08/2023', lens: 'Hoya', frame: 'Prada', value: 2100.00, status: 'Solicitado' },
  { id: 4, os: 104, name: 'Ana Costa', saleDate: '04/08/2023', deliveryDate: '14/08/2023', lens: 'Essilor', frame: 'Vogue', value: 750.00, status: 'Cancelado' },
];

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5

  const handlePageChange = (page: number) => {
    console.log(`Buscando dados para a página ${page}...`);
    setCurrentPage(page);
  };

  return (
    <div className='flex flex-col w-full box-border'>
        <HeaderTitlePage page_name='Vendas' />

        <div className="w-full flex flex-1 flex-col px-4 box-border">
            <div className="mb-6 px-2 pb-4 border-b-1 border-gray-200">
                <div className="flex justify-between items-center ">
                <h2 className="text-lg font-semibold text-gray-800">Buscar</h2>
                </div>
            
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            
                    <div className="relative w-full md:max-w-md">
                        <InputField
                            id="client-search"
                            name="search"
                            placeholder="Buscar pela O.S, nome ou CPF do cliente..."
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
        <SalesTable sales={sales} />
        </div>
    </div>
  );
};

export default SalesPage;