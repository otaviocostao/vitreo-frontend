export interface EnderecoPayload {
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export type EnderecoResponse = EnderecoPayload;
