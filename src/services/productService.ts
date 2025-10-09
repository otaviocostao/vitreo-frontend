import type { Page } from '../types/pagination';
import api from './api';

import type { ProdutoPayload, ProdutoResponse } from '../types/produto';

export const createProduct = async (data: ProdutoPayload) => {
  try {
    const response = await api.post('/produtos', data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
};

export const getProducts = async (page: number, size: number): Promise<Page<ProdutoResponse>> => {
  try {
    const response = await api.get<Page<ProdutoResponse>>('/produtos', {
      params: {
        page: page - 1,
        size: size,
        sort: 'nome,asc'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<ProdutoResponse> => {
  try {
    const response = await api.get<ProdutoResponse>(`/produtos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    throw error;
  }
};

export const updateProduct = async (id: string, data: ProdutoPayload): Promise<ProdutoResponse> => {
  try {
    const response = await api.put<ProdutoResponse>(`/produtos/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar produto com ID ${id}:`, error);
    throw error;
  }
};