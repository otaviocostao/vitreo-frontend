import { useCallback, useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SalesTable from '../components/SalesTable';
import { NavLink } from 'react-router-dom';
import type { PedidoResponse } from '../types/pedido';
import type { Page } from '../types/pagination';
import { getPedidos } from '../services/pedidoService';
import ErrorPopup from '../components/ErrorPopup';
import { useDebounce } from '../hooks/useDebounce';

const SalesPage = () => {
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [pageInfo, setPageInfo] = useState<Page<PedidoResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pageInfo ? pageInfo.totalPages : 1;
  const pageSize = 20;

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  

  const fetchPedidos = useCallback(async (page: number, query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const pageIndex = page - 1; 
      const data = await getPedidos({page: pageIndex, size: pageSize, query: query});
      setPedidos(data.content);
      setPageInfo(data);
      setCurrentPage(page);
    } catch (err) {
      setError('Falha ao carregar pedidos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
    
    useEffect(() => {
        fetchPedidos(currentPage, debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchPedidos, currentPage]);
        
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
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
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <NavLink to={"/vendas/nova"} >
                            <Button variant="primary">
                                <Plus size={18} />
                                <span>Nova venda</span>
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
        <SalesTable pedidos={pedidos} isLoading={isLoading} currentPage={currentPage} pageSize={pageSize} />
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

export default SalesPage;