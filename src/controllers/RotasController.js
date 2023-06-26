//CARREGANDO SCHEMAS
const Categoria = require('../models/Categoria')
const Postagens = require('../models/Postagens')



//CONTROLLER

    class RotasController{

        //PARA LISTAR OS POSTS NA ROTA PRINCIPAL
            static async listaPosts(req,res){
                await Postagens.find().populate('categoria').sort({data: "desc"}).populate('img').then((postagens)=>{
                    res.render('index', {postagens: postagens})
                }).catch((err)=>{
                    console.log('ERRO: '+err);
                    req.flash('error_msg', 'Houve um erro ao listar os posts.. tente novamente')
                    res.redirect('/')
                })
            }
        
        //PARA BUSCAR UMA POSTAGEM E EXIBIR UMA ROTA UNICA P/ CADA
            static async postUnico (req,res){
                Postagens.findOne({slug: req.params.slug}).populate('img').then((postagem)=>{
                    if(postagem){
                        res.render('postagem/index', {postagem: postagem})
                    }else{
                        req.flash('error_msg', 'Esta postagem não existe!')
                        res.redirect('/')
                    }
                }).catch((err)=>{
                    console.log('ERRO: '+ err)
                    req.flash('error_msg', 'Erro interno, tente novamente!')
                    res.redirect('/')

                })
            }

        //BUSCA E LISTA AS CATEGORIAS EXISTENTES
            static async buscaCategorias(req,res){
                Categoria.find().then((categorias)=>{
                    res.render('categorias/index', {categorias: categorias})
                }).catch((err)=>{
                    console.log('ERRO: '+err);
                    req.flash("error_msg", "Houve um erro interno ao listar as categorias")
                    res.redirect('/')
                })
            }
        
        //PAGINA DELISTAGEM DE POSTS COM BASE NA CATEGORIA
            static async buscaPostComCategoria(req,res){
                Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
                    if(categoria){
                        Postagens.find({categoria: categoria._id}).populate('img').then((postagens)=>{
                            res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
                        }).catch((err)=>{
                            console.log('ERRO: '+ err)
                            req.flash("error_msg", "Houve um erro ao listar os posts..")
                            res.redirect('/')
                        })
                    }else{
                        req.flash("error_msg", "Esta categoria não existe..")
                        res.redirect('/')
                    }
                }).catch((err)=>{
                    console.log('ERRO: '+ err)
                    req.flash("error_msg", "Houve um erro interno ai carregar a página dessa categoria..")
                    res.redirect('/')
                })
            }
    }

module.exports = RotasController