const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')

const home = require('../controllers/home');
const image = require('../controllers/image');


const admRoute = require('../routes/adm')


module.exports = app => {

    //router.get('/', home.index);
    router.get('/images/:image_id', image.index);
    router.post('/images', image.create);
    router.post('/images/:image_id/like', image.like);
    router.post('/images/:image_id/coment', image.coment);
    router.delete('/images/:image_id', image.remove);

    app.use(bodyParser.json())
        
    //ROTAS PRINCIPAIS

        //PAGINA INICIAL
        
    
    app.use(router);
    
    
}