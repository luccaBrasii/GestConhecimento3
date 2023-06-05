//CARREGANDO OS MODULOS
    const express = require("express"); //
    const exphbs = require('express-handlebars')
    const bodyParser = require('body-parser')
    const RoutesController = require('./routes/adm')
    const RoutesUsuario = require('./routes/userRoute')
    const connectDB = require('./database')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const app = express();
    const passport = require('passport')
    require('./helpers/auth')(passport)
    const morgan = require('morgan');

    const PORT = process.env.PORT || 3000;

//CONFIG
    //Arquivos estáticos
        app.use('/public', express.static(path.join(__dirname, './public')));
    //Session
        app.use(session({
            secret: 'keyboard-cat',
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())

    //Template engine
        app.set('views', path.join(__dirname, '../src/views'));
        app.engine('.hbs', exphbs({
            defaultLayout: 'main',
            partialsDir: path.join(app.get('views'), 'partials'),
            layoutsDir: path.join(app.get('views'), 'layouts'),
            extname: '.hbs'
        }));
        app.set('view engine', '.hbs');


    //Middlewares

        app.use(morgan('dev'));//REGISTRAR solicitações recebidas pelo servidor
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());

        app.use(flash())
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })

    //Body-parser
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())


//ROTAS
    //Rotas da api - Controller
        RoutesController(app)

    //Rotas de LOGIN etc
        RoutesUsuario(app)

//Inicia o Servidor
    async function startServer() {
        await connectDB()

        app.listen(PORT, () => {
            console.log("http://localhost:3000/");
        })}

startServer()


/* SALVAR IMG NO BANCO DE DADOS

const mongoose = require('mongoose');

const imagemSchema = new mongoose.Schema({
  dados: Buffer
});

const Imagem = mongoose.model('Imagem', imagemSchema);
const fs = require('fs')

const img = fs.readFileSync('src/sapo.jpg')

const novaImagem = new Imagem({ dados: img });
console.log('executando')

async function salvarDado(novaImagem){
    await novaImagem.save((err) => {
        if (err) {
          console.error('Erro ao salvar a imagem:', err);
        } else {
          console.log('Imagem salva com sucesso!');
        }
      });
}

salvarDado(novaImagem)

*/



const Imagem = require('./models/Imagem');

app.get('/imagem/:id', (req, res) => {
  const imagemId = req.params.id;

  Imagem.findById(imagemId, (err, imagem) => {
    if (err) {
      console.error('Erro ao buscar a imagem:', err);
      res.status(500).send('Erro ao buscar a imagem');
    } else if (!imagem) {
      res.status(404).send('Imagem não encontrada');
    } else {
      res.set('Content-Type', 'image/jpeg'); // Defina o tipo de conteúdo adequado para a imagem (exemplo: image/jpeg)
      res.send(imagem.dados);
    }
  });
});

