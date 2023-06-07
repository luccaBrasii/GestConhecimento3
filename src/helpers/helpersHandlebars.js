const Handlebars = require('handlebars')

Handlebars.registerHelper("eq", function (a, b) {
    if(a == b){
        return true
    }else{
        return false
    }
    
  });