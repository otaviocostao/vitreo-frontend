import type { MarcaPayload, BrandResponse } from '../types/marca';
import type { BrandOption } from '../types/product';
import api from './api';

export const getMarcasOptions = async (): Promise<BrandOption[]> => {
  try {
    const response = await api.get<BrandResponse[]>('/brands');
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map((brand: any) => {
      const supplierObj = brand.supplier || null;
      return {
        id: brand.id,
        name: brand.name,
        supplierId: brand.supplierId || brand.supplier_id || (supplierObj ? supplierObj.id : null),
        supplier: supplierObj ? {
          id: supplierObj.id,
          corporateName: supplierObj.corporateName || supplierObj.corporate_name,
        } : null,
      };
    });
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