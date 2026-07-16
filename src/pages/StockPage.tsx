import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import ProductsTable from '../components/ProductsTable';
import type { ProductResponse } from '../types/product';
import { deleteProductById, getProducts } from '../services/productService';
import type { Page } from '../types/pagination';
import { NavLink } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import PopupModal from '../components/ui/ModalPopup';
import { useDebounce } from '../hooks/useDebounce';
import SideDrawer from '../components/ui/SideDrawer';

const InfoField: React.FC<{ label: string; value?: string | number | React.ReactNode; className?: string }> = ({ label, value, className = '' }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className={`bg-gray-50/60 p-3 rounded-lg border border-gray-100/60 ${className}`}>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="mt-1 text-sm font-medium text-gray-800 break-words">{value}</div>
    </div>
  );
};

const ProductDetailsView: React.FC<{ product: ProductResponse }> = ({ product }) => {
  const formatarMoeda = (val: number): string => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const getProductTypeLabel = (type: string): string => {
    if (type === 'frame') return 'Armação';
    if (type === 'lens') return 'Lente';
    return type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
          <p className="text-xs text-blue-600 font-semibold mt-0.5">{getProductTypeLabel(product.productType)}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm ${
          product.isActive 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}>
          {product.isActive ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Informações Gerais</h4>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Referência" value={product.reference || '-'} />
          <InfoField label="Código de Barras" value={product.barcode || '-'} />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Valores e Estoque</h4>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Preço de Custo" value={formatarMoeda(product.cost)} />
          <InfoField label="Margem de Lucro %" value={product.profitMargin !== null ? `${product.profitMargin}%` : '-'} />
          <InfoField label="Preço de Venda" value={formatarMoeda(product.salePrice)} />
          <InfoField label="Quantidade em Estoque" value={product.stockQuantity} />
        </div>
      </div>

      {(product.productType === 'frame' || product.productType === 'lens') && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Especificações Técnicas</h4>
          <div className="grid grid-cols-2 gap-3">
            {product.productType === 'frame' ? (
              <>
                <InfoField label="Cor" value={product.color || '-'} />
                <InfoField label="Material" value={product.material || '-'} />
                <InfoField label="Tamanho" value={product.size || '-'} />
              </>
            ) : (
              <>
                <InfoField label="Material da Lente" value={product.lensMaterial || '-'} />
                <InfoField label="Tratamento" value={product.treatment || '-'} />
                <InfoField label="Tipo de Lente" value={product.lensType || '-'} />
              </>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-1.5">Marca e Fornecedor</h4>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Marca" value={product.brand?.name || '-'} />
          <InfoField label="Fornecedor" value={product.supplier?.corporateName || '-'} className="col-span-2" />
        </div>
      </div>
    </div>
  );
};

const StockPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [pageInfo, setPageInfo] = useState<Page<ProductResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pageInfo ? pageInfo.totalPages : 1;
  const pageSize = 20;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productNameToDelete, setProductNameToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchProdutos = useCallback(async (page: number, query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const pageIndex = page - 1;
      const data = await getProducts({ page: pageIndex, size: pageSize, query: query });
      setProducts(data.content);
      setPageInfo(data);
    } catch (err) {
      setError('Falha ao carregar produtos')
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchProdutos(currentPage, debouncedSearchTerm);
  }, [debouncedSearchTerm, currentPage, fetchProdutos]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenDeleteModal = (productId: string, productName: string) => {
    setProductToDelete(productId);
    setProductNameToDelete(productName);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
    setProductNameToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductById(productToDelete);
      handleCloseDeleteModal();
      fetchProdutos(currentPage, debouncedSearchTerm);
    } catch (err) {
      setError('Falha ao deletar o produto.');
      console.error(err);
      handleCloseDeleteModal();
    }
  };


  return (
    <div className='flex flex-col w-full box-border'>
      <HeaderTitlePage page_name='Estoque' />

      <div className="w-full flex flex-1 flex-col px-4 box-border">
        <div className="mb-6 px-2 pb-4 border-b-1 border-gray-200">
          <div className="flex justify-between items-center ">
            <h2 className="text-lg font-semibold text-gray-800">Buscar produto</h2>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

            <div className="relative w-full md:max-w-md">
              <InputField
                id="client-search"
                name="search"
                placeholder="Buscar produto pela referência ou descrição..."
                className="pr-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center justify-end gap-4">
              <NavLink to={"/produtos/novo"}>
                <Button variant="primary">
                  <Plus size={18} />
                  <span>Novo produto</span>
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
        <ProductsTable
          products={products}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onDeleteClick={handleOpenDeleteModal}
          onRowClick={(product) => setSelectedProduct(product)}
        />
      </div>
      <PopupModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar o produto "
        itemName={productNameToDelete}
      />
      <SideDrawer
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title="Detalhes do Produto"
      >
        {selectedProduct && <ProductDetailsView product={selectedProduct} />}
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

export default StockPage;