import type { ReceituarioPayload } from "./receituario";

export interface ItemPedidoPayload {
  produtoId: string;
  quantidade: number;
}

export interface PagamentoPayload {
  id: number,
  formaPagamento: 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'PRAZO' | 'PENDENTE';
  valorPago: number;
  numeroParcelas: number;
}

export type PagamentoCreatePayload = Omit<PagamentoPayload, 'id'>;

export interface PedidoPayload {
  clienteId: string;
  receituario?: ReceituarioPayload;
  ordemServico?: number;
  itens: ItemPedidoPayload[];
  dataPedido?: string;
  dataPrevisaoEntrega?: string;
  dataEntrega?: string;
  valorLentes?: number;
  valorArmacao?: number;
  desconto?: number;
  pagamentos?: PagamentoCreatePayload[];
}
