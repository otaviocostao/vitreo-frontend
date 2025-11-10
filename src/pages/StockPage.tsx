import { useCallback, useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import ProductsTable from '../components/ProductsTable';
import type { ProdutoResponse } from '../types/produto';
import { deleteProductById, getProducts } from '../services/productService';
import type { Page } from '../types/pagination';
import { NavLink } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import PopupModal from '../components/ui/ModalPopup';


const StockPage = () => {
  const [products, setProducts] = useState<ProdutoResponse[]>([]);
  const [pageInfo, setPageInfo] = useState<Page<ProdutoResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pageInfo ? pageInfo.totalPages : 1;
  const pageSize = 20;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchProdutos = useCallback(async(page:number) => {
    setIsLoading(true);
    setError(null);

    try{
        const pageIndex = page - 1; 
        const data = await getProducts({page: pageIndex, size: pageSize});
        setProducts(data.content);
        setPageInfo(data);
        setCurrentPage(page);
    }catch (err) {
        setError('Falha ao carregar produtos')
        console.error(err);
    }finally{
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProdutos(currentPage)
  }, [fetchProdutos, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenDeleteModal = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductById(productToDelete);
      handleCloseDeleteModal();
      fetchProdutos(currentPage); 
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
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
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
          product={products} 
          isLoading={isLoading} 
          currentPage={currentPage} 
          pageSize={pageSize}
          onDeleteClick={handleOpenDeleteModal} 
          />
        </div>
        <PopupModal 
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Confirmar Exclusão"
            message="Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita."
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

export default StockPage;