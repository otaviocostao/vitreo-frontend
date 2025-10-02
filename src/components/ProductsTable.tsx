import { useNavigate } from 'react-router-dom';
import type { ProdutoResponse } from '../types/produto';

interface ProductsTableProps {
  product: ProdutoResponse[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ product }) => {
  const tableHeaders = ['#', 'Descrição', 'Marca', 'Quantidade', 'Custo', 'Margem %', 'Valor'];
  const navigate = useNavigate();

  const handleRowClick = (productId: string) => {
    navigate(`/product/${productId}`);
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
            {product.map((product, i) => (
              <tr 
                key={product.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(product.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i+1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.nomeMarca}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.quantidadeEstoque}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.custo) || ''}
                  </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.margemLucroPercentual}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.valorVenda)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;