const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//CRIANDO UM SCHEMA
    const CategoriaSchema = new Schema({
        nome: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    });

//CRIANDO UMA COLLECTION
    const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria
  
  