//CARREGANDO SCHEMA
    const Imagem = require('../models/Imagem')
//MODULOS
    const fs = require('fs')
    
class ImagemController{

    //SALVA A IMAGEM NO BANCO DE DADOS
        static async Salve(name) {
            return new Promise((resolve, reject) => {
                const img = fs.readFileSync('./src/public/upload/' + name);
                const novaImagem = new Imagem({ dados: img });
        
                novaImagem.save().then((img) => {
                    resolve(img.id); // Resolve a Promise com o ID da imagem
                }).catch((err) => {
                    console.log('erro: ' + err);
                    reject(err); // Rejeita a Promise em caso de erro
                });
            });
        }

    //ROTA API QUE MOSTRA A IMAGEM COM BASE NO ID
        static async renderizaIMG(req, res) {
            const imagemId = req.params.id;
          
            Imagem.findById(imagemId, (err, imagem) => {
              if (err) {
                console.error('Erro ao buscar a imagem:', err);
                res.status(500).send('Erro ao buscar a imagem');
              } else if (!imagem) {
                res.status(404).send('Imagem não encontrada');
              } else {
                res.set('Content-Type', 'image/jpeg'); // Defina o tipo de conteúdo adequado para a imagem (exemplo: image/jpeg)
                res.send(imagem.dados);
              }
            });
          }
}
    
    


module.exports = ImagemController