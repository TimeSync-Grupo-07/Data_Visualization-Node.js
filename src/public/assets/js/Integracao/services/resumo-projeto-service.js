import apiClient from '../Config/api-client.js';

class ResumoProjetoService {
    
    async listarTodos() {
        try {
            const response = await apiClient.get('/ResumoProjetosEquipe');
            return response.data;
        } catch (error) {
            console.error('Erro buscando os projetos:', error);
            throw error;
        }
    }

    async buscarProjeto(idProjeto) {
        try {
            const response = await apiClient.get(`/ResumoProjetosEquipe/${idProjeto}`);
            return response.data;
        } catch (error) {
            console.error('Erro buscando o projeto especifico:', error);
            throw error;
        }
    }

}

export default new ResumoProjetoService();