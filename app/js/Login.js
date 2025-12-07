import loginService from './services/login-service.js';
import { DOMUtils } from './Config/dom-utils.js';

class PaginaLogin {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        DOMUtils.bindButton('loginButton', () => this.login());
    }

    async login() {
        
        const email = DOMUtils.getInputValue('exampleInputEmail1');
        const senha = DOMUtils.getInputValue('exampleInputPassword1');

        try {
            const resultado = await loginService.login(email, senha);
            console.log('Login bem-sucedido:', resultado);

            // Redirecionar para a página de projetos após o login bem-sucedido
            window.location.href = 'projetos.html';

        } catch (error) {
            console.error('Erro no login:', error);
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new PaginaLogin();
});