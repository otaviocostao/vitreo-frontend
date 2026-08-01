export type ProductType = 'frame' | 'lens';

export type FrameMaterial = 'Acetato' | 'Metal' | 'Flutuante' | 'Semi-Flutuante';

export const frameMaterialOptions = [
  { value: 'Acetato', label: 'Acetato' },
  { value: 'Metal', label: 'Metal' },
  { value: 'Flutuante', label: 'Flutuante' },
  { value: 'Semi-Flutuante', label: 'Semi-Flutuante' },
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

  lensMaterial?: string;
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

  lensMaterial?: string;
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