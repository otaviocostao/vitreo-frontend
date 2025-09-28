import type { ClientePayload, ClienteResponse } from '../types/cliente';
import type { Page } from '../types/pagination';
import api from './api';

export const createCliente = async (clienteData: ClientePayload) => {
  try {
    const response = await api.post('/clientes', clienteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    throw error;
  }
};

export const getClientes = async (page: number, size: number): Promise<Page<ClienteResponse>> => {
  try {
    const response = await api.get<Page<ClienteResponse>>('/clientes', {
      params: {
        page: page - 1,
        size: size,
        sort: 'nomeCompleto,asc'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw error;
  }
};