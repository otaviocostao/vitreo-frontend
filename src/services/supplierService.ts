import type { SupplierPayload, SupplierResponse } from '../types/supplier';
import type { Page } from '../types/pagination';
import type { FornecedorOption } from '../types/produto';

import api from './api';

export interface FornecedorFiltros {
  query?: string;
  page?: number;
  size?: number;
}

export const createFornecedor = async (supplierPayload: SupplierPayload) => {
  try {
    const response = await api.post('/suppliers', supplierPayload);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar fornecedor:", error);
    throw error;
  }
};

export const getFornecedores = async (filtros: FornecedorFiltros = {}): Promise<Page<SupplierResponse>> => {
  try {
    const response = await api.get<SupplierResponse[]>('/suppliers');
    let content = Array.isArray(response.data) ? response.data : [];

    if (filtros.query) {
      const q = filtros.query.toLowerCase();
      content = content.filter(
        (s) =>
          s.corporateName?.toLowerCase().includes(q) ||
          s.tradeName?.toLowerCase().includes(q) ||
          s.cnpj?.includes(q)
      );
    }

    const page = filtros.page ?? 0;
    const size = filtros.size ?? 20;
    const totalElements = content.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const paginatedContent = content.slice(page * size, (page + 1) * size);

    return {
      content: paginatedContent,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: { sorted: false, unsorted: true, empty: true },
        offset: page * size,
        paged: true,
        unpaged: false,
      },
      totalPages,
      totalElements,
      last: page >= totalPages - 1,
      size,
      number: page,
      sort: { sorted: false, unsorted: true, empty: true },
      numberOfElements: paginatedContent.length,
      first: page === 0,
      empty: paginatedContent.length === 0,
    };
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error);
    throw error;
  }
};

export const getFornecedoresOptions = async (): Promise<FornecedorOption[]> => {
  try {
    const response = await api.get<SupplierResponse[]>('/suppliers');
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map((s) => ({
      id: s.id,
      razaoSocial: s.corporateName,
    }));
  } catch (error) {
    console.error("Erro ao buscar opções de fornecedores:", error);
    throw error;
  }
};

export const getFornecedorById = async (id: string): Promise<SupplierResponse> => {
  try {
    const response = await api.get<SupplierResponse>(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar fornecedor com ID ${id}:`, error);
    throw error;
  }
};

export const updateFornecedor = async (id: string, data: SupplierPayload): Promise<SupplierResponse> => {
  try {
    const response = await api.put<SupplierResponse>(`/suppliers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar fornecedor com ID ${id}:`, error);
    throw error;
  }
};

export const associateMarca = async (supplierId: string, brandId: string): Promise<void> => {
  try {
    await api.post(`/suppliers/${supplierId}/brands/${brandId}`);
  } catch (error) {
    console.error(`Erro ao associar marca ${brandId} ao fornecedor ${supplierId}:`, error);
    throw error;
  }
};

export const dissociateMarca = async (supplierId: string, brandId: string): Promise<void> => {
  try {
    await api.delete(`/suppliers/${supplierId}/brands/${brandId}`);
  } catch (error) {
    console.error(`Erro ao desassociar marca ${brandId} do fornecedor ${supplierId}:`, error);
    throw error;
  }
};

export const deleteFornecedorById = async (id: string): Promise<void> => {
  try {
    console.log("deletando fornecedor com id", id)
    await api.delete(`/suppliers/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar fornecedor com ID ${id}:`, error);
    throw error;
  }
};