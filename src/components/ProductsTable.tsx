import { useNavigate } from 'react-router-dom';

export interface Product {
  id: number;
  description: string;
  brand: string;
  supplier: string;
  purchaseDate: string;
  quantity: number;
  cost: number;
  margin: number;
  value: number;
}

interface ProductsTableProps {
  product: Product[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ product }) => {
  const tableHeaders = ['#', 'Descrição', 'Marca', 'Fornecedor', 'D. Compra', 'Quantidade', 'Custo', 'Margem %', 'Valor'];
  const navigate = useNavigate();

  const handleRowClick = (productId: number) => {
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
            {product.map((product) => (
              <tr 
                key={product.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(product.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.supplier}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.purchaseDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.cost}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.margin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.value)}
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