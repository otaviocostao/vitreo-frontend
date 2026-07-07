import type { MarcaPayload, BrandResponse } from '../types/marca';
import type { BrandOption } from '../types/produto';
import api from './api';

export const getMarcasOptions = async (): Promise<BrandOption[]> => {
  try {
    const response = await api.get<BrandResponse[]>('/brands');
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map((brand) => ({
      id: brand.id,
      nome: brand.name,
    }));
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    throw error;
  }
};

export const createMarca = async (data: MarcaPayload): Promise<BrandResponse> => {
  try {
    const response = await api.post<BrandResponse>('/brands', data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar marca:", error);
    throw error;
  }
};