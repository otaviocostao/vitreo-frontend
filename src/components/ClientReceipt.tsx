import React from 'react';
import type { PedidoResponse } from '../types/pedido';
import DetailItem from './DetailItem';

const formatarMoeda = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const formatarData = (dataString: string | null | undefined): string => {
  if (!dataString) return 'N/A';
  return new Date(dataString).toLocaleDateString('pt-BR');
};

interface ReceiptProps {
  pedido: PedidoResponse;
  valorTotalPago: number;
  valorRestante: number;
}

const ClientReceipt: React.FC<ReceiptProps> = ({ pedido, valorTotalPago, valorRestante }) => {

  const armacao = pedido.itens.find(item => item.tipoProduto === 'ARMACAO');
  const lentes = pedido.itens.find(item => item.tipoProduto === 'LENTE');

  return (
    <div className="p-2 mt-2 bg-white w-full">
      <div className="flex justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Recibo do Cliente</h1>
          <p className="text-sm text-gray-500">
            Pedido #{pedido.ordemServico || pedido.id.substring(0, 8)}
          </p>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Ótica Nordeste LTDA</h1> {/* ALTERAR PARA BUSCAR O NOME DA EMPRESA NAS CONFIGURAÇÕES DEPOIS*/}
      </div>

      <div className='flex divide-x divide-gray-200 '>
        <div className='flex flex-col w-[60%] p-2 '>
          <div className=" border-b border-gray-200 py-4 mb-6 space-y-2">
            <DetailItem label="Cliente:" value={pedido.cliente.nomeCompleto} />
            <DetailItem label="Data do Pedido:" value={formatarData(pedido.dataPedido)} />
            <DetailItem label="Previsão de Entrega:" value={formatarData(pedido.dataPrevisaoEntrega)} />
          </div>

          <div className="mb-6 space-y-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Produtos</h2>
            <DetailItem label="Armação:" value={`${armacao?.nomeProduto || ''} - ${armacao?.nomeProduto || 'N/A'}`} />
            <DetailItem label="Lentes:" value={lentes?.nomeProduto || 'N/A'} />
          </div>
        </div>

        <div className="flex flex-col w-[40%] p-2 space-y-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Orçamento do Pedido</h2>
          <DetailItem label="Valor da Armação:" value={formatarMoeda(pedido.valorArmacao)} />
          <DetailItem label="Valor das Lentes:" value={formatarMoeda(pedido.valorLentes)} />
          <DetailItem label="Desconto aplicado:" value={formatarMoeda(pedido.desconto)} />
          <div className="border-t border-gray-200 my-2 pt-2 space-y-1">
            <h2 className="text-lg font-semibold text-gray-700">Financeiro</h2>
            <DetailItem label="Valor Final:" value={<span className="font-bold">{formatarMoeda(pedido.valorFinal)}</span>} />
            <DetailItem label="Valor Pago:" value={<span className="font-bold text-green-600 print:text-black">{formatarMoeda(valorTotalPago)}</span>} />
            <DetailItem label="Valor Restante:" value={<span className={`font-bold ${valorRestante <= 0 ? 'text-green-600' : 'text-red-600'} print:text-black`}>{formatarMoeda(valorRestante)}</span>} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ClientReceipt;