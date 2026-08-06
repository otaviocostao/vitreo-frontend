export type ProductType = 'frame' | 'lens';

export type FrameMaterial = 'Acetato' | 'Metal' | 'Flutuante' | 'Semi-Flutuante';

export const frameMaterialOptions = [
  { value: 'Acetato', label: 'Acetato' },
  { value: 'Metal', label: 'Metal' },
  { value: 'Flutuante', label: 'Flutuante' },
  { value: 'Semi-Flutuante', label: 'Semi-Flutuante' },
];

export type LensMaterial = 'Orma' | 'Policarbonato' | 'Alto Indice 1.67' | 'Alto Indice 1.74';

export const lensMaterialOptions = [
  { value: 'Orma', label: 'Orma' },
  { value: 'Policarbonato', label: 'Policarbonato' },
  { value: 'Alto Indice 1.67', label: 'Alto Índice 1.67' },
  { value: 'Alto Indice 1.74', label: 'Alto Índice 1.74' },
];

export interface ProductPayload {
  productType: ProductType;
  name: string;
  reference?: string;
  barcode?: string;
  cost?: number;
  salePrice: number;
  stockQuantity?: number;
  supplierId: string;
  brandId?: string;
  profitMargin?: number;
  isActive?: boolean;

  color?: string;
  material?: FrameMaterial | string;
  size?: string;

  lensMaterial?: LensMaterial | string;
  treatment?: string;
  lensType?: string;
}

export interface ProductResponse {
  id: string;
  productType: ProductType;
  name: string;
  reference?: string;
  barcode?: string;
  cost: number;
  salePrice: number;
  stockQuantity: number;
  supplier: SupplierOption;
  brand?: BrandOption;
  profitMargin?: number;
  isActive: boolean;

  color?: string;
  material?: string;
  size?: string;

  lensMaterial?: LensMaterial | string;
  treatment?: string;
  lensType?: string;
}

export interface SupplierOption {
  id: string;
  corporateName: string;
}

export interface BrandOption {
  id: string;
  name: string;
  supplierId?: string | null;
  supplier?: {
    id: string;
    corporateName: string;
  } | null;
}