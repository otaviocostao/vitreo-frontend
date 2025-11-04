import type { EnderecoPayload, EnderecoResponse } from "./endereco";

export interface ClientePayload {
  nome: string;
  sobrenome: string;
  cpf?: string;
  rg?: string;
  dataNascimento?: string;
  genero?: string;
  naturalidade?: string;
  endereco?: EnderecoPayload;
  telefone?: string;
  telefoneSecundario?: string;
  email?: string;
  observacoes?: string;
}

export interface ClienteResponse {
  id: string;
  nomeCompleto: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  genero: string;
  naturalidade: string;
  email: string;
  telefone: string;
  telefoneSecundario: string;
  dataCadastro: string;
  endereco: EnderecoResponse;
  observacoes: string;
}

export interface ClienteSimplificadoDTO {
  id: string;
  nomeCompleto: string;
}