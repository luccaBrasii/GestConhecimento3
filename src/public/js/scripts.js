const input = document.querySelector('#pesquisa')
const output = document.querySelector('.outputPesquisa')
const botao = document.querySelector('.pesquisaProfunda')
const titulos = document.querySelectorAll('.titulo')
const categoria = document.querySelectorAll('.categoria')

//BUSCA AFUNDO
    botao.addEventListener('click',async ()=>{
        var valor = input.value
        
        await buscaPalavra(valor)
        
    })

//BUSCA OS DOCUMENTOS PDF QUE CONTEM ESSA PALAVRA EM SEU TEXTO..
    async function buscaPalavra(valor){
    await fetch('http://localhost:3000/teste', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pesquisa: valor
      })
})
    .then(response => response.json())
    .then(function (json) {

        const nomes = json.nomes
        const ids = json.ids;
        output.innerHTML = `<h5 class="card-text text-warning bg-dark">PALAVRA ENCONTRADA NESTES DOCUMENTOS:</h5>`

        for (let i = 0; i < nomes.length; i++) {
            output.innerHTML +=`
            <div style=display:flex;>
            <div class="card"  style="width: 18rem, justify-content: space-around">
                <img src="../public/img/icons/pdf.png" class="card-img-top" style=width:50px; alt="...">
                <div class="card-body">
                    <h5 class="card-title">${nomes[i].split('_')[1]}</h5>
                    <p class="card-text text-warning bg-dark">PALAVRA ENCONTRADA NESTE DOCUMENTO...</p>
                    <a href="/pdf/${ids[i]}" class="btn btn-primary">VER PDF</a>
                </div>
            </div>
            </div>
            
            `
        }

        
    })
    }

//PESQUISA SIMPLES
    input.addEventListener('keyup', ()=>{
        
        buscaTitulo(titulos)
        
        
    })

function removerAcentos(texto) {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

function buscaTitulo(titulos){
    var valor = removerAcentos(input.value.toLowerCase());

        
        for (let i = 0; i < titulos.length; i++) {
            const tituloTexto = removerAcentos(titulos[i].textContent.toLowerCase());
        
            if (!tituloTexto.startsWith(valor)) {
            
            const divPai = titulos[i].parentNode.parentNode; // Acessa o elemento pai da div com classe "card mt-4"
            divPai.style.display = 'none'; // Oculta a div inteira
            
            } else {
            titulos[i].style.color = 'red'
            const divPai = titulos[i].parentNode.parentNode; // Acessa o elemento pai da div com classe "card mt-4"
            divPai.style.display = 'block'; // Exibe a div inteira
            }
        }

        if(valor.length == 0){
            // Para remover a cor vermelha dos títulos que não correspondem à pesquisa
            for (let i = 0; i < titulos.length; i++) {
                if (titulos[i].style.color === 'red' && titulos[i].textContent.toLowerCase().startsWith(valor)) {
                titulos[i].style.color = ''; // Redefine a cor do texto para o valor padrão
                }
            }
        }
}