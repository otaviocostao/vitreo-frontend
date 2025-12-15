export interface MetricaCard {
  valor: string;
  tendencia: 'up' | 'down';
  percentual: number;
  textoContexto: string;
}

export interface GraficoReceita {
  data: string; 
  valor: number;
}

export interface VendaRecente {
  id: string;
  nomeCliente: string;
  valorFinal: number;
  dataPedido: string;
}

export interface DashboardResponse {
  vendasNoPeriodo: MetricaCard;
  valorTotalVendas: MetricaCard;
  ticketMedio: MetricaCard;
  novosClientes: MetricaCard;
  graficoReceita: GraficoReceita[];
  ultimasVendas: VendaRecente[];
}