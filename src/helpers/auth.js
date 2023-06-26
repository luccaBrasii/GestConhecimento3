//MODULOS
    const localStrategy = require('passport-local').Strategy
    const bcrypt = require('bcryptjs')

//Model USUARIO
    const Usuario = require('../models/Usuario')

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        Usuario.findOne({ email: email }).then((usuario) => {
          if (!usuario) {
            return done(null, false, { message: "Essa conta não existe" });
          }
      
          bcrypt.compare(senha, usuario.senha, (erro, verificada) => {
            if (verificada) {
              const usuarioSemSenha = { ...usuario.toObject() };
              delete usuarioSemSenha.senha;
              //delete usuarioSemSenha.eAdmin;
              return done(null, usuarioSemSenha);
            } else {
              return done(null, false, { message: "Senha incorreta" });
            }
          });
        });
      }));
      
      passport.serializeUser((usuario, done) => {
        done(null, usuario._id);
      });
      
      passport.deserializeUser((id, done) => {
        Usuario.findById(id)
          .then((usuario) => {
            if (usuario) {
              const usuarioSemSenha = { ...usuario.toObject() };
              delete usuarioSemSenha.senha;
              //delete usuarioSemSenha.eAdmin;
              done(null, usuarioSemSenha);
            } else {
              done(null, false);
            }
          })
          .catch((error) => {
            done(error);
          });
      });
      
    
}