import apiClient from '../Config/api-client.js';

class HorasRetroativassService {
    
    async listarTodos() {
        try {
            const response = await apiClient.get('/HorasRetroativas');

            if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
                return [];
            }

            return response.data;
        } catch (error) {
            console.error('Erro buscando os dados dos projetos:', error);
            return [];
        }
    }

    async buscarProjeto(idProjeto) {
        try {
            const response = await apiClient.get(`/HorasRetroativas/${idProjeto}`);

            if (!response.data) {
                return this.getProjetoPadrao(idProjeto);
            }

            return response.data;
        } catch (error) {
            console.error('Erro buscando os dados do projeto especifico:', error);
            throw error;
        }
    }

    getProjetoPadrao(idProjeto) {
        return {
            idProjeto: idProjeto,
            nomeProjeto: 'N/A',
            horasRetroativas: 0
        };
    }

}

export default new HorasRetroativassService();