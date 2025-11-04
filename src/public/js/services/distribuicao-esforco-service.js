import apiClient from '../Config/api-client.js';

class DistribuicaoEsforcoService {
    
    async listarTodos() {
        try {
            const response = await apiClient.get('/AssocUsuarioProjetos/DistribuicaoEsforco');
            return response.data;
        } catch (error) {
            console.error('Erro buscando os dados dos projetos:', error);
            throw error;
        }
    }

    async buscarProjeto(idProjeto) {
        try {
            const response = await apiClient.get(`/AssocUsuarioProjetos/DistribuicaoEsforco/${idProjeto}`);

            return response.data;
        } catch (error) {
            console.error('Erro buscando os dados do projeto especifico:', error);
            throw error;
        }
    }

}

export default new DistribuicaoEsforcoService();