//IMPORTA AS FUNÇÕES AUXILIARES
    import helpers from "./helpers.js";

//DECLARAÇÃO DE VARIAVEIS
    const input = document.querySelector('.pesquisa');
    const botao = document.querySelector('.pesquisaProfunda')
    const titulos = document.querySelectorAll('.titulo')
    const descricao = document.querySelectorAll('.descricao')
    const autor = document.querySelectorAll('.autor')
    const conteudo = document.querySelectorAll('.conteudo')


//DESATIVA AS TEXTAREAS..
    helpers.desativaTextarea(conteudo)

//BUSCA AFUNDO
    botao.addEventListener('click',async ()=>{
        var valor = input.value
        await helpers.buscaPalavra(valor)
    })





//PESQUISA SIMPLES
    input.addEventListener('keyup', ()=>{
        const valor = helpers.removerAcentos(input.value.toLowerCase());
        
        helpers.buscaElementos(valor, titulos)
        helpers.buscaElementos(valor, descricao)
        helpers.buscaElementos(valor, autor)
        helpers.buscaElementos(valor, conteudo)
    })