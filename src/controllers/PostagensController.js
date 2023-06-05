//CARREGANDO SCHEMAS
    const Categoria = require('../models/Categoria')
    const Postagens = require('../models/Postagens')
//OUTROS CONTROLLADORES
    const ImagemController = require('./ImagemController')


//CONTROLLER
    class PostagensController {
        //Lista os posts existentes
            static async listaPosts(req,res){
                await Postagens.find().populate('categoria').sort({data: "desc"}).then((postagens)=>{
                    res.render('admin/postagens', {postagens: postagens})
                }).catch((err)=>{
                    console.log('ERRO: '+err);
                    req.flash('error_msg', 'Houve um erro ao listar os posts.. tente novamente')
                    res.redirect('/')
                })
            }

        //Renderiza o formulário com as categorias do BD..
            static async buscaCategoria(req,res){
                await Categoria.find().then((categorias)=>{
                    res.render('admin/addPostagens', {categorias: categorias})
                }).catch((err)=>{
                    console.log("ERRO: "+ err);
                    req.flash("error_msg", "Houve um erro ao carregar o formulário!")
                    res.redirect('/')
                })
            }
        
        //Criar nova postagem
            static async criaPost(req,res){
                //Validações
                    if(!req.body.titulo || typeof req.body.titulo  === 'undefined' || req.body.titulo  === null){

                        req.flash("error_msg", 'Insira um titulo válido!')
                        res.redirect(`/postagens/add`)

                    }else if(!req.body.descricao || typeof req.body.descricao  === 'undefined' || req.body.descricao  === null){

                        req.flash("error_msg", 'Insira uma descrição válida!')
                        res.redirect(`/postagens/add`)

                    }else if(!req.body.conteudo || typeof req.body.conteudo  === 'undefined' || req.body.conteudo  === null){

                        req.flash("error_msg", 'IConteúdo inválido!')
                        res.redirect(`/postagens/add`)

                    }else if(req.body.categoria == 0){
                        
                        req.flash("error_msg", 'Categoria inválida, por favor registre uma categoria!')
                        res.redirect(`/postagens/add`)

                    }
                    //SE PASSAR DAS VALIDAÇÕES..
                        else{
                            var newPost; 
                            const file = req.file
                            if(file){
                                 
                                var newPost = {
                                    titulo: req.body.titulo,
                                    slug: `${Date.now()}+${req.body.titulo.trim()}`,
                                    descricao: req.body.descricao,
                                    conteudo: req.body.conteudo,
                                    categoria: req.body.categoria,
                                    autor: req.user.nome,
                                    img: file.filename
                                }
                            }else{
                                var newPost = {
                                    titulo: req.body.titulo,
                                    slug: `${Date.now()}+${req.body.titulo.trim()}`,
                                    descricao: req.body.descricao,
                                    conteudo: req.body.conteudo,
                                    categoria: req.body.categoria,
                                    autor: req.user.nome
                                }
                            }
                            

                            

                            await new Postagens(newPost).save().then(()=>{
                                req.flash('success_msg', "Postagem criada com sucesso!")
                                res.redirect('/postagens')
                            }).catch((err)=>{
                                console.log("ERRO!: " + err);
                                req.flash('error_msg', 'Houve um erro durante o salvamento da postagem!')
                                res.redirect('/postagens')
                            })
                        }
                    
                    

            } 

        //Renderiza o formulário de edição das postagens
            static async renderizaForm(req,res){

                await Postagens.findOne({_id: req.params.id}).then((postagem)=>{ //Renderiza os inputs do form
                
                    Categoria.find().then((categorias)=>{ //Renderiza as categorias
                        res.render("admin/editPostagens", {categorias: categorias, postagem: postagem})
                    }).catch((err)=>{
                        console.log('ERRO: '+ err);
                        req.flash("error_msg", "Houve um erro ao listar as categorias..")
                        res.redirect('/postagens')
                    })

                }).catch((err)=>{
                    console.log('ERRO: '+ err);
                    req.flash("error_msg", "Houve um erro ao renderizar o formulário..")
                    res.redirect('/postagens')
                })
            }

        //UPDATE POSTAGEM
            static async updatePost(req, res){

                //Validações
                    if(!req.body.titulo || typeof req.body.titulo  === 'undefined' || req.body.titulo  === null){

                        req.flash("error_msg", 'Insira um titulo válido!')
                        res.redirect(`/postagens/edit/${req.body.id}`)

                    }else if(!req.body.slug || typeof req.body.slug  === 'undefined' || req.body.slug  === null){

                        req.flash("error_msg", 'Insira um slug válido!')
                        res.redirect(`/postagens/edit/${req.body.id}`)

                    }else if(!req.body.descricao || typeof req.body.descricao  === 'undefined' || req.body.descricao  === null){

                        req.flash("error_msg", 'Insira um descricao válido!')
                        res.redirect(`/postagens/edit/${req.body.id}`)

                    }else if(!req.body.conteudo || typeof req.body.conteudo  === 'undefined' || req.body.conteudo  === null){

                        req.flash("error_msg", 'Insira um conteudo válido!')
                        res.redirect(`/postagens/edit/${req.body.id}`)

                    }else{
                //SE PASSAR DAS VALIDAÇÕES..
                        await Postagens.findOne({_id: req.body.id}).then((postagens)=>{
                            
                                const file = req.file
                                if(file){
                                    postagens.img = file.filename
                                }
                                
                                
                            
                                postagens.titulo = req.body.titulo
                                postagens.slug = req.body.slug
                                postagens.descricao = req.body.descricao
                                postagens.conteudo = req.body.conteudo
                                postagens.categoria = req.body.categoria
                                postagens.data = Date.now()
                                postagens.autor = req.user.nome

                            postagens.save().then(()=>{
                                req.flash("success_msg", "Postagem editada com sucesso !")
                                res.redirect('/postagens')
                            }).catch((err)=>{
                                console.log("ERRO: "+err);
                                req.flash("error", "Falha ao salvar a postagem!")
                                res.redirect('/postagens')
                            })
                        })
                    }


            }

        //DELETE POSTAGEM
            static async deletePost(req, res){
                await Postagens.findOneAndRemove({_id: req.body.id}).then(()=>{
                    req.flash("success_msg","Post apagado com sucesso!")
                    res.redirect('/postagens')
            }).catch((err)=>{
                    console.log(err);
                    req.flash("error_msg","Houve um erro ao deletar!")
                    res.redirect('/postagens')
            })
            }
}


module.exports = PostagensController