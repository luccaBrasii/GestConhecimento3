module.exports = {

    middleware: function(req,res,next){

        if(req.isAuthenticated()){
            return next()
        }
        req.flash("error_msg", "Você precisa estar logado!")
        res.redirect('/')
    },

    eAdmin: function(req,res,next){

        if(req.isAuthenticated() && req.user.eAdmin === 1){
            return next()
        }
        req.flash("error_msg", "Você precisa ser ADM!")
        res.redirect('/')
    },
}