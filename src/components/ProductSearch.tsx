import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
import type { ProductResponse, ProductType } from '../types/product';
import { getProductById, getProducts } from '../services/productService';
import SearchableSelectWithButton from './SearchableSelectWithButton';

interface ProductSearchProps {
  label: string;
  type: ProductType;
  selectedProductId: string | undefined;
  produtosDisponiveis: ProductResponse[];
  onProductSelect: (product: ProductResponse | null) => void;
  onOpenProductModal: () => void;
  selectedProduct?: ProductResponse | null;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  label,
  type,
  selectedProductId,
  produtosDisponiveis,
  onProductSelect,
  onOpenProductModal,
  selectedProduct: passedSelectedProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProduct = passedSelectedProduct !== undefined ? passedSelectedProduct : (
    produtosDisponiveis.find(p => p.id === selectedProductId)
  );

  useEffect(() => {
    if (searchTerm.length < 2) {
      setOptions([]);
      return;
    }
    const debounceTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await getProducts({ query: searchTerm, type: type, size: 20 });
        const productOptions = data.content.map(p => ({
          value: p.id,
          label: `${p.name}`,
        }));
        setOptions(productOptions);
      } catch (error) {
        console.error(`Erro na busca de ${type}:`, error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, type]);

  const handleSelectChange = async (selectedOption: any) => {
    if (selectedOption && selectedOption.value) {
      setIsLoading(true);
      try {
        const fullProductData = await getProductById(selectedOption.value);
        onProductSelect(fullProductData);
      } catch (error) {
        console.error("Falha ao buscar detalhes do produto:", error);
        onProductSelect(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      onProductSelect(null);
    }
  };

  return (
    <div className='flex flex-1 items-end justify-start '>
      {selectedProduct ? (
        <div className='flex flex-col flex-1'>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <div className="flex flex-1 items-center justify-between p-1.5 px-3 m-0 border border-gray-300 rounded-md">
            <div className="flex items-center gap-3">
              <div >
                <p className="font-semibold text-gray-700 text-sm">{selectedProduct.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onProductSelect(null)}
              className="text-gray-600 hover:text-red-600 cursor-pointer transition-discrete duration-200 text-xs"
            >
              <X />
            </button>
          </div>
        </div>
      ) : (
        <SearchableSelectWithButton
          label={label}
          options={options}
          value={null}
          onChange={handleSelectChange}
          onInputChange={(inputValue) => setSearchTerm(inputValue)}
          onButtonClick={onOpenProductModal}
          buttonIcon={<PlusCircle size={20} />}
          placeholder={`Buscar por ${label.toLowerCase()}...`}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ProductSearch;