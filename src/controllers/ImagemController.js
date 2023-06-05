//CARREGANDO SCHEMA
    const path = require('path');
const Imagem = require('../models/Imagem')
//Modulos
    const fs = require('fs')


    async function Salve(name){
            const img = fs.readFileSync('/src/public/upload/' + name)

            const novaImagem = new Imagem({ dados: img });
            console.log('executando')

        
            await novaImagem.save().then((img)=>{
                console.log(img.id)
                return img.id
            }).catch((err)=>{
                console.log('erro: '+err)
            })

    }


module.exports = Salve