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

  Handlebars.registerHelper("dateFormat", function (data){
    var data2 = String(data)
    var dataFormatada = data2.split(' ')
    var formatada = []
    var ultimaVar = []

    for(let i = 0; dataFormatada.length > i; i++){
        if(i === 1 || i === 2 || i == 3 || i == 4){
            formatada.push(dataFormatada[i])
        }
    }

    ultimaVar.push(formatada[1], formatada[0], formatada[2])
    
    var dataFormt = String(ultimaVar).replaceAll(',','/')
    dataFormt += ' as '+ formatada[3]
    return dataFormt
})