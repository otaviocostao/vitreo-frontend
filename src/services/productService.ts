import type { Page } from '../types/pagination';
import api from './api';

import type { ProdutoPayload, ProdutoResponse } from '../types/produto';

export interface ProdutoFiltros {
  query?: string;
  tipo?: 'ARMACAO' | 'LENTE' | 'ACESSORIO';
  page?: number;
  size?: number;
  sort?: string;
}

export const createProduct = async (data: ProdutoPayload) => {
  try {
    const response = await api.post<ProdutoResponse>('/produtos', data);
  
    const produtoDaApi = response.data;
    produtoDaApi.tipoProduto = data.tipoProduto;
    
    return produtoDaApi;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
};

export const getProducts = async (filtros: ProdutoFiltros = {}): Promise<Page<ProdutoResponse>> => {
  const params: Record<string, any> = {
    page: filtros.page ?? 0,
    size: filtros.size ?? 10,
    sort: filtros.sort ?? 'nome,asc',
  };

  if (filtros.query) {
    params.query = filtros.query;
  }
  if (filtros.tipo) {
    params.tipo = filtros.tipo;
  }

  try {
    const response = await api.get<Page<ProdutoResponse>>('/produtos', { params });
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

export const deleteProductById = async (id: string): Promise<void> => {
  try {
    await api.delete(`/produtos/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar produto com ID ${id}:`, error);
    throw error;
  }
};