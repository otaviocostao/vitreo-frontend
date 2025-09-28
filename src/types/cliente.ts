export interface EnderecoPayload {
  logradouro: string;
  numero: string;
  bairro: string;
  complemento?: string;
  cidade: string;
  estado: string;
  cep: string;
}

export type EnderecoResponse = EnderecoPayload;

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