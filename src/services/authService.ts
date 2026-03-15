import type { LoginResponse } from "../types/login";
import api from "./api";

export const handleLogin = async (userData: any) => {
    try {
        const response = await api.post<LoginResponse>("/auth/login", userData);

        localStorage.setItem("token", response.data.jwtToken);
        localStorage.setItem("userEmail", response.data.email);

        window.location.href = "/"; 
    } catch (err: any) {
        throw err;
    }
};

export const handleLogout = async () => {
    try {
        await api.post('/api/auth/logout');
    } catch (e) {
        console.error("Erro ao invalidar token no servidor");
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
    }
};