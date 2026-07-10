import type { CustomerPayload, CustomerResponse } from '../types/customer';
import type { Page } from '../types/pagination';
import api from './api';

export interface ClienteFiltros {
  query?: string;
  page?: number;
  size?: number;
}

export const createCliente = async (customerPayload: CustomerPayload) => {
  try {
    console.log('payload:', customerPayload);
    const response = await api.post<CustomerResponse>('/customers', customerPayload);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    throw error;
  }
};

export const getClientes = async (filtros: ClienteFiltros = {}): Promise<Page<CustomerResponse>> => {
  try {
    const response = await api.get<CustomerResponse[]>('/customers');
    let content = Array.isArray(response.data) ? response.data : [];

    if (filtros.query) {
      const q = filtros.query.toLowerCase();
      content = content.filter(
        (c) =>
          c.firstName?.toLowerCase().includes(q) ||
          c.lastName?.toLowerCase().includes(q) ||
          c.cpf?.includes(q)
      );
    }

    const page = filtros.page ?? 0;
    const size = filtros.size ?? 10;
    const totalElements = content.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const paginatedContent = content.slice(page * size, (page + 1) * size);

    return {
      content: paginatedContent,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: { sorted: false, unsorted: true, empty: true },
        offset: page * size,
        paged: true,
        unpaged: false,
      },
      totalPages,
      totalElements,
      last: page >= totalPages - 1,
      size,
      number: page,
      sort: { sorted: false, unsorted: true, empty: true },
      numberOfElements: paginatedContent.length,
      first: page === 0,
      empty: paginatedContent.length === 0,
    };
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    throw error;
  }
};

export const getClienteById = async (id: string): Promise<CustomerResponse> => {
  try {
    const response = await api.get<CustomerResponse>(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar cliente com ID ${id}:`, error);
    throw error;
  }
};

export const updateCliente = async (id: string, data: CustomerPayload): Promise<CustomerResponse> => {
  try {
    const response = await api.patch<CustomerResponse>(`/customers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
    throw error;
  }
};

export const deleteClienteById = async (id: string): Promise<void> => {
  try {
    await api.delete(`/customers/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar o cliente com ID ${id}:`, error);
    throw error;
  }
};