import type { CustomerResponse } from "./customer";
import type { ProductResponse } from "./product";

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderItemResponse {
  id: string;
  product: ProductResponse;
  quantity: number;
  unitPrice: number;
}

export type PaymentMethodType = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_SLIP';

export interface PaymentPayload {
  id?: string | number;
  paymentMethod: PaymentMethodType;
  amountPaid: number;
  installments: number;
}

export type PaymentCreatePayload = Omit<PaymentPayload, 'id'>;

export interface OrderPayload {
  customerId: string;
  prescriptionId?: string;
  serviceOrder?: number;
  orderDate: string;
  deliveryForecastDate?: string;
  deliveryDate?: string;
  frameValue?: number;
  lensValue?: number;
  discount?: number;
  status: OrderStatus;
  observations?: string;
  items: OrderItemPayload[];
  payments?: PaymentCreatePayload[];
}

export interface OrderPrescriptionResponse {
  id: string;
  sphericalOd?: number;
  cylindricalOd?: number;
  axisOd?: number;
  sphericalOe?: number;
  cylindricalOe?: number;
  axisOe?: number;
  addition?: number;
  pupillaryDistance?: number;
  dnpOd?: number;
  dnpOe?: number;
  opticalCenterOd?: number;
  opticalCenterOe?: number;
  greaterAngle?: number;
  bridgeFrame?: number;
  verticalAngle?: number;
  doctorName?: string;
  doctorCrm?: string;
  prescriptionDate?: string;
}

export interface PaymentResponse {
  id: string;
  paymentMethod: PaymentMethodType;
  amountPaid: number;
  installments: number;
  paymentDate: string;
}

export interface OrderResponse {
  id: string;
  customer: CustomerResponse;
  prescription?: OrderPrescriptionResponse | null;
  serviceOrder?: number;
  orderDate: string;
  deliveryForecastDate?: string;
  deliveryDate?: string;
  frameValue?: number;
  lensValue?: number;
  totalValue: number;
  finalValue: number;
  discount: number;
  status: OrderStatus;
  observations?: string;
  items: OrderItemResponse[];
  payments: PaymentResponse[];
}

export interface OrderUpdatePayload {
  customerId?: string;
  prescriptionId?: string;
  serviceOrder?: number;
  orderDate?: string;
  deliveryForecastDate?: string;
  deliveryDate?: string;
  frameValue?: number;
  lensValue?: number;
  discount?: number;
  status?: OrderStatus;
  observations?: string;
  items?: OrderItemPayload[];
  payments?: PaymentCreatePayload[];
}
