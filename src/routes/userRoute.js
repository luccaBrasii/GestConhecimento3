//MODULOS
    const bodyParser = require("body-parser");

//CONTROLADORES
    const UsuarioController = require('../controllers/UsuarioController')
//MIDDLEWARES
    const { middleware, eAdmin } = require('../helpers/middleware')

    module.exports = app => {
        app.use(bodyParser.json())

        //ROTA PARA REGISTRO
            app.get('/registro', (req,res)=>{
                res.render('usuarios/registro')
            })

        //CRIAR USUARIO
            app.post('/registro', UsuarioController.Registro)
        
        //LOGIN
            //Renderiza a pag de login
                app.get('/login', (req,res)=>{
                    res.render('usuarios/login')
                })
            //metódo para login
                app.post('/login', UsuarioController.Login)

        //LOGOUT
            app.get('/logout', (req, res)=>{
                req.logout(function(err) {
                    if (err) { return next(err) }
                    req.flash("success_msg", "Deslogado com sucesso")
                    res.redirect('/')
                  })
            })

        //PAINEL ADMIN
            app.get('/adm',eAdmin, UsuarioController.RenderizaADM)

            app.post('/adm',eAdmin, UsuarioController.MudaPermissao)
                
        //PAINEL FORMULARIO USUARIO    
            app.get('/edit/user/:id', UsuarioController.RenderizaUSER)
    }

