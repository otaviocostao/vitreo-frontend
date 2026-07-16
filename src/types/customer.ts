export interface CustomerPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  birthDate?: string;
  cpf?: string;
  rg?: string;
  gender?: string;
  naturality?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  observations?: string;
}

export interface CustomerResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  secondaryPhone: string;
  birthDate: string;
  cpf: string;
  rg: string;
  gender: string;
  naturality: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  observations: string;
}

export interface ClienteSimplificadoDTO {
  id: string;
  name: string;
}