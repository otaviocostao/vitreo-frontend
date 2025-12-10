import type { ClienteSimplificadoDTO } from "./cliente";
import type { ReceituarioPayload } from "./receituario";

export interface ItemPedidoPayload {
  produtoId: string;
  quantidade: number;
}

export interface ItemPedidoResponse {
  produtoId: string;
  nomeProduto: string;
  tipoProduto: 'LENTE' | 'ARMACAO';
  quantidade: number;
}

export interface PagamentoPayload {
  id?: string | number,
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

export interface PedidoResponse {
  id: string;
  cliente: ClienteSimplificadoDTO;
  receituario: ReceituarioPayload;
  status: StatusPedido;
  ordemServico: number;
  itens: ItemPedidoResponse[];
  dataPedido: string;
  dataPrevisaoEntrega: string;
  dataEntrega: string;
  valorLentes: number;
  valorArmacao: number;
  valorTotal: number;
  valorFinal: number;
  desconto: number;
  pagamentos: PagamentoCreatePayload[];
}

export type StatusPedido = 'ORCAMENTO' | 'SOLICITADO' | 'EM_PRODUCAO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';

export interface PedidoUpdatePayload {
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