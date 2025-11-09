// resumo-projeto-service.js
import apiClient from '../Config/api-client.js';

class ResumoProjetoService {
    
    async listarTodos() {
        try {
            const response = await apiClient.get('/ResumoProjetosEquipe');
            
            // Se a resposta for null ou empty array, retorna array vazio
            if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
                return [];
            }
            
            return response.data;
        } catch (error) {
            console.error('Erro buscando os projetos:', error);
            // Retorna array vazio em caso de erro também
            return [];
        }
    }

    async buscarProjeto(idProjeto) {
        try {
            const response = await apiClient.get(`/ResumoProjetosEquipe/${idProjeto}`);
            
            // Se a resposta for null, retorna objeto com valores padrão
            if (!response.data) {
                return this.getProjetoPadrao(idProjeto);
            }
            
            return response.data;
        } catch (error) {
            console.error('Erro buscando o projeto especifico:', error);
            // Retorna objeto padrão em caso de erro
            return this.getProjetoPadrao(idProjeto);
        }
    }

    getProjetoPadrao(idProjeto) {
        return {
            idProjeto: idProjeto,
            nomeProjeto: 'N/A',
            dataInicio: 'N/A',
            horasPlanejadas: 0,
            custoEstimadoLaboral: 0,
            dataEntrega: 'N/A'
        };
    }
}

export default new ResumoProjetoService();