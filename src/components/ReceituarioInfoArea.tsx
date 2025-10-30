import TextareaField from './ui/TextareaField';
import InputField from './ui/InputField';
import type { ReceituarioPayload } from '../types/receituario';
import type { ItemPedidoPayload, PagamentoPayload } from '../types/pedido';
import type { ProdutoResponse } from '../types/produto';
import type { ClienteResponse } from '../types/cliente';
import ProductSearch from './ProductSearch';

interface VendaFormData {
    cliente: ClienteResponse | null;
    receituario: ReceituarioPayload;
    itens: ItemPedidoPayload[];
    pagamentos: PagamentoPayload[];
    ordemServico: string;
    dataPedido: string;
    dataPrevisaoEntrega: string;
    dataEntrega: string;
    desconto: string;
}

interface ReceituarioInfoAreaProps {
  receituarioData: Partial<ReceituarioPayload>;
  pedidoData: Partial<VendaFormData>;
  itens: ItemPedidoPayload[];
  onReceituarioChange: (data: Partial<ReceituarioPayload>) => void;
  onPedidoChange: (data: Partial<VendaFormData>) => void;
  produtosDisponiveis: ProdutoResponse[]; 
  onArmacaoSelect: (produto: ProdutoResponse | null) => void;
  onLenteSelect: (produto: ProdutoResponse | null) => void;
  onOpenProductModal: (tipo: 'ARMACAO' | 'LENTE') => void;
}

const ReceituarioInfoArea: React.FC<ReceituarioInfoAreaProps> = ({
    receituarioData,
    pedidoData,
    itens,
    onReceituarioChange,
    onPedidoChange,
    produtosDisponiveis,
    onArmacaoSelect,
    onLenteSelect,
    onOpenProductModal
  }) => {

  const armacaoItem = itens.find(item => 
    produtosDisponiveis.some(p => p.id === item.produtoId && p.tipoProduto === 'ARMACAO')
  );

  const armacaoSelecionada = armacaoItem 
    ? produtosDisponiveis.find(p => p.id === armacaoItem.produtoId) 
    : null;

  const nomeMarcaArmacao = armacaoSelecionada ? armacaoSelecionada.marca.nome : '';
  
  const lentesItens = itens.find(item => 
    produtosDisponiveis.some(p => p.id === item.produtoId && p.tipoProduto === 'LENTE')
  );


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'nomeMedico' || name === 'crmMedico' || name === 'dataReceita') {
      onReceituarioChange({ [name]: value });
    } else {
      onPedidoChange({ [name]: value });
    }
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
        tipo="LENTE"
        selectedProductId={lentesItens?.produtoId}
        produtosDisponiveis={produtosDisponiveis}
        onProductSelect={onLenteSelect}
        onOpenProductModal={() => onOpenProductModal('LENTE')}
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
          tipo="ARMACAO"
          selectedProductId={armacaoItem?.produtoId}
          produtosDisponiveis={produtosDisponiveis}
          onProductSelect={onArmacaoSelect}
          onOpenProductModal={() => onOpenProductModal('ARMACAO')}
        />
      
        <div className="md:col-span-2 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
            <InputField
              id="dataReceita"
              name="dataReceita"
              label="Data da Receita"
              type="date"
              value={(receituarioData as any).dataReceita || ''}
              onChange={handleChange}
            />
            <InputField
              id="dataPrevisaoEntrega"
              name="dataPrevisaoEntrega"
              label="Previsão de Entrega"
              type="date"
              value={(pedidoData as any).dataPrevisaoEntrega || ''}
              onChange={handleChange}
            />
            <InputField
              id="data_entrega"
              name="data_entrega"
              label="Data de Entrega"
              type="date"
              value={(pedidoData as any).dataEntrega || ''}
              readOnly  
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <TextareaField
            id="observacoes"
            name="observacoes"
            label="Observações:"
            placeholder="Observações sobre o pedido..."
            value={(pedidoData as any).observacoes || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ReceituarioInfoArea