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
    const mongoose = require('mongoose')
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
            extname: '.hbs',
            helpers: require('./helpers/helpersHandlebars'),
            noEscape: true,
            allowProtoProperties: true,
            allowProtoMethods: true
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
    async function startServer(){
        
        //await mongoose.connect("mongodb://localhost/bancoTeste")
        await connectDB()
        app.listen(PORT, () => {
            console.log("http://localhost:3000/");
        })}

startServer()
