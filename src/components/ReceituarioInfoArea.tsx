import TextareaField from './ui/TextareaField';
import InputField from './ui/InputField';
import type { ReceituarioPayload } from '../types/receituario';
import type { OrderItemPayload, PaymentPayload } from '../types/order';
import type { ProductResponse } from '../types/product';
import type { CustomerResponse } from '../types/customer';
import ProductSearch from './ProductSearch';

interface OrderFormData {
  customer: CustomerResponse | null;
  prescription: ReceituarioPayload;
  items: OrderItemPayload[];
  payments: PaymentPayload[];
  serviceOrder: string;
  orderDate: string;
  deliveryForecastDate: string;
  deliveryDate: string;
  discount: number;
  lensValue: number;
  frameValue: number;
  observations: string;
}

interface ReceituarioInfoAreaProps {
  receituarioData: Partial<ReceituarioPayload>;
  orderData: Partial<OrderFormData>;
  items: OrderItemPayload[];
  onReceituarioChange: (data: Partial<ReceituarioPayload>) => void;
  onOrderChange: (data: Partial<OrderFormData>) => void;
  produtosDisponiveis: ProductResponse[];
  onArmacaoSelect: (produto: ProductResponse | null) => void;
  onLenteSelect: (produto: ProductResponse | null) => void;
  onOpenProductModal: (tipo: 'frame' | 'lens') => void;
  selectedFrame?: ProductResponse | null;
  selectedLens?: ProductResponse | null;
  isEditMode: boolean;
}

const ReceituarioInfoArea: React.FC<ReceituarioInfoAreaProps> = ({
  receituarioData,
  orderData,
  items,
  onReceituarioChange,
  onOrderChange,
  produtosDisponiveis,
  onArmacaoSelect,
  onLenteSelect,
  onOpenProductModal,
  selectedFrame,
  selectedLens,
  isEditMode,
}) => {

  const armacaoItem = items.find(item =>
    produtosDisponiveis.some(p => p.id === item.productId && p.productType === 'frame')
  );

  const armacaoSelecionada = selectedFrame !== undefined ? selectedFrame : (
    armacaoItem ? produtosDisponiveis.find(p => p.id === armacaoItem.productId) : null
  );

  const armacaoCompleta = armacaoSelecionada
    ? (armacaoSelecionada.brand ? armacaoSelecionada : produtosDisponiveis.find(p => p.id === armacaoSelecionada.id) || armacaoSelecionada)
    : null;

  const nomeMarcaArmacao = armacaoCompleta?.brand?.name || '';

  const lentesItens = items.find(item =>
    produtosDisponiveis.some(p => p.id === item.productId && p.productType === 'lens')
  );

  const lentesSelecionada = selectedLens !== undefined ? selectedLens : (
    lentesItens ? produtosDisponiveis.find(p => p.id === lentesItens.productId) : null
  );


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'nomeMedico' || name === 'crmMedico' || name === 'dataReceita') {
      onReceituarioChange({ [name]: value });
    } else {
      onOrderChange({ [name]: value });
    }
  };

  const formatarParaInputDate = (dataHoraString: string | null | undefined): string => {
    if (!dataHoraString) {
      return '';
    }
    return dataHoraString.substring(0, 10);
  };


  return (
    <div className=" p-4 border-t border-gray-200">
      <h3 className="text-md font-semibold text-gray-700 mb-4">Informações Adicionais da Venda</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        <InputField
          id="nomeMedico"
          name="nomeMedico"
          label="Médico:"
          placeholder="Dr. "
          value={receituarioData.nomeMedico || ''}
          onChange={handleChange}
        />


        <ProductSearch
          label="Lentes"
          type="lens"
          selectedProductId={lentesItens?.productId}
          produtosDisponiveis={produtosDisponiveis}
          onProductSelect={onLenteSelect}
          onOpenProductModal={() => onOpenProductModal('lens')}
          selectedProduct={lentesSelecionada}
        />

        <InputField
          id="marca_armacao"
          name="marca_armacao"
          value={nomeMarcaArmacao}
          label="Marca da armação:"
          placeholder="Marca da armação..."
          readOnly
        />

        <ProductSearch
          label="Armação"
          type="frame"
          selectedProductId={armacaoItem?.productId}
          produtosDisponiveis={produtosDisponiveis}
          onProductSelect={onArmacaoSelect}
          onOpenProductModal={() => onOpenProductModal('frame')}
          selectedProduct={armacaoSelecionada}
        />

        <div className="md:col-span-2 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-6 gap-y-4">
            <InputField
              id="orderDate"
              name="orderDate"
              label="Data do pedido"
              type="date"
              value={formatarParaInputDate(orderData.orderDate) || ''}
              onChange={handleChange}
            />
            <InputField
              id="dataReceita"
              name="dataReceita"
              label="Data da Receita"
              type="date"
              value={(receituarioData as any).dataReceita || ''}
              onChange={handleChange}
            />
            <InputField
              id="deliveryForecastDate"
              name="deliveryForecastDate"
              label="Previsão de Entrega"
              type="date"
              value={orderData.deliveryForecastDate || ''}
              onChange={handleChange}
            />
            {(isEditMode) && (
              <InputField
                id="deliveryDate"
                name="deliveryDate"
                label="Data de Entrega"
                type="date"
                value={orderData.deliveryDate || ''}
                readOnly
              />
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <TextareaField
            id="observations"
            name="observations"
            label="Observações:"
            placeholder="Observações sobre o pedido..."
            value={orderData.observations || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ReceituarioInfoArea;