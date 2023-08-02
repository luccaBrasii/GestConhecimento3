const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    //Método para conectar ao BD
      //CONECTAR LOCAL: mongodb://localhost/bancoTeste
      //CONECTAR A NUVEM: mongodb+srv://luccabrasies:jAid0mfpJCfIYsCL@gestaodeconhecimento.tnbn4yu.mongodb.net/?retryWrites=true&w=majority
        await mongoose.connect("mongodb://localhost/bancoTeste", {
      //Essa opção informa ao Mongoose para usar o novo analisador de URL do MongoDB.
        useNewUrlParser: true,
      //Essa opção informa ao Mongoose para usar a nova camada de topo unificada do MongoDB.
        useUnifiedTopology: true,
    });
    console.log('Conexão com o MongoDB Atlas estabelecida com sucesso!');
  } catch (err) {
    console.log('Erro ao conectar ao MongoDB Atlas:', err);
  }
};


module.exports = connectDB

