import resumoProjetoService from './services/resumo-projeto-service.js';
import { DOMUtils } from './Config/dom-utils.js';

class PaginaProjeto {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
    }

    bindEvents() {
        DOMUtils.bindButton('loadUsers', () => this.listarTodos());
    }

    async loadInitialData() {
        await this.listarTodos();
    }

    async listarTodos() {
        const container = document.getElementById('listagem-projetos');
        if (!container) return;

        try {
            DOMUtils.showLoading(container);
            const projetos = await resumoProjetoService.listarTodos();
            this.renderzinarProjetos(container, projetos);
        } catch (error) {
            console.error(error)
            DOMUtils.showError(container, 'Falha ao carregar projetos');
        }
    }

    renderzinarProjetos(container, projetos) {
        DOMUtils.clearElement(container);
        
        if (!projetos || projetos.lenght === 0) {
            container.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link active ps-0" id="home-tab" data-bs-toggle="tab" href="#overview" role="tab" aria-controls="overview" aria-selected="true">
                        Nenhum projeto encontrado
                    </a>
                </li>
            `;
            return;
        }
        
        projetos.forEach(projeto => {
            const projetoElement = DOMUtils.createElement('li', 'nav-item');
            projetoElement.innerHTML = `
                <a class="nav-link active ps-0" id="home-tab" data-bs-toggle="tab" href="#overview" role="tab" aria-controls="overview" aria-selected="true">
                    ${projeto.idProjeto}
                </a>
            `;
            container.appendChild(projetoElement);
        });

    }

}

document.addEventListener('DOMContentLoaded', () => {
    new PaginaProjeto();
});