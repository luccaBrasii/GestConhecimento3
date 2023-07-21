const output = document.querySelector('.outputPesquisa')


//Função para desativar as textareas ocultas no front
    function desativaTextarea(conteudo){
        conteudo.forEach(textarea => {
            textarea.disabled = true;
        });
    }

//FUNÇÃO QUE RENDERIZA PARA O CLIENTE OS DOCUMENTOS ENCONTRADOS PELA PESQUISA AFUNDO
    function innerOutput(nomes, ids){
        output.innerHTML = `<h5 class="card-text text-warning bg-dark">PALAVRA ENCONTRADA NESTES DOCUMENTOS:</h5>`
        for (let i = 0; i < nomes.length; i++) {
            let arquivo;
            let link;
            let download;

            if(nomes[i].split('.')[1] == 'docx'){
                arquivo = 'word.png'
                link = '/download/'
                download = 'DOWNLOAD'
            }
            else if(nomes[i].split('.')[1] == 'pdf'){
                arquivo = 'pdf.png'
                link = '/pdf/'
                download = 'VER PDF'
            }else if(nomes[i].split('.')[1] == 'txt'){
                arquivo = 'note.png'
                link = '/download/txt/'
                download = 'DOWNLOAD TXT'
            }
            
            output.innerHTML +=
            `
                <div style=display:flex;>
                <div class="card"  style="width: 18rem, justify-content: space-around">
                    <img src="/public/img/icons/${arquivo}" class="card-img-top" style=width:50px; alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${nomes[i].split('_')[1]}</h5>
                        <p class="card-text text-warning bg-dark">PALAVRA ENCONTRADA NESTE DOCUMENTO...</p>
                        <a href="${link}${ids[i]}" class="btn btn-primary">${download}</a>
                    </div>
                </div>
                </div>
            `
            
        }
    }

//Função auxiliar para remover acentos e espaços do texto..
    function removerAcentos(texto) {
    return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s/g, '');
    }

//Busca os elementos pelo DOM, e revela ou oculta de acordo com a pesquisa...
    function buscaElementos(valor, elementos, conteudo = false) {
        
        var funcaoBusca;

        //Se o conteudo for true, quer dizer que é pra buscar em todas as palavras do elemento e não só se a frase começa com o valor
        if (conteudo) {
            funcaoBusca = (elementoTexto, valor) => elementoTexto.includes(valor);
        } else {
            funcaoBusca = (elementoTexto, valor) => elementoTexto.startsWith(valor);
        }


        for (let i = 0; i < elementos.length; i++) {
            const elementoTexto = removerAcentos(elementos[i].textContent.toLowerCase());

            if (!funcaoBusca(elementoTexto, valor)) {
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
                if(elementos[i].className === 'conteudo'){
                    let alertaUser = document.querySelectorAll('.alertaUser')
                    for(let i = 0; alertaUser.length > i; i++){
                        alertaUser[i].innerHTML = `<p style=color:red;>PALAVRA ENCONTRADA DENTRO DO CONTEUDO DESSA POSTAGEM</p>`
                    }
                }
            }
        }

    }

//FUNÇÃO PARA RESETAR O VISUAL DO USUARIO, REVELA AS DIVS OCULTADAS E RETIRA A COR VERMELHA DAS PALAVRAS ENCONTRADAS
    function resetFront(...divs){
        divs.forEach(elementos => {
            // Para remover a cor vermelha dos títulos que não correspondem à pesquisa
            for (let i = 0; i < elementos.length; i++) {
                if (elementos[i].style.color === 'red' ) {
                    elementos[i].style.color = ''; // Redefine a cor do texto para o valor padrão
                }
                if(elementos[i].className === 'conteudo'){
                    let alertaUser = document.querySelectorAll('.alertaUser')
                    for(let i = 0; alertaUser.length > i; i++){
                        alertaUser[i].innerHTML = ''
                    }
                }
                //tira o display none de todos as divs de pesquisa
                elementos[i].parentNode.parentNode.style.display = ''
            }
            //Tira os documentos revelados da tela
            output.innerHTML = ''
        })
        
    }
    

//BUSCA OS DOCUMENTOS PDF/WORD QUE CONTEM ESSA PALAVRA EM SEU TEXTO..
    async function buscaPalavra(valor){
        await fetch('/teste', {
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
        
        
        if(json.erro){
            output.innerHTML = `<h5>${json.erro}</h5>`
            return
        }else{
            const nomes = json.nomes
            const ids = json.ids;
            innerOutput(nomes, ids)
            return
        }
        
    })
    }

export default {
    desativaTextarea,
    innerOutput,
    removerAcentos,
    buscaElementos,
    buscaPalavra,
    resetFront
}