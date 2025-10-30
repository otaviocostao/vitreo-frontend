import type { ReceituarioPayload, ReceituarioResponse } from '../types/receituario';
import api from './api';

export const createReceituario = async (data: ReceituarioPayload): Promise<ReceituarioResponse> => {
    const payload = { ...data }; 
    const response = await api.post('/receituarios', payload);
    return response.data;
}