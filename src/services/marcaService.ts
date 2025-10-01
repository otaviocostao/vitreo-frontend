import type { Page } from '../types/pagination';
import type { MarcaOption } from '../types/produto';
import api from './api';

export const getMarcasOptions = async (): Promise<MarcaOption[]> => {
  try {
    const response = await api.get<Page<MarcaOption>>('/marcas', {
      params: { size: 1000 }
    });
    return response.data.content;
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    throw error;
  }
}