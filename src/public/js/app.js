async function carregarDados() {
  try {
    // Troque pela sua API real
    const resposta = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const dados = await resposta.json();

    document.getElementById("dados").innerHTML = 
      `<pre>${JSON.stringify(dados, null, 2)}</pre>`;
  } catch (erro) {
    document.getElementById("dados").innerHTML = "Erro ao carregar API";
    console.error("Erro:", erro);
  }
}

carregarDados();
