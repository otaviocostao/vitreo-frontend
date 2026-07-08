import { useCallback, useEffect, useState, useMemo } from 'react';
import { Plus } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import SalesTable from '../components/SalesTable';
import { NavLink } from 'react-router-dom';
import type { OrderResponse } from '../types/order';
import { getOrders } from '../services/orderService';
import ErrorPopup from '../components/ErrorPopup';
import { useDebounce } from '../hooks/useDebounce';

const SalesPage = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError('Falha ao carregar pedidos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
    
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
        
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (!debouncedSearchTerm) return true;
      const s = debouncedSearchTerm.toLowerCase();
      const os = order.serviceOrder?.toString() || '';
      const name = `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();
      const cpf = order.customer.cpf?.toLowerCase() || '';
      return os.includes(s) || name.includes(s) || cpf.includes(s);
    });
  }, [orders, debouncedSearchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

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
        <SalesTable orders={paginatedOrders} isLoading={isLoading} />
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