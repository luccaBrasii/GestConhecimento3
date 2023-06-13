//MODULOS
const bodyParser = require("body-parser");


//CONTROLADORES
const CategoriaController = require('../controllers/CategoriaController')
const PostagensController = require('../controllers/PostagensController')
const RotasController = require('../controllers/RotasController')
const DocsController = require('../controllers/DocsController')

//MIDDLEWARE
const { middleware } = require('../helpers/middleware')
const upload = require('../helpers/multer')

module.exports = app => {
    //CONFIG
        app.use(bodyParser.json())

    //ROTAS PRINCIPAIS

    //PAGINA INICIAL
        app.get('/', RotasController.listaPosts)

    //PAGINA UNICA DE POST
        app.get('/postagem/:slug', RotasController.postUnico)

    //PAGINA INICIAL DAS CATEGORIAS
        app.get('/lista/categorias', RotasController.buscaCategorias)

    //PAGINA DELISTAGEM DE POSTS COM BASE NA CATEGORIA
        app.get('/lista/categorias/post/:slug', RotasController.buscaPostComCategoria)

    //

    //ROTAS CATEGORIA

    //Pag principal
        app.get('/categorias', middleware, CategoriaController.listarCateg)

    //Pag para cadastrar materia
        app.get('/cadastrar', (req, res) => {
        res.status(200).render('admin/formulario')
    })

    //Método POST para cadastrar a matéria
        app.post('/cadastrar', middleware, CategoriaController.createCateg)

    //Edição de categoria
        app.get('/categorias/edit/:id', middleware, CategoriaController.buscaCateg)

        app.post('/categorias/edit/', middleware, CategoriaController.editCategoria)

    //Deletar a categoria
        app.post('/categoria/delete', middleware, CategoriaController.deleteCategoria)
    //

    //ROTAS POSTAGENS
        app.get('/postagens', middleware, PostagensController.listaPosts)

    //Renderiza o formulario junto com as categorias cadastradas
        app.get('/postagens/add', middleware, PostagensController.buscaCategoria)

    //Cria o post
    //middleware upload comentado para nao salvar os arquivos localmente, se quiser que salve local só descomentar
        app.post('/postagens/add', middleware, upload.array("file"), PostagensController.criaPost)


    //Renderiza o 'EDIT POSTS'
        app.get('/postagens/edit/:id', middleware, PostagensController.renderizaForm)

    //Rota de edição
    //middleware upload comentado para nao salvar os arquivos localmente, se quiser que salve local só descomentar
        app.post('/postagens/edit', middleware, upload.array("file"), PostagensController.updatePost)

    //DELETE POST
        app.post('/postagens/delete', middleware, PostagensController.deletePost)

    //ROTAS DE ARQUIVOS

    //RENDERIZA AS IMAGENS EM UMA ROTA COM BASE NO ID
        app.get('/imagem/:id', DocsController.renderizaIMG)

    //RENDERIZA O PDF EM UMA ROTA COM BASE NO ID
        app.get('/pdf/:id', DocsController.renderizaPDF)

    //ROTA DE DOWNLOAD ARQUIVO WORD .DOC .DOCX
        app.get('/download/:id', DocsController.downloadDOCX)

    //ROTA DE AUDIO
        app.get('/audio/:id',DocsController.renderizaAudio)
}