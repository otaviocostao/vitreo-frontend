import type { PedidoPayload } from '../types/pedido';
import api from './api';

export const createPedido = async (data: PedidoPayload) => {
    const response = await api.post('/pedidos', data);
    return response.data;
}