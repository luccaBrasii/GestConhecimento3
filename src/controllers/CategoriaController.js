//CARREGANDO SCHEMA CATEGORIA
    const Categoria = require('../models/Categoria')
//função verificar parametros
    const verificarParametros = require('../helpers/verificarParametros')

//CONTROLLER
    class CategoriaController {
        
        //CREATE
            static async createCateg(req, res) {
                
                /*Validação: Recebe 4 parametros: 'res', o arquivo 'handlebars' a ser renderizado
                o req.body que será validado, e um 'nome' para exibir para o usuario caso a validação falhe ex: 'nome incompleto'*/
                    let validacao = verificarParametros(res,'admin/formulario', req.body.nome, 'nome');
                    
                //Se a validação passar cria um DOC e envia ao BD
                    if(validacao){
                        //Cria o DOC
                            const newCategoria = {
                                nome: req.body.nome,
                                slug: `${Date.now()}+${req.body.nome.trim()}`
                            };
                        
                        try {
                            //Salva o DOC no banco de dados
                                await new Categoria(newCategoria).save();
                                console.log('Cadastrado com sucesso');
                            //Armazena a mensagem na varivel flash 'success_msg'
                                req.flash('success_msg','categoria registrada com sucesso!')
                                res.status(200).redirect('/categorias')
                        }catch (err) {
                            //Armazena a mensagem na varivel flash 'error_msg'
                                req.flash('error_msg','Houve um erro ao registrar a categoria, tente novamente!')
                                console.log('Erro ao cadastrar!', err);
                    }}
            }
        
        //READ
            static async listarCateg(req,res){
                Categoria.find().sort({date: 'desc'}).then((categorias)=>{
                    res.render('admin/categorias', {categorias: categorias})
                }).catch((err)=>{
                    req.flash("error_msg", "Houve um erro ao listar as categorias")
                    res.redirect('/categorias')
                })
            }

        //FIND ONE
            static async buscaCateg(req,res){
                Categoria.findOne({_id: req.params.id}).then((categoria)=>{
                    res.render('admin/editCategorias', {categoria: categoria})
                }).catch((err)=>{
                    console.log('ERRO: '+ err);
                    req.flash('error_msg', 'Esta categoria não existe')
                    res.redirect('/categorias')
                })
            }

        //EDITAR CATEGORIA
            static async editCategoria(req,res){

                //Validações
                    if(!req.body.nome || typeof req.body.nome  === 'undefined' || req.body.nome  === null){

                        erros.push({ texto: `${nomeParametro} inválido!` });
                        res.redirect(`/categorias/edit/${req.body.id}`)

                    }else{
                        //Se passar pelas valçidações edita o arquivo com base no ID..
                            Categoria.findOne({_id: req.body.id}).then((categoria)=>{

                                categoria.nome = req.body.nome
                                categoria.date = Date.now()

                                categoria.save().then(()=>{
                                    req.flash("success_msg", "Categoria editada com sucesso!")
                                    res.redirect('/categorias')
                                }).catch((err)=>{
                                    console.log("ERRO: "+ err);
                                    req.flash("error_msg","Houve um erro interno ao editar a categoria!")
                                    res.redirect(`/categorias/edit/${req.body.id}`)
                                })
                            }).catch((err)=>{
                                console.log("ERRO: "+ err);
                                req.flash("error_msg", "Houve um erro ao salvar a edição da categoria")
                                res.redirect(`/categorias/edit/${req.body.id}`)
                            })
                        }
            }

        //DELETAR CATEGORIA
            static async deleteCategoria(req, res){
                Categoria.findOneAndRemove({_id: req.body.id}).then(()=>{
                        req.flash("success_msg","Categoria deletada com sucesso!")
                        res.redirect('/categorias')
                }).catch((err)=>{
                        console.log(err);
                        req.flash("error_msg","Houve um erro ao deletar!")
                        res.redirect('/categorias')
                })
            }
    }

module.exports = CategoriaController


  