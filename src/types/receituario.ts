export interface ReceituarioPayload {
  clienteId?: string;
  esfericoOd?: number;
  cilindricoOd?: number;
  eixoOd?: number;
  esfericoOe?: number;
  cilindricoOe?: number;
  eixoOe?: number;
  adicao?: number;
  distanciaPupilar?: number;
  dnpOd?: number;
  dnpOe?: number;
  centroOpticoOd?: number;
  centroOpticoOe?: number;
  anguloMaior?: number;
  ponteAro?: number;
  anguloVertical: number;
  nomeMedico?: string;
  crmMedico?: string;
  dataReceita: string;
}

export interface ReceituarioResponse {
  receituarioId: string;
  clienteId: string;
  esfericoOd: number;
  cilindricoOd: number;
  eixoOd: number;
  esfericoOe: number;
  cilindricoOe: number;
  eixoOe: number;
  adicao: number;
  distanciaPupilar: number;
  dnpOd: number;
  dnpOe: number;
  centroOpticoOd: number;
  centroOpticoOe: number;
  anguloMaior: number;
  ponteAro: number;
  anguloVertical: number;
  nomeMedico: string;
  crmMedico: string;
  dataReceita: string;
}