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

  Handlebars.registerHelper("iconDoc", function (data){
    let dado = String(data)

    if(dado === 'excel'){
        return '/public/img/icons/excel.png'
    }else if(dado === 'word'){
        return '/public/img/icons/word.png'
    }else if(dado === 'pdf'){
        return '/public/img/icons/pdf.png'
    }else if(dado === 'img'){
        return '/public/img/icons/picture.png'
    }else if(dado === 'audio'){
        return '/public/img/icons/audio-file.png'
    }else if(dado === 'texto'){
        return '/public/img/icons/note.png'
    }else if(dado === 'video'){
        return '/public/img/icons/video-player.png'
    }else if(dado === 'zip'){
        return '/public/img/icons/zip.png'
    }
  })