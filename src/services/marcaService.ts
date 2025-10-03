import type { MarcaPayload, MarcaResponse } from '../types/marca';
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

export const createMarca = async (data: MarcaPayload): Promise<MarcaResponse> => {
  try {
    const response = await api.post<MarcaResponse>('/marcas', data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar marca:", error);
    throw error;
  }
};