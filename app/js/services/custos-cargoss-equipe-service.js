import apiClient from '../Config/api-client.js';

class custosCargosEquipeService {
    
    async listarTodos() {
        try {
            const response = await apiClient.get('/CustosCargosEquipe');
            return response.data;
        } catch (error) {
            console.error('Erro buscando os dados dos projetos:', error);
            throw error;
        }
    }

}

export default new custosCargosEquipeService();