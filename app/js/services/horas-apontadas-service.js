import apiClient from '../Config/api-client.js';

class HorasApontadasService {
    
    async listarTodos() {
        try {
            const response = await apiClient.get('/HorasApontadas');

            if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
                return [];
            }

            return response.data;
        } catch (error) {
            console.error('Erro buscando as Horas Apontadas:', error);
            return [];
        }
    }

    async buscarProjeto(idProjeto) {
        try {
            const response = await apiClient.get(`/HorasApontadas/${idProjeto}`);

            if (!response.data) {
                return this.getProjetoPadrao(idProjeto);
            }

            return response.data;
        
        } catch (error) {
            console.error('Erro buscando os dados do projeto especifico:', error);
            return this.getProjetoPadrao(idProjeto);
        }
    }

    getProjetoPadrao(idProjeto) {
        return {
            idProjeto: idProjeto,
            nomeProjeto: 'N/A',
            horasApontadas: 0
        };
    }

}

export default new HorasApontadasService();