const mongoose = require('mongoose');

const docsSchema = new mongoose.Schema({
  nome: String,
  tipo: String,
  dados: Buffer
});

const DocsExcluidos = mongoose.model('DocsExcluidos', docsSchema);

module.exports = DocsExcluidos