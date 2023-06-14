const multer = require("multer");
const path = require("path");
const fs = require('fs')

const uploadDirectory = path.join(__dirname, "../public/upload");
const imageDirectory = path.join(uploadDirectory, "images");
const pdfDirectory = path.join(uploadDirectory, "pdf");
const wordDirectory = path.join(uploadDirectory, "word");
const audioDirectory = path.join(uploadDirectory, "audio");
const otherDirectory = path.join(uploadDirectory, "other");

const diretorios = [uploadDirectory, imageDirectory, pdfDirectory, wordDirectory, audioDirectory, otherDirectory]

// Verifica se os diretórios existem e cria-os, se necessário
  fs.existsSync(uploadDirectory) || fs.mkdirSync(uploadDirectory);
  fs.existsSync(imageDirectory) || fs.mkdirSync(imageDirectory);
  fs.existsSync(pdfDirectory) || fs.mkdirSync(pdfDirectory);
  fs.existsSync(wordDirectory) || fs.mkdirSync(wordDirectory);
  fs.existsSync(audioDirectory) || fs.mkdirSync(audioDirectory);
  fs.existsSync(otherDirectory) || fs.mkdirSync(otherDirectory);




//SALVA OS ARQUIVOS NA PASTA UPLOADS DA PASTA PUBLIC COM BASE NO FORMATO DO ARQUIVO
// 
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let folder = "";

      // Verifica o tipo de arquivo e define a pasta de destino correspondente
      if (file.mimetype.startsWith("image/")) {
        folder = "images";
      } else if (file.mimetype === "application/pdf") {
        folder = "pdf";
      }else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.mimetype === "application/msword") {
        folder = "word";
      }else if (file.mimetype.startsWith("audio/")){
        folder = "audio";
      }
       else {
        folder = "other";
      }

      cb(null, path.join(uploadDirectory, folder));
    },
    filename: function (req, file, cb) {
      const time = Date.now();
      cb(null, `${time}_${file.originalname}`);
    },
  });

const upload = multer({ storage: storage });

//FUNÇÃO PARA LIMPAR OS ARQUIVOS DA PASTA UPLOADS DEPOIS DE 24H

    function limparPastaUpload(limite) {

      for(i=0; i < diretorios.length; i++){

        const diretorioUpload = path.join(diretorios[i]);

      fs.readdir(diretorioUpload, (err, files) => {
        if (err) {
          console.error("Erro ao ler o diretório de upload:", err);
          return;
        }

        const agora = Date.now();

        files.forEach((file) => {
          const caminhoArquivo = path.join(diretorioUpload, file);

          fs.stat(caminhoArquivo, (err, stats) => {
            if (err) {
              console.error("Erro ao obter informações do arquivo:", err);
              return;
            }

            const tempoCriacao = stats.birthtimeMs;
            const tempoDecorrido = agora - tempoCriacao;

            if (tempoDecorrido > limite) {
              fs.unlink(caminhoArquivo, (err) => {
                if (err) {
                  console.error("Erro ao excluir o arquivo:", err);
                  return;
                }
                console.log("Arquivo excluído:", caminhoArquivo);
              });
            }
          });
        });
      });
      }
      
    }

// Executa a limpeza da pasta upload a cada 24 horas (86400000 milissegundos)
    setInterval(() => {
      const limiteExclusao = 86400000; // 24 horas em milissegundos
      limparPastaUpload(limiteExclusao);
    }, 86400000);

//EXPORTA O MIDDLEWARE
  module.exports = upload;

  