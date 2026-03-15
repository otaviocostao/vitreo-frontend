import api from "./api";

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