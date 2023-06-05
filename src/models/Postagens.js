const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    data:{
        type: Date,
        default: Date.now
    },
    autor:{
        type: String,
        required: true
    },
    img:{
        type:String, 
        default: null
    }
})

const Post = mongoose.model('postagens', Postagem)

module.exports = Post