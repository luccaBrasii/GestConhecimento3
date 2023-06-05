//Função para validar

/*Validação: Recebe 4 parametros (exatamente nessa ordem): 1º: 'res', 2º: O arquivo 'handlebars' a ser renderizado,
3º: O req.body que será validado, e 4º: um 'nome' para exibir para o usuario caso a validação falhe ex: 'nome incompleto'*/
    function verificarParametros(res, handlebar, ...args) {
        let erros = [];

        for (let i = 0; i < args.length; i += 2) {
            const parametro = args[i];
            const nomeParametro = args[i + 1];
        
            if (!parametro || typeof parametro === 'undefined' || parametro === null) {
                erros.push({ texto: `${nomeParametro} inválido!` });
            }if(parametro.length <= 2){
                erros.push({texto:`${nomeParametro} muito curto!`})
            }
        }

        if (erros.length > 0) {
            res.render(`${handlebar}`, { erros: erros });
            return false;
        }else
            return true; 
    }

module.exports = verificarParametros