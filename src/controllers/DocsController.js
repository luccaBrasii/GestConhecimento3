//CARREGANDO SCHEMA
    const Documentos = require('../models/Documentos')
    const Postagens = require('../models/Postagens')
    const DocsExcluidos = require('../models/DocsExcluidos')
//MODULOS
    const fs = require('fs')
    const path = require("path");
    const PDFParser = require('pdf-parse');
    
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

              const img = fs.readFileSync(filePath);
              PDFParser(img).then(data => {
                const textoPDF = data.text;
              
                // Cria um novo documento com o texto extraído do PDF
                const novoDocumento = new Documentos({
                  nome: name,
                  tipo: tipo,
                  dados: img,
                  texto: textoPDF.trim()
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

  
            } else if (
              fileExtension === '.jpg' ||
              fileExtension === '.jpeg' ||
              fileExtension === '.png' ||
              fileExtension === '.jfif' 
            ) {
              filePath = path.join(__dirname, '../public/upload/images', name);
              tipo = 'img';
            }else if (
              fileExtension === '.xls' ||
              fileExtension === '.xlsx' ||
              fileExtension === '.csv'
            ) {
              filePath = path.join(__dirname, '../public/upload/excel', name);
              tipo = 'excel';
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
            }else if (
              fileExtension === '.txt'
            ) {
              filePath = path.join(__dirname, '../public/upload/text', name);
              tipo = 'texto';
            }else if (
              fileExtension === '.mp4' ||
              fileExtension === '.avi' ||
              fileExtension === '.mkv'
            ) {
              filePath = path.join(__dirname, '../public/upload/videos', name);
              tipo = 'video';
            }else if (fileExtension === '.zip') {
              filePath = path.join(__dirname, '../public/upload/zip', name);
              tipo = 'zip';
            }            
            else {
              filePath = path.join(__dirname, '../public/upload/other', name);
              tipo = 'outros';
            }
            
            const img = fs.readFileSync(filePath);
            
              
            
              // Cria um novo documento com o texto extraído do PDF
              const novoDocumento = new Documentos({
                nome: name,
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
          
        })}

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
    
    //DELETAR OS DOCUMENTOS 
      static async remanejaDoc(parametros){
            Documentos.findOneAndDelete({ _id: parametros}).then(async (documento)=>{
              if (documento) {
                const idRemover = documento._id;
          
                
                  const novoDocumento = new DocsExcluidos({
                    nome: documento.nome,
                    tipo: documento.tipo,
                    dados: documento.dados,
                  });
          
                  await novoDocumento.save()
                    
                  console.log('DOC REMANEJADO COM SUCESSO');

                  await Postagens.updateMany(
                        { img: idRemover },
                        { $pull: { img: idRemover } }
                      )

            }else {
              console.log('Documento não encontrado na coleção de origem');
            }
        })

      }

    //ROTA DOWNLOAD EXCEL
      static async downloadEXCEL(req,res){
            try {
              const id = req.params.id;
              const documento = await Documentos.findById(id);
            
              if (!documento) {
                return res.status(404).send('Documento não encontrado');
              }
            
              const fileData = documento.dados;
            
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', `attachment; filename="${documento.nome}"`);
              res.send(fileData);
            } catch (err) {
              console.error(err);
              res.status(500).send('Erro ao baixar o arquivo');
            }
            
      }
    //ROTA DOWNLOAD TXT
      static async downloadTXT(req, res) {
        try {
          const id = req.params.id;
          const documento = await Documentos.findById(id);
      
          if (!documento) {
            return res.status(404).send('Documento não encontrado');
          }
      
          const fileData = documento.dados;
      
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('Content-Disposition', `attachment; filename="${documento.nome}"`);
          res.send(fileData);
        } catch (err) {
          console.error(err);
          res.status(500).send('Erro ao baixar o arquivo');
        }
      }
    //RENDERIZAR VIDEOS
    static async renderizaVideo(req, res) {
      const videoID = req.params.id;
    
      Documentos.findById(videoID, (err, documento) => {
        if (err) {
          console.error('Erro ao buscar o vídeo:', err);
          res.status(500).send('Erro ao buscar o vídeo');
        } else if (!documento) {
          res.status(404).send('Vídeo não encontrado');
        } else {
          res.set('Content-Type', 'video/mp4');
          res.send(documento.dados);
        }
      });
    }
    
    //DOWNLOAD VIDEOS
    static async downloadVideo(req, res) {
      try {
        const videoID = req.params.id;
        const documento = await Documentos.findById(videoID);
      
        if (!documento) {
          return res.status(404).send('Vídeo não encontrado');
        }
      
        const fileData = documento.dados;
      
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${documento.nome}.mp4"`);
        res.send(fileData);
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao baixar o vídeo');
      }
    }

    //DOWNLOADS .ZIP
    static async downloadZIP(req, res) {
      try {
        const videoID = req.params.id;
        const documento = await Documentos.findById(videoID);
    
        if (!documento) {
          return res.status(404).send('Vídeo não encontrado');
        }
    
        const fileData = documento.dados;
    
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${documento.nome}.zip"`);
        res.send(fileData);
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao baixar o vídeo');
      }
    }
    
    static async buscaPalavra(req,res){

      const suaPalavra = req.body.pesquisa;

  try {
    const documentosEncontrados = await Documentos.find({ texto: { $regex: '\\b' + suaPalavra + '\\b', $options: 'i' } });

    if (documentosEncontrados.length > 0) {
      const nomes = documentosEncontrados.map(documento => documento.nome);
      const ids = documentosEncontrados.map(documento => documento.id);

      console.log(`A palavra "${suaPalavra}" foi encontrada em ${documentosEncontrados.length} documentos.`);
      res.json({nomes: nomes, ids: ids}); // Envia o array de nomes como resposta JSON
    } else {
      console.log(`A palavra "${suaPalavra}" não foi encontrada em nenhum documento.`);
      res.send('Documentos não encontrados');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno do servidor');
  }
      

    }
    
}
    
    


module.exports = DocsController

