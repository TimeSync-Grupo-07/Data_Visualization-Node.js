import { DOMUtils } from './Config/dom-utils.js';
import indicadoresJornadaService from './services/indicadores-jornada-service.js';
import loginService from './services/login-service.js';
import informacoesCalculoService from './services/informacoes-calculo-service.js';

class PaginaColaboradores {
    constructor() {
        this.init();
        this.registrarEventos();
    }

    init() {
        this.listarTodos();
    }

    registrarEventos() {
        
        const tabs = document.querySelectorAll('.nav-link[data-id]');

        tabs.forEach(tab => {
            tab.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                this.carregarInfo(id);
            });
        });
    
    }

    async listarTodos() {
        
        try {
            const colaboradores = await loginService.listarUsuarios();
            
            console.log('Colaboradores:', colaboradores);

            this.carregarInfo(colaboradores[0].matricula);

            this.renderizarColaboradores(colaboradores);

        }catch (error) {
            console.error('Erro ao listar colaboradores:', error);
        }

    }

    async carregarInfo(matricula){

        try {
            
            const dadosColaborador = await indicadoresJornadaService.buscarPorColaborador(matricula);
            
            this.renderizarProjetosColaborador(dadosColaborador);

            const infoCalculo = await informacoesCalculoService.buscarPorColaborador(matricula);

            this.renderizarInfoCalculoColaborador(infoCalculo);

        }catch (error) {
            console.error('Erro ao carregar informações do colaborador:', error);
        }

    }

    async renderizarColaboradores(colaboradores){

        console.log('Renderizando colaboradores:', colaboradores);

        const container = DOMUtils.getById('colaboradores');
        container.innerHTML = '';

        colaboradores.forEach(colaborador => {

            const li = document.createElement('li');
            li.classList.add('nav-item');
            
            const a = document.createElement('a');
            a.classList.add('nav-link');
            a.classList.add('ps-0');
            a.classList.add('active');
            a.setAttribute('data-bs-toggle', 'tab');
            a.setAttribute('href', '#overview');
            a.setAttribute('role', 'tab');
            a.setAttribute('aria-controls', 'overview');
            a.setAttribute('aria-selected', 'true');
            a.textContent = colaborador.nomeUsuario;
            a.setAttribute('data-id', `${colaborador.matricula}`);
            li.appendChild(a);
            container.appendChild(li);
        })

    }

    async renderizarProjetosColaborador(projetos){
    
        const tabela = DOMUtils.getById('tabela-projetos-colaborador');

        tabela.innerHTML = '';

        projetos.forEach(projeto => {
            const tr = document.createElement('tr');

            const tdNomeProjeto = document.createElement('td');
            
            tdNomeProjeto.textContent = projeto.projeto;
            tr.appendChild(tdNomeProjeto);

            const tdHorasPlanejadas = document.createElement('td');
            tdHorasPlanejadas.textContent = projeto.horasPlanejadas;
            tr.appendChild(tdHorasPlanejadas);

            const tdHorasApontadas = document.createElement('td');
            tdHorasApontadas.textContent = projeto.horasApontadas;
            tr.appendChild(tdHorasApontadas);

            const tdHorasExtras = document.createElement('td');
            tdHorasExtras.textContent = projeto.horasExtras;
            tr.appendChild(tdHorasExtras);

            const tdErrosApontamento = document.createElement('td');
            tdErrosApontamento.textContent = projeto.taxaErroApontamento;
            tr.appendChild(tdErrosApontamento);
            
            tabela.appendChild(tr);
        });
    
    }

    async renderizarInfoCalculoColaborador(infoCalculo){

        try {
            const container = DOMUtils.getById('informacoes-calculo');
            container.innerHTML = '';

            const divValorHora = document.createElement('div');
            divValorHora.classList.add('d-none');
            divValorHora.classList.add('d-md-block');

            const pValorHora = document.createElement('p');
            pValorHora.classList.add('statistics-title');
            pValorHora.textContent = 'R$ por Hora';
            divValorHora.appendChild(pValorHora);

            const h3ValorHora = document.createElement('h3');
            h3ValorHora.classList.add('rate-percentage');
            h3ValorHora.textContent = `R$ ${infoCalculo.valorHoraColaborador.toFixed(2)}`;
            divValorHora.appendChild(h3ValorHora);

            const divHorasTotais = document.createElement('div');
            const pHorasTotais = document.createElement('p');
            pHorasTotais.classList.add('statistics-title');
            pHorasTotais.textContent = 'Horas Totais';
            divHorasTotais.appendChild(pHorasTotais);

            const h3HorasTotais = document.createElement('h3');
            h3HorasTotais.classList.add('rate-percentage');
            h3HorasTotais.textContent = `${infoCalculo.horasPlanejadasTotais} Horas`;
            divHorasTotais.appendChild(h3HorasTotais);

            const divHorasApontadas = document.createElement('div');
            const pHorasApontadas = document.createElement('p');
            pHorasApontadas.classList.add('statistics-title');
            pHorasApontadas.textContent = 'Horas Apontadas';
            divHorasApontadas.appendChild(pHorasApontadas);

            const h3HorasApontadas = document.createElement('h3');
            h3HorasApontadas.classList.add('rate-percentage');
            h3HorasApontadas.textContent = `${infoCalculo.horasApontadasTotais} Horas`;
            divHorasApontadas.appendChild(h3HorasApontadas);

            container.appendChild(divValorHora);
            container.appendChild(divHorasTotais);
            container.appendChild(divHorasApontadas);

        }catch (error) {
            console.error('Erro ao renderizar informações de cálculo do colaborador:', error);
        }
    
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new PaginaColaboradores();
});