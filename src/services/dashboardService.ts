import type { DashboardResponse } from "../types/dashboard";
import api from "./api";

export const getDashboardData = async (dataInicio: string, dataFim: string): Promise<DashboardResponse> => {
    try{
        const response = await api.get<DashboardResponse>('/dashboard', {
            params:{
                dataInicio,
                dataFim,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        throw error;
    }
}