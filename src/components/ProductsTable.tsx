import { useNavigate } from 'react-router-dom';
import type { ProductResponse } from '../types/product';
import LoadingSpinner from './LoadingSpinner';
import Button from './ui/Button';
import { Trash2 } from 'lucide-react';

interface ProductsTableProps {
  products: ProductResponse[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onDeleteClick: (productId: string, productName: string) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, isLoading, currentPage, pageSize, onDeleteClick }) => {
  const tableHeaders = ['#', 'Descrição', 'Marca', 'Quantidade', 'Custo', 'Margem %', 'Valor', ''];
  const navigate = useNavigate();

  const handleRowClick = (productId: string) => {
    navigate(`/produtos/${productId}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
      <div className="max-h-[60vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="sticky top-0">
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-8">
                  <LoadingSpinner
                    size="h-8 w-8"
                    text="Carregando produtos..."
                  />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center p-8 text-gray-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              products.map((prod, i) => {
                const rowNumber = (currentPage - 1) * pageSize + i + 1;
                return (
                  <tr
                    key={prod.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(prod.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rowNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prod.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prod.brand?.name || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prod.stockQuantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.cost) || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prod.profitMargin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.salePrice)}
                    </td>
                    <td>
                      <Button
                        variant="smallDelete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClick(prod.id, prod.name);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;