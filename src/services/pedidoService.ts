import type { Page } from '../types/pagination';
import type { PedidoPayload, PedidoResponse, PedidoUpdatePayload } from '../types/pedido';
import api from './api';

export interface PedidoFiltros {
  query?: string;
  page?: number;
  size?: number;
}

export const createPedido = async (data: PedidoPayload) => {
    const response = await api.post('/pedidos', data);
    return response.data;
}

export const getPedidos = async (filtros: PedidoFiltros = {}): Promise<Page<PedidoResponse>> => {
  const params: Record<string, any> = {
    page: filtros.page ?? 0,
    size: filtros.size ?? 20,
  }

  if (filtros.query) {
    params.query = filtros.query;
  }

  try {
    const response = await api.get<Page<PedidoResponse>>('/pedidos', {params});
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pedidos:`, error);
    throw error;
  }
};

export const getPedidoById = async (id: string): Promise<PedidoResponse> => {
  try {
    const response = await api.get<PedidoResponse>(`/pedidos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pedido com ID ${id}:`, error);
    throw error;
  }
};

export const updatePedido = async (id: string, payload: PedidoUpdatePayload): Promise<PedidoResponse> => {
  try {
    const response = await api.put<PedidoResponse>(`/pedidos/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar pedido com ID ${id}:`, error);
    throw error;
  }
};