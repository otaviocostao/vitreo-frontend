import type { ClientePayload, ClienteResponse } from '../types/cliente';
import type { Page } from '../types/pagination';
import api from './api';

export interface ClienteFiltros {
  nome?: string;
  cpf?: string;
  page?: number;
  size?: number;
}

export const createCliente = async (clienteData: ClientePayload) => {
  try {
    const response = await api.post<ClienteResponse>('/clientes', clienteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    throw error;
  }
};

export const getClientes = async (filtros: ClienteFiltros = {}): Promise<Page<ClienteResponse>> => {
  try {
    const response = await api.get<Page<ClienteResponse>>('/clientes', {
      params: {
        page: filtros.page || 0,
        size: filtros.size || 20,
        nome: filtros.nome,
        cpf: filtros.cpf,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw error;
  }
};

export const getClienteById = async (id: string): Promise<ClienteResponse> => {
  try {
    const response = await api.get<ClienteResponse>(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar cliente com ID ${id}:`, error);
    throw error;
  }
};

export const updateCliente = async (id: string, data: ClientePayload): Promise<ClienteResponse> => {
  try {
    const response = await api.put<ClienteResponse>(`/clientes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
    throw error;
  }
};