export type TipoProduto = 'ARMACAO' | 'LENTE';

export interface ProdutoPayload {
  tipoProduto: TipoProduto;
  fornecedorId: string;
  marcaId?: string;
  nome: string;
  referencia?: string;
  codigoBarras?: string;
  custo?: number;
  margemLucroPercentual?: number;
  quantidadeEstoque: number;
  ativo?: boolean;

  cor?: string;
  material?: string;
  tamanho?: string;

  indiceRefracao?: number;
  tratamento?: string;
  tipoLente?: string;
}

export interface ProdutoResponse {
  tipoProduto: TipoProduto;
  fornecedorId: string;
  marcaId: string;
  nome: string;
  referencia: string;
  codigoBarras: string;
  custo: number;
  margemLucroPercentual: number;
  quantidadeEstoque: number;
  ativo: boolean;

  cor: string;
  material: string;
  tamanho: string;

  indiceRefracao: number;
  tratamento: string;
  tipoLente: string;
}

export interface FornecedorOption {
  id: string;
  razaoSocial: string;
}

export interface MarcaOption {
  id: string;
  nome: string;
}