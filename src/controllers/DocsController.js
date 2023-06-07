//CARREGANDO SCHEMA
    const Imagem = require('../models/Imagem')
//MODULOS
    const fs = require('fs')
    const path = require("path");
    
class DocsController{

    //SALVA O DOCUMENTO NO BANCO DE DADOS

        static async Salve(name) {
          return new Promise((resolve, reject) => {
            const fileExtension = path.extname(name).toLowerCase();
            let filePath = '';
            let tipo = '';
            if (fileExtension === '.pdf') {
              filePath = path.join(__dirname, '../public/upload/pdf', name);
              tipo = 'pdf';
            } else if (
              fileExtension === '.jpg' ||
              fileExtension === '.jpeg' ||
              fileExtension === '.png' ||
              fileExtension === '.jfif' 
            ) {
              filePath = path.join(__dirname, '../public/upload/images', name);
              tipo = 'img';
            } else {
              filePath = path.join(__dirname, '../public/upload/other', name);
              tipo = 'outros';
            }
            
            const img = fs.readFileSync(filePath);
            const novaImagem = new Imagem({ tipo: tipo, dados: img });
        
            novaImagem
              .save()
              .then((img) => {
                resolve(img.id); // Resolve a Promise com o ID da imagem
              })
              .catch((err) => {
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
                res.set('Content-Type', 'image/jpeg');
                res.send(imagem.dados);
              }
            });
          }

    //RENDERIZA O PDF 
      static async renderizaPDF(req, res) {
        const imagemId = req.params.id;
      
        Imagem.findById(imagemId, (err, imagem) => {
          if (err) {
            console.error('Erro ao buscar a imagem:', err);
            res.status(500).send('Erro ao buscar a imagem');
          } else if (!imagem) {
            res.status(404).send('Imagem não encontrada');
          } else {
            res.set('Content-Type', 'application/pdf');
            res.send(imagem.dados);
          }
        });
      }
}
    
    


module.exports = DocsController