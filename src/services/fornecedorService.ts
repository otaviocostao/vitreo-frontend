import type { FornecedorPayload, FornecedorResponse } from '../types/fornecedor';
import type { Page } from '../types/pagination';
import type { FornecedorOption } from '../types/produto';

import api from './api';

export const createFornecedor = async (fornecedorData: FornecedorPayload) => {
  try {
    const response = await api.post('/fornecedores', fornecedorData);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar fornecedor:", error);
    throw error;
  }
};

export const getFornecedores = async (page: number, size: number): Promise<Page< FornecedorResponse>> => {
  try {
    const response = await api.get<Page<FornecedorResponse>>('/fornecedores', {
      params: {
        page: page - 1,
        size: size,
        sort: 'razaoSocial,asc'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error);
    throw error;
  }
};

export const getFornecedoresOptions = async (): Promise<FornecedorOption[]> => {
  try {
    const response = await api.get<Page<FornecedorOption>>('/fornecedores', {
      params: { size: 1000 }
    });
    return response.data.content;
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error);
    throw error;
  }
};

export const getFornecedorById = async (id: string): Promise<FornecedorResponse> => {
  try {
    const response = await api.get<FornecedorResponse>(`/fornecedores/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar fornecedor com ID ${id}:`, error);
    throw error;
  }
};

export const updateFornecedor = async (id: string, data: FornecedorPayload): Promise<FornecedorResponse> => {
  try {
    const response = await api.put<FornecedorResponse>(`/fornecedores/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar fornecedor com ID ${id}:`, error);
    throw error;
  }
};

export const associateMarca = async (fornecedorId: string, marcaId: string): Promise<void> => {
  try {
    await api.post(`/fornecedores/${fornecedorId}/marcas/${marcaId}`);
  } catch (error) {
    console.error(`Erro ao associar marca ${marcaId} ao fornecedor ${fornecedorId}:`, error);
    throw error;
  }
};

export const dissociateMarca = async (fornecedorId: string, marcaId: string): Promise<void> => {
  try {
    await api.delete(`/fornecedores/${fornecedorId}/marcas/${marcaId}`);
    await api.delete(`/marcas/${marcaId}`);
  } catch (error) {
    console.error(`Erro ao desassociar marca ${marcaId} do fornecedor ${fornecedorId}:`, error);
    throw error;
  }
};

export const deleteFornecedorById = async (id: string): Promise<void> => {
  try {
    console.log("deletando fornecedor com id", id)
    await api.delete(`/fornecedores/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar fornecedor com ID ${id}:`, error);
    throw error;
  }
};