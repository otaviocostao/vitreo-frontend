export type TipoProduto = 'ARMACAO' | 'LENTE';

export interface ProdutoPayload {
  tipoProduto: TipoProduto;
  fornecedorId: string;
  marcaId?: string;
  nome: string;
  referencia?: string;
  codigoBarras?: string;
  custo?: number;
  valorVenda: number;
  margemLucroPercentual?: number;
  quantidadeEstoque: number;
  ativo?: boolean;

  cor?: string;
  material?: string;
  tamanho?: string;

  materialLente: string;
  tratamento?: string;
  tipoLente?: string;
}

export interface ProdutoResponse {
  id: string;
  tipoProduto: TipoProduto;
  fornecedor: FornecedorOption;
  marca: MarcaOption;
  nome: string;
  referencia: string;
  codigoBarras: string;
  custo: number;
  valorVenda: number;
  margemLucroPercentual: number;
  quantidadeEstoque: number;
  ativo: boolean;

  nomeMarca: string;
  cor: string;
  material: string;
  tamanho: string;

  materialLente: string;
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