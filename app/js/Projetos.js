import resumoProjetoService from './services/resumo-projeto-service.js';
import custoRealLaboralService from './services/custo-real-laboral-service.js';
import horasApontadasService from './services/horas-apontadas-service.js';
import horasExtrasService from './services/horas-extras-service.js';
import horasRetroativasService from './services/horas-retroativas-service.js';
import distribuicaoEsforcoService from './services/distribuicao-esforco-service.js';
import indicadoresJornadaService from './services/indicadores-jornada-service.js';
import { DOMUtils } from './Config/dom-utils.js';

class PaginaProjeto {
    constructor() {
        this.projetoSelecionadoId = null;
        this.chartInstance = null
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
    }

    bindEvents() {
        DOMUtils.bindButton('loadUsers', () => this.listarTodos());
        
        // Adicionar event listener para delegar clicks na lista de projetos
        const container = document.getElementById('listagem-projetos');
        if (container) {
            container.addEventListener('click', (event) => {
                const link = event.target.closest('a.nav-link');
                if (link) {
                    event.preventDefault();
                    const projetoId = link.id;
                    this.selecionarProjeto(projetoId);
                }
            });
        }
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
            this.renderizarProjetos(container, projetos);

            // Selecionar o primeiro projeto por padrão
            if (projetos.length > 0) {
                this.selecionarProjeto(projetos[0].idProjeto);
            }

        } catch (error) {
            console.error(error)
            DOMUtils.showError(container, 'Falha ao carregar os projetos');
        }
    }

    async selecionarProjeto(idProjeto) {
        this.projetoSelecionadoId = idProjeto;
        
        // Atualizar a UI para mostrar qual projeto está selecionado
        this.atualizarProjetoAtivo(idProjeto);
        
        // Carregar os dados do projeto selecionado
        await this.buscarProjetoNavs(idProjeto);
        await this.buscarProjetoGrafico(idProjeto);
        await this.buscarProjetoTabela(idProjeto)
    }

    atualizarProjetoAtivo(idProjetoAtivo) {
        const links = document.querySelectorAll('#listagem-projetos .nav-link');
        links.forEach(link => {
            if (link.id === idProjetoAtivo) {
                link.classList.add('active');
                link.setAttribute('aria-selected', 'true');
            } else {
                link.classList.remove('active');
                link.setAttribute('aria-selected', 'false');
            }
        });
    }

    async buscarProjetoNavs(idProjeto) {
        const containerCronograma = document.getElementById('resumo-cronograma');
        if (!containerCronograma) return;

        const containerControle = document.getElementById('controle-horas');
        if (!containerControle) return;

        try {
            
            DOMUtils.showLoading(containerCronograma);

            DOMUtils.showLoading(containerControle);

            const projeto = await resumoProjetoService.buscarProjeto(idProjeto);
            const custoRealLaboral = await custoRealLaboralService.buscarProjeto(idProjeto);

            const horasApontadas = await horasApontadasService.buscarProjeto(idProjeto);
            const horasExtras = await horasExtrasService.buscarProjeto(idProjeto);
            const horasRetroativs = await horasRetroativasService.buscarProjeto(idProjeto);

            this.renderizarProjetosCronograma(containerCronograma, projeto, custoRealLaboral);
            
            this.renderizarProjetosControleHoras(
                containerControle,
                horasApontadas.horasApontadas, 
                projeto.horasPlanejadas, 
                horasExtras.horasExtrasTotais, 
                horasRetroativs.horasRetroativas
            );
        
        } catch (error) {
            console.error(error)
            DOMUtils.showError(containerCronograma, 'Falha ao carregar projeto');
        }
    }

    renderizarProjetos(container, projetos) {
        DOMUtils.clearElement(container);
        
        if (!projetos || projetos.length === 0) {
            container.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link active ps-0" id="home-tab" data-bs-toggle="tab" href="#overview" role="tab" aria-controls="overview" aria-selected="true">
                        Nenhum projeto encontrado
                    </a>
                </li>
            `;
            return;
        }
        
        projetos.forEach((projeto, index) => {
            const projetoElement = DOMUtils.createElement('li', 'nav-item');
            const isActive = index === 0 ? 'active' : '';
            const isSelected = index === 0 ? 'true' : 'false';
            
            projetoElement.innerHTML = `
                <a class="nav-link ${isActive} ps-0" id="${projeto.idProjeto}" data-bs-toggle="tab" href="#overview" role="tab" aria-controls="overview" aria-selected="${isSelected}">
                    ${projeto.nome || projeto.idProjeto}
                </a>
            `;
            container.appendChild(projetoElement);
        });
    }

    renderizarProjetosCronograma(container, projeto, custoRealLaboral) {

        DOMUtils.clearElement(container);
        
        if (projeto == null) {
            container.innerHTML = `
                <div class="d-none d-md-block">
                    <p class="statistics-title">Falha ao carregar as informações do projeto</p>
                </div>
            `;
            return;
        }
        
        const tituloElement = DOMUtils.createElement('div');
        tituloElement.innerHTML = `
            <h4 class="card-title card-title-dash" style="margin-bottom: 1rem;">Resumo Financeiro e Cronograma</h4>
        `;
        container.appendChild(tituloElement);

        let DiasParaEntrega = Math.round(projeto.horasPlanejadas/8);
        
        // Verificar se custoRealLaboral tem dados
        const custoReal = custoRealLaboral && custoRealLaboral.length > 0 
            ? custoRealLaboral[0].custoRealLaboral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : 'R$ 0,00';

        const projetoElement = DOMUtils.createElement('div', 'statistics-details d-flex justify-content-evenly');
        projetoElement.innerHTML = `
            <div class="d-none d-md-block">
                <p class="statistics-title">Inicio</p>
                <h3 class="rate-percentage">${projeto.dataInicio}</h3>
            </div>
            
            <div>
                <p class="statistics-title"> Prazo de Entrega</p>
                <h3 class="rate-percentage">${DiasParaEntrega} Dias de Trabalho</h3>
            </div>
            
            <div>
                <p class="statistics-title">Custo Estimado Laboral</p>
                <h3 class="rate-percentage">${projeto.custoEstimadoLaboral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
            </div>
            
            <div>
                <p class="statistics-title">Custo Real Laboral</p>
                <h3 class="rate-percentage">${custoReal}</h3>
            </div>
        `;
        container.appendChild(projetoElement);
    }

    renderizarProjetosControleHoras(container, horasApontadas, horasPlanejadas, horasExtras, horasRetroativas) {

        DOMUtils.clearElement(container);
        
        const Box = DOMUtils.createElement('div','tab-pane fade show active');

        Box.id = 'overview';
        Box.role = 'tabpanel';
        // Box.aria-labelledby ; 'overview'

        container.appendChild(Box)

        if (horasApontadas == null) {
            Box.innerHTML = `
                <div class="d-none d-md-block">
                    <p class="statistics-title">Falha ao carregar as informações do projeto</p>
                </div>
            `;
            return;
        }
        
        const tituloElement = DOMUtils.createElement('div');
        tituloElement.innerHTML = `
            <h4 class="card-title card-title-dash" style="margin-bottom: 1rem;">
                Controle de Horas
            </h4>
        `;
        Box.appendChild(tituloElement);

        const projetoElement = DOMUtils.createElement('div', 'statistics-details d-flex justify-content-evenly');
        projetoElement.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <p class="statistics-title">
                    Horas Planejadas
                </p>
                <h3 class="rate-percentage">
                    ${horasPlanejadas} Horas
                </h3>
            </div>
            <div style="margin-bottom: 1rem;">
                <p class="statistics-title">
                    Horas Apontadas
                </p>
                <h3 class="rate-percentage">
                    ${horasApontadas} Horas
                </h3>
            </div>                      
            <div style="margin-bottom: 1rem;">
                <p class="statistics-title">
                    Horas Extras Totais
                </p>
                <h3 class="rate-percentage">
                    ${horasExtras} Horas
                </h3>
            </div>
            <div>
                <p class="statistics-title">
                    Horas Retroativas
                </p>
                <h3 class="rate-percentage">
                    ${horasRetroativas}
                </h3>
            </div>
        `;
        Box.appendChild(projetoElement);
    }

    async buscarProjetoGrafico(idProjeto){
        
        const data = await distribuicaoEsforcoService.buscarProjeto(idProjeto)

        let labels = []

        let dados = []        
        
        let valorMáximo = 0
        
        data.forEach((dado) => {
            labels.push(dado.nomeColaborador)
            dados.push(dado.percentualEsforco)

            if(dado.percentualEsforco > valorMáximo){
                valorMáximo = dado.percentualEsforco
            }

        })

        const marketingOverviewCanvas = document.getElementById('marketingOverview');

        if(this.chartInstance){
            this.chartInstance.destroy()
        }

        this.chartInstance = new Chart(marketingOverviewCanvas, {
            type: 'bar',
            data: {
            labels: labels,
            datasets: [{
                label: 'Distribuição de Esforço',
                data: dados,
                backgroundColor: "#C0C0C0",
                borderWidth: 0,
                barPercentage: 0.5,
                borderRadius: 4
            }]
            },
            options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                border: {
                    display: false
                },
                grid: {
                    display: true,
                    color:"#F0F0F0",
                },
                ticks: {
                    beginAtZero: true,
                    callback: function(value) {
                    return value + '%';
                    },
                    color:"#6B778C",
                    font: {
                    size: 10,
                    }
                },
                max: valorMáximo
                },
                y: {
                border: {
                    display: false
                },
                grid: {
                    display: false,
                },
                ticks: {
                    color:"#6B778C",
                    font: {
                    size: 12,
                    weight: 'bold'
                    }
                }
                }
            },
            plugins: {
                legend: {
                display: false 
                },
                tooltip: {
                callbacks: {
                    label: function(context) {
                    return context.raw + '%';
                    }
                }
                }
            }
            }
        });

    }

    async buscarProjetoTabela(idProjeto){
        
        const data = await indicadoresJornadaService.buscarProjeto(idProjeto)

        const tabela = document.getElementById('indicadores-jornada-tabela')

        tabela.innerHTML = ''

        data.forEach((registro) => {

            tabela.innerHTML += `
                <tr>
                    <td>${registro.nomeColaborador}</td>
                    <td>${registro.indiceCumprimento ?? 0}%</td>
                    <td>${registro.indiceExcedente ?? 0}%</td>
                    <td>${registro.taxaErroApontamento ?? 0}%</td>
                </tr>
            `

        })

    }

}

document.addEventListener('DOMContentLoaded', () => {
    new PaginaProjeto();
});