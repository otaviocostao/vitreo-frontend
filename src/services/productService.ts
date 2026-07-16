import type { Page } from '../types/pagination';
import api from './api';

import type { ProductPayload, ProductResponse } from '../types/product';

export interface ProductFilters {
  query?: string;
  type?: 'frame' | 'lens';
  page?: number;
  size?: number;
  sort?: string;
}

export const createProduct = async (data: ProductPayload) => {
  try {
    const response = await api.post<ProductResponse>('/products', data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
};

export const getProducts = async (filters: ProductFilters = {}): Promise<Page<ProductResponse>> => {
  try {
    const response = await api.get<ProductResponse[]>('/products');
    let content = Array.isArray(response.data) ? response.data : [];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      content = content.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.reference?.toLowerCase().includes(q)
      );
    }

    if (filters.type) {
      content = content.filter((p) => p.productType === filters.type);
    }

    const sortField = filters.sort?.split(',')[0] || 'name';
    const sortOrder = filters.sort?.split(',')[1] || 'asc';
    content.sort((a: any, b: any) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
    });

    const page = filters.page ?? 0;
    const size = filters.size ?? 10;
    const totalElements = content.length;
    const totalPages = Math.ceil(totalElements / size) || 1;
    const paginatedContent = content.slice(page * size, (page + 1) * size);

    return {
      content: paginatedContent,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: { sorted: true, unsorted: false, empty: false },
        offset: page * size,
        paged: true,
        unpaged: false,
      },
      totalPages,
      totalElements,
      last: page >= totalPages - 1,
      size,
      number: page,
      sort: { sorted: true, unsorted: false, empty: false },
      numberOfElements: paginatedContent.length,
      first: page === 0,
      empty: paginatedContent.length === 0,
    };
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    throw error;
  }
};

export const updateProduct = async (id: string, data: ProductPayload): Promise<ProductResponse> => {
  try {
    const response = await api.patch<ProductResponse>(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar produto com ID ${id}:`, error);
    throw error;
  }
};

export const updateProductStatus = async (id: string, isActive: boolean): Promise<ProductResponse> => {
  try {
    const response = await api.patch<ProductResponse>(`/products/${id}/active`, { isActive });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar status do produto com ID ${id}:`, error);
    throw error;
  }
};

export const deleteProductById = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar produto com ID ${id}:`, error);
    throw error;
  }
};