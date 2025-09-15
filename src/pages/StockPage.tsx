import { useState } from 'react';
import { Plus, Search } from 'lucide-react';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

import Pagination from '../components/ui/Pagination';
import HeaderTitlePage from '../components/HeaderTitlePage';
import ProductsTable, { type Product } from '../components/ProductsTable';
import AddProductModal, { type NewProductFormData } from '../components/AddProductModal';

const mockProduct: Product[] = Array.from({ length: 13    }, (_, i) => ({
  id: 1,
  description: "Lente Kodak Precise UHD",
  brand: "Essilor",
  supplier: "Tecnolens",
  purchaseDate: "22/08/2025",
  quantity: 100,
  cost: 107,
  margin: 150,
  value: 270,
}));

const StockPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProduct);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5

  const[isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = () => setIsAddModalOpen(true);

  const handleCloseAddModal = () => setIsAddModalOpen(false);



  const handlePageChange = (page: number) => {
    console.log(`Buscando dados para a página ${page}...`);
    setCurrentPage(page);
  };

   const suppliersData = [{id: 'uuid-supplier-1', name: 'Essilor'}, {id: 'uuid-supplier-2', name: 'Luxottica'}];
    const brandsData = [{id: 'uuid-brand-1', name: 'Ray-Ban'}, {id: 'uuid-brand-2', name: 'Oakley'}];

    const handleProductSubmit = async (data: NewProductFormData) => {
        console.log("Enviando para a API:", data);
        // Lógica para enviar os dados para o seu back-end
        // Ex: await api.post('/produtos', data);
        // Se a API retornar um erro, o 'catch' no modal vai pegar.
        // Simulando um delay de rede:
        await new Promise(resolve => setTimeout(resolve, 1500)); 
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
                        <Button onClick={handleOpenAddModal} variant="primary">
                            <Plus size={18} />
                            <span>Novo produto</span>
                        </Button>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        <ProductsTable product={products} />
        </div>
        <AddProductModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSubmit={function (data: NewProductFormData): Promise<void> {
              throw new Error('Function not implemented.');
          } } suppliers={[]} brands={[]} />
    </div>
  );
};

export default StockPage;