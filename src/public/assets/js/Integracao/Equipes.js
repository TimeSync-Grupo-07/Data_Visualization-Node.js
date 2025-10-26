import resumoprojetoservice from './services/resumo-projeto-service.js'
import custosCargossEquipeService from './services/custos-cargoss-equipe-service.js';
import { DOMUtils } from './Config/dom-utils.js';

class PaginaEquipe {
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
        
        const containerProjetos = document.getElementById('tabela-projetos-corpo');
        if (!containerProjetos) return;

        const containerCategorias = document.getElementById('tabela-categorias-corpo');
        if (!containerCategorias) return;

        try {
            
            DOMUtils.showLoading(containerProjetos);
            DOMUtils.showLoading(containerCategorias);
            
            const projetos = await resumoprojetoservice.listarTodos();
            this.renderizarProjetos(containerProjetos, projetos);

            const categorias = await custosCargossEquipeService.listarTodos();
            this.renderizarCategorias(containerCategorias, categorias);
    
        } catch (error) {
            console.error(error)
            DOMUtils.showError(containerCategorias, 'Falha ao carregar os projetos');
        }

    }

    renderizarProjetos(container, projetos) {
        DOMUtils.clearElement(container);
        
        projetos.forEach((projeto) => {
            
            container.innerHTML += `
                <tr><td>${projeto.idProjeto} | ${projeto.nomeProjeto}</td><td>${projeto.custoEstimadoLaboral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td>${projeto.horasPlanejadas}H</td><td>${projeto.dataEntrega}</td><td>${projeto.dataInicio}</td></tr>
            `
        });
    }

    renderizarCategorias(container, categorias){

        DOMUtils.clearElement(container);
        
        categorias.forEach((categoria) => {
            
            container.innerHTML += `
                <tr><td>${categoria.categoria}</td><td>R$${categoria.custoHoraTrabalho}</td></tr>
            `
        });

    }

}

document.addEventListener('DOMContentLoaded', () => {
    new PaginaEquipe();
});