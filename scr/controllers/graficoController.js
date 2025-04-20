const graficoService = require('../services/graficoService');

exports.getDadosGrafico = async (req, res) => {
  try {
    const dados = await graficoService.buscarDados();
    res.json(dados);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
