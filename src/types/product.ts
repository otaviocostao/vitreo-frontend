export type ProductType = 'frame' | 'lens';

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
  material?: string;
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