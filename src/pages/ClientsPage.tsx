import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import ClientsTable from '../components/ClientsTable';
import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import { NavLink } from 'react-router-dom';
import type { Page } from '../types/pagination';
import type { ClienteResponse } from '../types/cliente';
import { deleteClienteById, getClientes } from '../services/clienteService';
import ErrorPopup from '../components/ErrorPopup';
import PopupModal from '../components/ui/ModalPopup';
import { useDebounce } from '../hooks/useDebounce';

const ClientsPage = () => {

  const [clients, setClients] = useState<ClienteResponse[]>([]);
  const [pageInfo, setPageInfo] = useState<Page<ClienteResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pageInfo ? pageInfo.totalPages : 1;
  const pageSize = 20;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null);
  const [nomeClienteToDelete, setNomeClienteToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchClients = useCallback(async (page: number, query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const pageIndex = page - 1; 
      const data = await getClientes({page: pageIndex, size: pageSize, query: query});
      setClients(data.content);
      setPageInfo(data);
      setCurrentPage(page);
    } catch (err) {
      setError('Falha ao carregar clientes.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients(currentPage, debouncedSearchTerm);
  }, [debouncedSearchTerm, currentPage, fetchClients]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenDeleteModal = (clienteId: string, nomeCliente: string) => {
      setClienteToDelete(clienteId);
      setNomeClienteToDelete(nomeCliente);
      setIsDeleteModalOpen(true);
    };
  
    const handleCloseDeleteModal = () => {
      setClienteToDelete(null);
      setNomeClienteToDelete(null);
      setIsDeleteModalOpen(false);
    };
  
    const handleConfirmDelete = async () => {
        if (!clienteToDelete) return;
    
        try {
          await deleteClienteById(clienteToDelete);
          handleCloseDeleteModal();
          fetchClients(currentPage, debouncedSearchTerm); 
        } catch (err) {
          setError('Falha ao deletar o cliente.');
          console.error(err);
          handleCloseDeleteModal();
        }
      };


  return (
    <div className='flex flex-col w-full box-border'>
        <HeaderTitlePage page_name='Clientes' />

        <div className="w-full flex flex-1 flex-col px-4 box-border">
            <div className="mb-6 px-2 pb-4 border-b-1 border-gray-200">
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
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <NavLink to={"/clientes/novo"}>
                            <Button variant="primary">
                                <Plus size={18} />
                                <span>Novo cliente</span>
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
        <ClientsTable clients={clients} isLoading={isLoading} currentPage={currentPage} pageSize={pageSize} onDeleteClick={handleOpenDeleteModal}/>
        </div>
        <PopupModal 
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Confirmar Exclusão"
            message="Tem certeza que deseja deletar o(a) cliente "
            itemName={nomeClienteToDelete}
        />
        {error && (
        <ErrorPopup
          message={error}
          onClose={() => setError(null)} 
        />
      )}
    </div>
  );
};

export default ClientsPage;