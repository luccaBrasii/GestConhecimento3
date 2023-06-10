const mongoose = require('mongoose');

const docsSchema = new mongoose.Schema({
  nome: String,
  tipo: String,
  dados: Buffer
});

const Documentos = mongoose.model('Documentos', docsSchema);

module.exports = Documentos