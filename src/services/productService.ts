import type { Page } from '../types/pagination';
import api from './api';

import type { ProdutoPayload, ProdutoResponse } from '../types/produto';

export const createProduto = async (data: ProdutoPayload) => {
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