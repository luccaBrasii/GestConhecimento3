//Módulos
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

//CRIANDO UM SCHEMA
    const UsuarioSchema = new Schema({
        nome: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        senha: {
            type: String,
            required: true
        },
        //0 é Usuario, 1 é Admin
        eAdmin:{
            type: Number,
            default: 0
        }
    });

//CRIANDO UMA COLLECTION
    const Usuario = mongoose.model('Usuarios', UsuarioSchema);

module.exports = Usuario