const mongoose = require('mongoose');

const imagemSchema = new mongoose.Schema({
  tipo: String,
  dados: Buffer
});

const Imagem = mongoose.model('Imagem', imagemSchema);

module.exports = Imagem