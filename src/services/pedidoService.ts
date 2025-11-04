import type { Page } from '../types/pagination';
import type { PedidoPayload, PedidoResponse } from '../types/pedido';
import api from './api';

export interface PedidoFiltros {
  page?: number;
  size?: number;
}

export const createPedido = async (data: PedidoPayload) => {
    const response = await api.post('/pedidos', data);
    return response.data;
}

export const getPedidos = async (filtros: PedidoFiltros = {}): Promise<Page<PedidoResponse>> => {
  try {
    const response = await api.get<Page<PedidoResponse>>('/pedidos', {
      params: {
        page: filtros.page || 0,
        size: filtros.size || 20,
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pedidos:`, error);
    throw error;
  }
};