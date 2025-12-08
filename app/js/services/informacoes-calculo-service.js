import apiClient from '../Config/api-client.js';

class InformacoesCalculoService {

    async listarTudo() {
        try {
            const response = await apiClient.get('/InfomacoesCalculo');
            return response.data;
        } catch (error) {
            console.error('Erro buscando os dados:', error);
            throw error;
        }
    }

    async buscarPorColaborador(idColaborador) {
        try {
            const response = await apiClient.get(`/InfomacoesCalculo/${idColaborador}`);
            return response.data;
        } catch (error) {
            console.error('Erro buscando os dados do colaborador especifico:', error);
            throw error;
        }
    }

}

export default new InformacoesCalculoService();