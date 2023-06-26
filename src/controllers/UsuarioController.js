//CARREGANDO MODULOS
    const bcrypt = require('bcryptjs')
    const passport = require('passport')
//Carregando SCHEMAS
    const Usuario = require('../models/Usuario')

class UsuarioController{

    //Registrar o usuario
        static async Registro(req,res){
            //VALIDAÇÃO
                var erros = []

                if(!req.body.nome || typeof req.body.nome == null || typeof req.body.nome == undefined){
                    erros.push({texto: 'Nome inválido'})
                }if(!req.body.email || typeof req.body.email == null || typeof req.body.email == undefined){
                    erros.push({texto: 'email inválido'})
                }if(!req.body.senha || typeof req.body.senha == null || typeof req.body.senha == undefined){
                    erros.push({texto: 'senha inválido'})
                }if(req.body.senha.length < 4){
                    erros.push({texto: 'senha muito curta'})
                }if(req.body.senha != req.body.senha2){
                    erros.push({texto: 'As senhas são diferentes, tente novamente'})
                }
                
                if(erros.length > 0){
                    res.render('usuarios/registro', {erros: erros})
                }
                
            //SE PASSAR A VALIDAÇÃO
                else{
                    var eAdmin;

                    if(req.body.eAdmin === 'undefined'){
                        eAdmin = 0
                    }else if(req.body.eAdmin == 'on'){
                        eAdmin = 1
                    }

                    console.log(req.body.eAdmin)
                    //VERIFICA SE EXISTE O EMAIL CADASTRADO NO BD
                        Usuario.findOne({email: req.body.email}).then((usuario)=>{
                            if(usuario){
                                req.flash("error_msg", "Email já cadastrado!")
                                res.redirect('/registro')
                            }else{
                                //CRIA O DOC USUARIO
                                    const newUsuario = new Usuario({
                                        nome: req.body.nome,
                                        email: req.body.email,
                                        senha: req.body.senha,
                                        eAdmin: eAdmin
                                    })

                                //CRIPTOGRAFA A SENHA E SALVA O USUARIO
                                    bcrypt.genSalt(12, (err, salt)=>{
                                        bcrypt.hash(newUsuario.senha, salt, (erro, hash)=>{
                                            if(erro){
                                                req.flash("error_msg", "Houve um erro interno, tente novamente!")
                                                res.redirect('/')
                                            }

                                            newUsuario.senha = hash

                                        //SALVA O USUARIO NO BD
                                            newUsuario.save().then(()=>{
                                                req.flash('success_msg', "Usuario criado com sucesso!")
                                                res.redirect('/')
                                            }).catch((err)=>{
                                                console.log('ERRO: '+err);
                                                req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!")
                                                res.redirect('/registro')
                                            })
                                        })
                                    })
                            }
                        }).catch((err)=>{
                            console.log('ERRO: '+ err)
                            req.flash("error_msg", "Houve um erro interno, tente novamente!")
                            res.redirect('/')
                        })
                }
        }

    //Login de usuario
        static async Login(req, res, next){
            passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/login",
                failureFlash: true
            })(req,res,next)
        }
}

module.exports = UsuarioController