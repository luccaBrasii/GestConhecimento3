/*
const connectDB = require('./src/database')
const mongoose = require('mongoose');

connectDB()

const imagemSchema = new mongoose.Schema({
  dados: Buffer
});

const Imagem = mongoose.model('Imagem', imagemSchema);
const fs = require('fs')

const img = fs.readFileSync('./sapo.jpg')

const novaImagem = new Imagem({ dados: img });
console.log('executando')

async function salvarDado(novaImagem){
    await novaImagem.save().then((img)=>{
        console.log(img.id)
        return img.id
    }).catch((err)=>{
        console.log('erro: '+err)
    })
}


module.exports = salvarDado
*/

console.log(__dirname + 'ok');