const Handlebars = require('handlebars')

Handlebars.registerHelper("eq", function (a, b) {
    if(a == b){
        return true
    }else{
        return false
    }
    
  });

  Handlebars.registerHelper("findNome", function (a, separador) {
    var array = a.split(separador);
    return array[1]
  })