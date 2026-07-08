import type { OrderPayload, OrderResponse, OrderUpdatePayload, OrderStatus } from '../types/order';
import api from './api';

export interface OrderFilters {
  query?: string;
  page?: number;
  size?: number;
}

export const createOrder = async (payload: OrderPayload): Promise<OrderResponse> => {
  try {
    const response = await api.post<OrderResponse>('/orders', payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
};

export const getOrders = async (): Promise<OrderResponse[]> => {
  try {
    const response = await api.get<OrderResponse[]>('/orders');
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pedidos:`, error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<OrderResponse> => {
  try {
    const response = await api.get<OrderResponse>(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pedido com ID ${id}:`, error);
    throw error;
  }
};

export const updateOrder = async (id: string, payload: OrderUpdatePayload): Promise<OrderResponse> => {
  try {
    const response = await api.patch<OrderResponse>(`/orders/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar pedido com ID ${id}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
  try {
    await api.patch(`/orders/${id}`, { status });
  } catch (error) {
    console.error(`Erro ao atualizar status do pedido ${id}:`, error);
    throw error;
  }
};
