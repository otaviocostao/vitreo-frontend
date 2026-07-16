import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import { NavLink } from 'react-router-dom';
import SuppliersTable from '../components/SuppliersTable';
import type { SupplierResponse } from '../types/supplier';
import type { Page } from '../types/pagination';
import { deleteFornecedorById, getFornecedores, updateFornecedorStatus } from '../services/supplierService';
import ErrorPopup from '../components/ErrorPopup';
import PopupModal from '../components/ui/ModalPopup';
import { useDebounce } from '../hooks/useDebounce';
import SideDrawer from '../components/ui/SideDrawer';
import { formatCNPJ } from '../lib/utils';
import { formatPhone, formatZipCode } from '../helpers/formatters';

const InfoField: React.FC<{ label: string; value?: string | number | React.ReactNode; className?: string }> = ({ label, value, className = '' }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className={`bg-gray-50/60 p-3 rounded-lg border border-gray-100/60 ${className}`}>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="mt-1 text-sm font-medium text-gray-800 break-words">{value}</div>
    </div>
  );
};

const SupplierDetailsView: React.FC<{ supplier: SupplierResponse }> = ({ supplier }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {supplier.tradeName ? supplier.tradeName[0].toUpperCase() : supplier.corporateName[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{supplier.tradeName || supplier.corporateName}</h3>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">{supplier.isActive !== false ? 'Fornecedor ativo' : 'Fornecedor inativo'}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
          supplier.isActive !== false
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {supplier.isActive !== false ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Informações da Empresa</h4>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Razão Social" value={supplier.corporateName} className="col-span-2" />
          <InfoField label="Nome Fantasia" value={supplier.tradeName || '-'} className="col-span-2" />
          <InfoField label="CNPJ" value={supplier.cnpj ? formatCNPJ(supplier.cnpj) : '-'} />
          <InfoField label="Inscrição Estadual" value={supplier.stateRegistration || '-'} />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Informações de Contato</h4>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="E-mail" value={supplier.email || '-'} className="col-span-2" />
          <InfoField label="Celular" value={formatPhone(supplier.cellPhone) || '-'} />
          <InfoField label="Telefone Fixo" value={formatPhone(supplier.phone) || '-'} />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Endereço</h4>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="CEP" value={formatZipCode(supplier.zipCode) || '-'} />
          <InfoField label="Estado" value={supplier.state || '-'} />
          <InfoField label="Cidade" value={supplier.city || '-'} />
          <InfoField label="Bairro" value={supplier.neighborhood || '-'} />
          <InfoField label="Logradouro" value={supplier.street || '-'} className="col-span-2" />
          <InfoField label="Número" value={supplier.number || '-'} />
          <InfoField label="Complemento" value={supplier.complement || '-'} />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Marcas Associadas</h4>
        <div className="flex flex-wrap gap-2 pt-1">
          {supplier.brands && supplier.brands.length > 0 ? (
            supplier.brands.map((brand) => (
              <span
                key={brand.id}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200"
              >
                {brand.name}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">Nenhuma marca associada</p>
          )}
        </div>
      </div>
    </div>
  );
};

const SuppliersPage = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierResponse | null>(null);
  const [fornecedores, setFornecedores] = useState<SupplierResponse[]>([]);
  const [pageInfo, setPageInfo] = useState<Page<SupplierResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pageInfo ? pageInfo.totalPages : 1;
  const pageSize = 20;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fornecedorToDelete, setFornecedorToDelete] = useState<string | null>(null);
  const [nomefornecedorToDelete, setNomeFornecedorToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchFornecedores = useCallback(async (page: number, query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const pageIndex = page - 1;
      const data = await getFornecedores({ page: pageIndex, size: pageSize, query: query });
      setFornecedores(data.content);
      setPageInfo(data);
    } catch (err) {
      setError('Falha ao carregar fornecedores')
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFornecedores(currentPage, debouncedSearchTerm)
  }, [debouncedSearchTerm, fetchFornecedores, currentPage])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenDeleteModal = (productId: string, nomeFornecedor: string) => {
    setFornecedorToDelete(productId);
    setNomeFornecedorToDelete(nomeFornecedor);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setFornecedorToDelete(null);
    setNomeFornecedorToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!fornecedorToDelete) return;

    try {
      await deleteFornecedorById(fornecedorToDelete);
      handleCloseDeleteModal();
      fetchFornecedores(currentPage, debouncedSearchTerm);
    } catch (err) {
      setError('Falha ao deletar o fornecedor.');
      console.error(err);
      handleCloseDeleteModal();
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateFornecedorStatus(id, !currentStatus);
      fetchFornecedores(currentPage, debouncedSearchTerm);
      if (selectedSupplier && selectedSupplier.id === id) {
        setSelectedSupplier((prev) => prev ? { ...prev, isActive: !currentStatus } : null);
      }
    } catch (err) {
      setError(`Falha ao ${currentStatus ? 'desativar' : 'ativar'} o fornecedor.`);
      console.error(err);
    }
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
                value={searchTerm}
                onChange={handleSearchChange}
              />
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
        <SuppliersTable
          suppliers={fornecedores}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onDeleteClick={handleOpenDeleteModal}
          onDeactivateClick={handleToggleActive}
          onRowClick={(supplier) => setSelectedSupplier(supplier)}
        />
      </div>
      <PopupModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar o fornecedor "
        itemName={nomefornecedorToDelete}
      />
      <SideDrawer
        isOpen={selectedSupplier !== null}
        onClose={() => setSelectedSupplier(null)}
        title="Detalhes do Fornecedor"
      >
        {selectedSupplier && <SupplierDetailsView supplier={selectedSupplier} />}
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

export default SuppliersPage;