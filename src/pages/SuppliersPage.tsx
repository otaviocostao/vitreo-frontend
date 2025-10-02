import { useCallback, useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import { NavLink } from 'react-router-dom';
import SuppliersTable from '../components/SuppliersTable';
import type { FornecedorResponse } from '../types/fornecedor';
import type { Page } from '../types/pagination';
import { getFornecedores } from '../services/fornecedorService';
import ErrorPopup from '../components/ErrorPopup';

const PRODUCTS_PER_PAGE = 20;

const SuppliersPage = () => {
  const [fornecedores, setFornecedores] = useState<FornecedorResponse[]>([]);
  const [pageInfo, setPageInfo] = useState<Page<FornecedorResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pageInfo ? pageInfo.totalPages : 1;

  const fetchFornecedores = useCallback(async(page:number) => {
      setIsLoading(true);
      setError(null);
  
      try{
          const data = await getFornecedores(page, PRODUCTS_PER_PAGE);
          setFornecedores(data.content);
          setPageInfo(data);
          setCurrentPage(page);
      }catch (err) {
          setError('Falha ao carregar fornecedores')
          console.error(err);
      }finally{
          setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchFornecedores(currentPage)
    }, [fetchFornecedores, currentPage])
  
    const handlePageChange = (page: number) => {
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
        <SuppliersTable fornecedores={fornecedores} isLoading={isLoading} />
        </div>
        {error && (
        <ErrorPopup
          message={error}
          onClose={() => setError(null)} 
        />
      )}
    </div>
  );
};

export default SuppliersPage;