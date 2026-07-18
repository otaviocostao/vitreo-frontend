import type { SupplierResponse } from './supplier';

export interface MarcaPayload {
  name: string;
  isActive?: boolean;
}

export interface BrandResponse {
  id: string;
  name: string;
  isActive?: boolean;
  supplierId?: string | null;
  supplier?: SupplierResponse | null;
}