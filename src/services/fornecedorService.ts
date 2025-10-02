import type { FornecedorResponse } from '../types/fornecedor';
import type { Page } from '../types/pagination';
import type { FornecedorOption } from '../types/produto';

import api from './api';

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