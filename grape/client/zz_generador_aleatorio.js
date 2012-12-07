categorias = [
      'Medio Ambiente',
      'Educacion',
      'Arte y Cultura',
      'Desarrollo'
];

tipos = [
      'Reciclado',
      'Ecologia Urbana',
      'Espacio Publico',
      'Reutilizacion',
      'Capacitacion',
      'Ayuda Escolar',
      'Taller',
      'Deporte',
      'Prevencion',
      'Evento',
      'Charla',
      'Exposicion',
      'Proyecto Autogestivo',
      'Economia Solidaria',
      'Cooperativa',
      'Mercado Comunal',
      'Festival',
      'Huerta'
];

var tareas = [
      'Trabajo Manual',
      'Cultivar',
      'Reciclar',
      'Educar',
      'Dictar Taller',
      'Ayudar',
      'Cuidar',
      'Donar',
      'Pintar',
      'Exponer',
      'Actuar',
      'Organizar',
      'Producir'
];
 

titulos = [
      'Reciclemos para mejorar',
      'Una ciudad verde',
      'Limpiar la acera',
      'Armar artesanias con cosas viejas',
      'Jugar aprendiendo',
      'Leyendo un libro',
      'Armar reciclando',
      'Jugar en la calle',
      'Cuidate',
      'Fiesta Retro',
      'Exposicion filosofica',
      'Muestra fotografica',
      'Dandonos una mano',
      'Ahorrar en comun',
      'Los dos pinos',
      'Dar para recibir',
      'Fiesta con todos',
      'Plantando frutales',
      'Reciclemos bolsas',
      'Una ciudad de verano',
      'La ruta limpia',
      'Club de artesanos',
      'Aprender jugando',
      'Biblioteca infantil',
      'Contruir bebederos',
      'Participar con un mate',
      'Si lo necesitas',
      'Bailando Tango',
      'Exposicion Tecnologica',
      'Muestra de pinturas rupestres',
      'En conjunto',
      'Un comun ahorro',
      'La cooperativa barrial',
      'Entre todos',
      'Latinoamerica',
      'Huerta infantil'
];

descripciones = [
    "Deseamos realizar el proyecto de ",
    "Te proponemos armar en conjunto el proyecto de ",
    "Pensamos que es una buena idea realizar juntos la iniciativa ",
    "Unite a nosotros para realizar ",
];


paises = ['PER', 'BOL', 'COL', 'BRA', 'CHL', 'ARG'];

function generador_aleatorio(cantidad, usuarioId) {
    for(var i = 0; i <= cantidad; i++) {

        var titulo =  titulos[getRandomInt(0, titulos.length -1)];
        var descripcion =  descripciones[getRandomInt(0, descripciones.length -1)]+' "'+titulo+'"';
        var categoria =  categorias[getRandomInt(0, categorias.length -1)];
        var tipo =  tipos[getRandomInt(0, tipos.length -1)];
        var tarea =  tareas[getRandomInt(0, tareas.length -1)];
        var anio =  getRandomInt(2006, 2012);
        var mes =  getRandomInt(0, 11);
        var dia =  getRandomInt(0, 28);
        var date_utc = Date.UTC(anio, mes, dia);
        var pais =  paises[getRandomInt(0, paises.length -1)];
        var iniciativa = {
            titulo: titulo,
            descripcion: descripcion,
            categoria: categoria,
            tipo: tipo,
            tareas: [{
                nombre : tipo,    
                categoria : tarea,   
                estado : 0 
            }],
            fecha_creacion: date_utc,
            pais: pais,
            creador: usuarioId
        };
 
        var res = Meteor.call('generarIniciativa',iniciativa,function(error,iniciativa){
          console.log(error);
        });

    }

}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
