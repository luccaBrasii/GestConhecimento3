//CARREGANDO SCHEMA
    const Documentos = require('../models/Documentos')
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
          //Verifica o tipo de arquivo e busca na pasta especifica
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
            }else if (
              fileExtension === '.doc' ||
              fileExtension === '.docx'
            ) {
              filePath = path.join(__dirname, '../public/upload/word', name);
              tipo = 'word';
            }else if (
              fileExtension === '.mp3' ||
              fileExtension === '.wav' ||
              fileExtension === '.ogg'
            ){
              filePath = path.join(__dirname, '../public/upload/audio', name);
              tipo = 'audio';
            }else {
              filePath = path.join(__dirname, '../public/upload/other', name);
              tipo = 'outros';
            }
            
            const img = fs.readFileSync(filePath);
            const novoDocumento = new Documentos({
              nome:name,
              tipo: tipo,
              dados: img 
            });
        
            novoDocumento
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
            const DocID = req.params.id;
          
            Documentos.findById(DocID, (err, imagem) => {
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
          const DocID = req.params.id;
        
          Documentos.findById(DocID, (err, documento) => {
            if (err) {
              console.error('Erro ao buscar a imagem:', err);
              res.status(500).send('Erro ao buscar a imagem');
            } else if (!documento) {
              res.status(404).send('Imagem não encontrada');
            } else {
              res.set('Content-Type', 'application/pdf');
              res.send(documento.dados);
            }
          });
        }

    //ROTA DE DOWNLOAD PARA DOCUMENTOS TIPO WORD OUTROS ARQUIVOS
        static async downloadDOCX(req, res){
          
          try {
            const id = req.params.id;
            const documento = await Documentos.findById(id); // Consulta o documento pelo ID
        
            if (!documento) {
              return res.status(404).send('Documento não encontrado');
            }
        
            const fileData = documento.dados; // Obtem os dados BinData do documento
        
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="${documento.nome}.docx"`);
            res.send(fileData); // Envia os dados do arquivo como resposta
          } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao baixar o arquivo');
          }
        }

    //RENDERIZA AUDIO
      static async renderizaAudio(req, res) {
        const audioID = req.params.id;
      
        Documentos.findById(audioID, (err, documento) => {
          if (err) {
            console.error('Erro ao buscar o áudio:', err);
            res.status(500).send('Erro ao buscar o áudio');
          } else if (!documento) {
            res.status(404).send('Áudio não encontrado');
          } else {
            res.set('Content-Type', 'audio/mp3');
            res.send(documento.dados);
          }
        });
        }

      static async deleteDoc(req,res){
        await Documentos.findOneAndRemove({ _id: req.params.id }).then(() => {
          req.flash("success_msg", "Post apagado com sucesso!");
          res.redirect('/')
          }).catch((err)=>{
            console.log('ERRO: '+ err);
          })
        }


}
    
    


module.exports = DocsController

