const input = document.querySelector('#pesquisa')
const output = document.querySelector('.outputPesquisa')
const botao = document.querySelector('.pesquisaProfunda')
const titulos = document.querySelectorAll('.titulo')
const descricao = document.querySelectorAll('.descricao')
const autor = document.querySelectorAll('.autor')


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
            let arquivo;
            let link;
            let download;
            if(nomes[i].split('.')[1] == 'docx'){
                arquivo = 'word.png'
                link = '/download/'
                download = 'DOWNLOAD'
            }else if(nomes[i].split('.')[1] == 'pdf'){
                arquivo = 'pdf.png'
                link = '/pdf/'
                download = 'VER PDF'
            }

            output.innerHTML +=`
            <div style=display:flex;>
            <div class="card"  style="width: 18rem, justify-content: space-around">
                <img src="../public/img/icons/${arquivo}" class="card-img-top" style=width:50px; alt="...">
                <div class="card-body">
                    <h5 class="card-title">${nomes[i].split('_')[1]}</h5>
                    <p class="card-text text-warning bg-dark">PALAVRA ENCONTRADA NESTE DOCUMENTO...</p>
                    <a href="${link}${ids[i]}" class="btn btn-primary">${download}</a>
                </div>
            </div>
            </div>
            
            `
            
        }

        
    })
    }

//PESQUISA SIMPLES
    input.addEventListener('keyup', ()=>{
        const valor = removerAcentos(input.value.toLowerCase());
        
        buscaElementos(valor, titulos)
        buscaElementos(valor, descricao)
        buscaElementos(valor, autor)
              
    })

function removerAcentos(texto) {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s/g, '');
  }

function buscaElementos(valor, elementos) {
    for (let i = 0; i < elementos.length; i++) {
        const elementoTexto = removerAcentos(elementos[i].textContent.toLowerCase());

        //INVES DE STARTSWITH pode sem 'Includes()' para ver se a str contém a palvra
        if (!elementoTexto.startsWith(valor)) {
            const divPai = elementos[i].parentNode.parentNode; // Acessa o elemento pai da div com classe "card mt-4"

            if(divPai.style.display == ''){     
                divPai.style.display = 'none'
            }
           
        } else {
            elementos[i].style.color = 'red';
            const divPai = elementos[i].parentNode.parentNode; 
            
            if(divPai.style.display == '' || divPai.style.display == 'none'){
                divPai.style.display = 'block'
            }
            
        }
    }

    if (valor.length === 0) {
        // Para remover a cor vermelha dos títulos que não correspondem à pesquisa
        for (let i = 0; i < elementos.length; i++) {
            if (elementos[i].style.color === 'red' ) {
                elementos[i].style.color = ''; // Redefine a cor do texto para o valor padrão
            }
            elementos[i].parentNode.parentNode.style.display = ''
        }
    }
}