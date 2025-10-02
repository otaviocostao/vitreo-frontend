import type { EnderecoPayload, EnderecoResponse } from "./endereco";

export interface ClientePayload {
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  email?: string;
  telefone: string;
  endereco: EnderecoPayload;
}

export interface ClienteResponse {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  dataCadastro: string;
  endereco: EnderecoResponse;
}