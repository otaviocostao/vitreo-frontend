import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import ClientsTable from '../components/ClientsTable';
import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import { NavLink } from 'react-router-dom';
import type { Page } from '../types/pagination';
import type { CustomerResponse } from '../types/customer';
import { deleteClienteById, getClientes, updateClienteStatus } from '../services/clienteService';
import ErrorPopup from '../components/ErrorPopup';
import PopupModal from '../components/ui/ModalPopup';
import { useDebounce } from '../hooks/useDebounce';
import SideDrawer from '../components/ui/SideDrawer';
import { formatCPF } from '../lib/utils';
import { formatDate, formatPhone, formatZipCode } from '../helpers/formatters';

const InfoField: React.FC<{ label: string; value?: string | number | React.ReactNode; className?: string }> = ({ label, value, className = '' }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className={`bg-gray-50/60 p-3 rounded-lg border border-gray-100/60 ${className}`}>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="mt-1 text-sm font-medium text-gray-800 break-words">{value}</div>
    </div>
  );
};

const ClientDetailsView: React.FC<{ client: CustomerResponse }> = ({ client }) => {
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {client.firstName[0].toUpperCase()}{client.lastName[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{client.firstName} {client.lastName}</h3>
            <p className="text-xs text-blue-600 font-medium">{client.isActive !== false ? 'Cliente ativo' : 'Cliente inativo'}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm ${
          client.isActive !== false
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}>
          {client.isActive !== false ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Dados Pessoais</h4>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="CPF" value={client.cpf ? formatCPF(client.cpf) : '-'} />
          <InfoField label="RG" value={client.rg || '-'} />
          <InfoField label="Gênero" value={client.gender ? (client.gender.charAt(0).toUpperCase() + client.gender.slice(1)) : '-'} />
          <InfoField label="Nascimento" value={formatDate(client.birthDate) || '-'} />
          <InfoField label="Naturalidade" value={client.naturality || '-'} className="col-span-2" />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Informações de Contato</h4>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="E-mail" value={client.email || '-'} className="col-span-2" />
          <InfoField label="Telefone" value={formatPhone(client.phone) || '-'} />
          <InfoField label="Telefone Secundário" value={formatPhone(client.secondaryPhone) || '-'} />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Endereço</h4>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="CEP" value={formatZipCode(client.zipCode) || '-'} />
          <InfoField label="Estado" value={client.state || '-'} />
          <InfoField label="Cidade" value={client.city || '-'} />
          <InfoField label="Bairro" value={client.neighborhood || '-'} />
          <InfoField label="Logradouro" value={client.street || '-'} className="col-span-2" />
          <InfoField label="Número" value={client.number || '-'} />
          <InfoField label="Complemento" value={client.complement || '-'} />
        </div>
      </div>

      {client.observations && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Observações</h4>
          <div className="bg-gray-50/60 p-3 rounded-lg border border-gray-100/60 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {client.observations}
          </div>
        </div>
      )}
    </div>
  );
};

const ClientsPage = () => {
  const [selectedClient, setSelectedClient] = useState<CustomerResponse | null>(null);

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [pageInfo, setPageInfo] = useState<Page<CustomerResponse> | null>(null);
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
      const data = await getClientes({ page: pageIndex, size: pageSize, query: query });
      setCustomers(data.content);
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

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateClienteStatus(id, !currentStatus);
      fetchClients(currentPage, debouncedSearchTerm);
      if (selectedClient && selectedClient.id === id) {
        setSelectedClient((prev) => prev ? { ...prev, isActive: !currentStatus } : null);
      }
    } catch (err) {
      setError(`Falha ao ${currentStatus ? 'desativar' : 'ativar'} o cliente.`);
      console.error(err);
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
        <ClientsTable
          customers={customers}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onDeleteClick={handleOpenDeleteModal}
          onDeactivateClick={handleToggleActive}
          onRowClick={(client) => setSelectedClient(client)}
        />
      </div>
      <PopupModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar o(a) cliente "
        itemName={nomeClienteToDelete}
      />
      <SideDrawer
        isOpen={selectedClient !== null}
        onClose={() => setSelectedClient(null)}
        title="Detalhes do Cliente"
      >
        {selectedClient && <ClientDetailsView client={selectedClient} />}
      </SideDrawer>
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