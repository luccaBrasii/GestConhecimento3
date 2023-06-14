//CARREGANDO SCHEMAS
const Categoria = require('../models/Categoria')
const Postagens = require('../models/Postagens')
const Documentos = require('../models/Documentos')
//OUTROS CONTROLLADORES
const DocsController = require('../controllers/DocsController')


//CONTROLLER
class PostagensController {
    //Lista os posts existentes
    static async listaPosts(req, res) {
        await Postagens.find().populate('categoria').sort({ data: "desc" }).then((postagens) => {
            res.render('admin/postagens', { postagens: postagens })
        }).catch((err) => {
            console.log('ERRO: ' + err);
            req.flash('error_msg', 'Houve um erro ao listar os posts.. tente novamente')
            res.redirect('/')
        })
    }

    //Renderiza o formulário com as categorias do BD..
    static async buscaCategoria(req, res) {
        await Categoria.find().then((categorias) => {
            res.render('admin/addPostagens', { categorias: categorias })
        }).catch((err) => {
            console.log("ERRO: " + err);
            req.flash("error_msg", "Houve um erro ao carregar o formulário!")
            res.redirect('/')
        })
    }

    //Criar nova postagem
    static async criaPost(req, res) {
        //Validações
        if (!req.body.titulo || typeof req.body.titulo === 'undefined' || req.body.titulo === null) {

            req.flash("error_msg", 'Insira um titulo válido!')
            res.redirect(`/postagens/add`)

        } else if (!req.body.descricao || typeof req.body.descricao === 'undefined' || req.body.descricao === null) {

            req.flash("error_msg", 'Insira uma descrição válida!')
            res.redirect(`/postagens/add`)

        } else if (!req.body.conteudo || typeof req.body.conteudo === 'undefined' || req.body.conteudo === null) {

            req.flash("error_msg", 'IConteúdo inválido!')
            res.redirect(`/postagens/add`)

        } else if (req.body.categoria == 0) {

            req.flash("error_msg", 'Categoria inválida, por favor registre uma categoria!')
            res.redirect(`/postagens/add`)

        }
        //SE PASSAR DAS VALIDAÇÕES..
        else {
            //Obtém os arquivos enviados e verifica se há arquivos enviados
                const files = req.files; 
            
                if (files) {
            // Cria um objeto vazio para armazenar os dados dos arquivos
                const fileIds = [];

            // Itera sobre cada arquivo recebido
                for (const file of files) {
                    const fileId = await DocsController.Salve(file.filename); // Salva o arquivo e obtem o ID retornado da função
                    fileIds.push(fileId); // Adiciona o ID do arquivo ao array fileIds
                }

            // Crie o objeto newPost com base nos dados enviados e adicione os IDs dos arquivos ao campo imgs
                const newPost = {
                    titulo: req.body.titulo,
                    slug: `${Date.now()}+${req.body.titulo.trim()}`,
                    descricao: req.body.descricao,
                    conteudo: req.body.conteudo,
                    categoria: req.body.categoria,
                    autor: req.user.nome,
                    img: fileIds // Adicionei o array fileIds ao campo imgs
                };
                
            // Salve o novo post no banco de dados
                await new Postagens(newPost)
                    .save()
                    .then(() => {
                    req.flash('success_msg', "Postagem criada com sucesso!")
                    res.redirect('/postagens')
                    })
                    .catch((err) => {
                    console.log("ERRO!: " + err);
                    req.flash('error_msg', 'Houve um erro durante o salvamento da postagem!')
                    res.redirect('/postagens')
                    });
                }
            }
        }
    

    //Renderiza o formulário de edição das postagens
    static async renderizaForm(req, res) {

        await Postagens.findOne({ _id: req.params.id }).populate('img').then((postagem) => { //Renderiza os inputs do form

            Categoria.find().then((categorias) => { //Renderiza as categorias
                res.render("admin/editPostagens", { categorias: categorias, postagem: postagem })
            }).catch((err) => {
                console.log('ERRO: ' + err);
                req.flash("error_msg", "Houve um erro ao listar as categorias..")
                res.redirect('/postagens')
            })

        }).catch((err) => {
            console.log('ERRO: ' + err);
            req.flash("error_msg", "Houve um erro ao renderizar o formulário..")
            res.redirect('/postagens')
        })
    }

    //UPDATE POSTAGEM
    static async updatePost(req, res) {

        //Validações
        if (!req.body.titulo || typeof req.body.titulo === 'undefined' || req.body.titulo === null) {

            req.flash("error_msg", 'Insira um titulo válido!')
            res.redirect(`/postagens/edit/${req.body.id}`)

        } else if (!req.body.descricao || typeof req.body.descricao === 'undefined' || req.body.descricao === null) {

            req.flash("error_msg", 'Insira um descricao válido!')
            res.redirect(`/postagens/edit/${req.body.id}`)

        } else if (!req.body.conteudo || typeof req.body.conteudo === 'undefined' || req.body.conteudo === null) {

            req.flash("error_msg", 'Insira um conteudo válido!')
            res.redirect(`/postagens/edit/${req.body.id}`)

        } else {
            //SE PASSAR DAS VALIDAÇÕES..

            //BUSCA A POSTAGEM NO BD
            await Postagens.findOne({ _id: req.body.id }).then(async (postagens) => {
                //VERIFICA SE EXISTEM ARQUIVOS
                const files = req.files;
                
                if (files) {
                //PEGA TODOS OS IDS DOS DOCUMENTOS EXISTENTES NESSE POST
                  const imageIds = req.body.img
                //DELETA OS DOCS ANTIGOS
                  //await Documentos.deleteMany({ _id: { $in: imageIds } })
                  const filePromises = []; // Array para armazenar as Promises
              
                  for (const file of files) {
                    const fileIdPromise = DocsController.Salve(file.filename); // Salva o arquivo e retorna uma Promise com o ID
                    filePromises.push(fileIdPromise); // Adiciona a Promise ao array
                  }
              
                  try {
                    const fileIds = await Promise.all(filePromises); // Espera todas as Promises serem resolvidas e obtém os IDs
              
                    postagens.titulo = req.body.titulo;
                    postagens.slug = `${Date.now()}+${req.body.titulo.trim()}`;
                    postagens.descricao = req.body.descricao;
                    postagens.conteudo = req.body.conteudo;
                    postagens.categoria = req.body.categoria;
                    postagens.data = Date.now();
                    postagens.autor = req.user.nome;
                    postagens.img = imageIds.concat(fileIds);
              
                    postagens
                      .save()
                      .then(() => {
                        req.flash('success_msg', 'Postagem editada com sucesso!');
                        res.redirect('/postagens');
                      })
                      .catch((err) => {
                        console.log('ERRO: ' + err);
                        req.flash('error', 'Falha ao salvar a postagem!');
                        res.redirect('/postagens');
                      });
                  } catch (err) {
                    console.log('ERRO: ' + err);
                    req.flash('error', 'Falha ao salvar os arquivos!');
                    res.redirect('/postagens');
                  }
                } else {
                  postagens.titulo = req.body.titulo;
                  postagens.slug = `${Date.now()}+${req.body.titulo.trim()}`;
                  postagens.descricao = req.body.descricao;
                  postagens.conteudo = req.body.conteudo;
                  postagens.categoria = req.body.categoria;
                  postagens.data = Date.now();
                  postagens.autor = req.user.nome;
              
                  postagens
                    .save()
                    .then(() => {
                      req.flash('success_msg', 'Postagem editada com sucesso!');
                      res.redirect('/postagens');
                    })
                    .catch((err) => {
                      console.log('ERRO: ' + err);
                      req.flash('error', 'Falha ao salvar a postagem!');
                      res.redirect('/postagens');
                    });
                }
              });
              
            }
        }


    //DELETE POSTAGEM
    static async deletePost(req, res) {
        const imgList = req.body.img.split(','); // Divide a lista de img em um array de IDs
      
        await Postagens.findOneAndRemove({ _id: req.body.id }).then(() => {
          Documentos.deleteMany({ _id: { $in: imgList } }).then(() => {
            req.flash("success_msg", "Post apagado com sucesso!");
            res.redirect('/postagens');
          }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao deletar! (img nao encontrada)");
            res.redirect('/postagens');
          });
        }).catch((err) => {
          console.log(err);
          req.flash("error_msg", "Houve um erro ao deletar!");
          res.redirect('/postagens');
        });
      }
      
}


module.exports = PostagensController