import type { ReceituarioPayload } from "./receituario";

export interface ItemPedidoPayload {
  produtoId: string;
  quantidade: number;
}

export interface PagamentoPayload {
  pedidoId: string;
  formaPagamento: 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'PRAZO' | 'TRANSFERENCIA_BANCARIA';
  valorPago: number;
  numeroParcelas?: number;
}

export interface PedidoPayload {
  clienteId: string;
  receituario?: ReceituarioPayload;
  ordemServico?: number;
  itens: ItemPedidoPayload[];
  dataPedido?: string;
  dataPrevisaoEntrega?: string;
  dataEntrega?: string;
  desconto?: number;
  pagamentos?: PagamentoPayload[];
}
