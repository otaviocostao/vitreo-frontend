import type { Page } from '../types/pagination';
import type { FornecedorOption } from '../types/produto';

import api from './api';

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