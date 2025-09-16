import { useState } from 'react';
import { Plus, Search } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import { NavLink } from 'react-router-dom';
import type { Supplier } from '../components/SuppliersTable';
import SuppliersTable from '../components/SuppliersTable';

const mockSuppliers: Supplier[] = Array.from({ length: 13    }, (_, i) => ({
  id: i + 1,
  cnpj: "32.638.033/0001-58",
  razao_social: "Tecnolens Laboratorio Óptico LTDA",
  nome_fantasia: 'Tecnolens',
  street: 'Avenida Eduardo Froes da Mota, 4050',
  city: 'Feira de Santana',
  state: 'Bahia',
  phone: '(75) - 9.9221-9211',
}));

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5

  const handlePageChange = (page: number) => {
    console.log(`Buscando dados para a página ${page}...`);
    setCurrentPage(page);
  };

  return (
    <div className='flex flex-col w-full box-border'>
        <HeaderTitlePage page_name='Fornecedores' />

        <div className="w-full flex flex-1 flex-col px-4 box-border">
            <div className="mb-6 px-2 pb-4 border-b-1 border-gray-200">
                <div className="flex justify-between items-center ">
                <h2 className="text-lg font-semibold text-gray-800">Buscar Fornecedor</h2>
                </div>
            
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            
                    <div className="relative w-full md:max-w-md">
                        <InputField
                            id="client-search"
                            name="search"
                            placeholder="Buscar pela Razão Social, Nome Fantasia ou CNPJ do fornecedor..."
                            className="pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <NavLink to={"/fornecedores/novo"}>
                            <Button variant="primary">
                                <Plus size={18} />
                                <span>Novo fornecedor</span>
                            </Button>
                        </NavLink>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        <SuppliersTable suppliers={suppliers} />
        </div>
    </div>
  );
};

export default SuppliersPage;