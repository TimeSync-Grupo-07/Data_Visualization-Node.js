import apiClient from '../Config/api-client.js';

class LoginService {
    
    async login(email, senha){

        try {
            const response = await apiClient.post('/Usuarios/login', {
                emailUsuario: email,
                senhaUsuario: senha
            });
            return response.data;
        } catch (error) {
            console.error('Erro durante o login:', error);
            throw error;
        }

    }

}

export default new LoginService();