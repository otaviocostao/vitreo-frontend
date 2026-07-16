import type { BrandResponse } from "./marca";

export interface SupplierPayload {
  corporateName: string;
  tradeName?: string;
  cnpj: string;
  stateRegistration?: string;
  cellPhone?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive?: boolean;
}

export interface SupplierResponse {
  id: string;
  corporateName: string;
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  cellPhone: string;
  phone: string;
  email: string;
  logoUrl: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  brands: BrandResponse[];
  isActive: boolean;
}