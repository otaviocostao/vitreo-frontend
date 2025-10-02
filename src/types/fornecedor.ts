import type { EnderecoPayload, EnderecoResponse } from "./endereco";

export interface FornecedorPayload {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  telefone?: string;
  email?: string;
  endereco?: EnderecoPayload;
}

export interface FornecedorResponse {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  telefone: string;
  email: string;
  endereco: EnderecoResponse;
}