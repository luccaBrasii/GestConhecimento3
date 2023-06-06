const multer = require("multer");
const path = require("path");
const fs = require('fs')

//SALVA OS ARQUIVOS NA PASTA UPLOADS DA PASTA PUBLIC
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/upload'));
      },
      filename: function (req, file, cb) {
        const time = Date.now()
        cb(null, `${time}_${path.extname(file.originalname)}`);
      },
    });

    const upload = multer({ storage: storage });

//FUNÇÃO PARA LIMPAR OS ARQUIVOS DA PASTA UPLOADS DEPOIS DE 24H

    function limparPastaUpload(limite) {
      const diretorioUpload = path.join(__dirname, '../public/upload');

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

// Executa a limpeza da pasta upload a cada 24 horas (86400000 milissegundos)
    setInterval(() => {
      const limiteExclusao = 86400000; // 24 horas em milissegundos
      limparPastaUpload(limiteExclusao);
    }, 86400000);


//EXPORTA O MIDDLEWARE
  module.exports = upload;