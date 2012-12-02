Session.set("location","Buenos Aires");
Session.set("tareas",null);
Session.set("selected",null);
Session.set("page","home");
Session.set('mostrarMensaje',false);

Template.iniciativaForm.location = function(){
  return Session.get("location");
};

Template.nav.events({
  'click #nav-home':function(){
    Session.set('page','home');
  },
  'click .nav-iniciativas':function(event){
    Session.set('filtro',$(event.currentTarget).attr('data-filter'));
    Session.set('titulo-principal',$(event.currentTarget).attr('rel'));
    Session.set('imagen-principal',$(event.currentTarget).attr('data-image'));
    Session.set('page','iniciativas');
  },
  'click #nav-descripcion_iniciativa':function(event){
    Session.set('page','descripcion_iniciativa');
  },
  'click #nav-perfil':function(event){
    Session.set('page','perfil');
  }
})

function mostrarMensaje(texto,tipo){
  Session.set('mostrarMensaje',true);
  Session.set('mensajeTexto',texto);
  Session.set('mensajeTipo',tipo);
}

var tareas = [];
Template.tareasForm.tareas = function(){
  return Session.get("tareas");
};

Template.ListadoIniciativas.count = function(){
  return Iniciativas.find({categoria:Session.get("filtro")}).count();
}

Template.ListadoIniciativas.listado = function(){
  return Iniciativas.find({categoria:Session.get("filtro")});
}

Template.ListadoIniciativas.tituloPrincipal = function(){
  return Session.get('titulo-principal');
}

Template.ListadoIniciativas.imagenPrincipal = function(){
  return Session.get('imagen-principal');
}

Template.ListadoIniciativas.events({
  'click .iniciativa': function(event){
    Session.set('page','descripcion_iniciativa');
    Session.set('iniciativa',$(event.currentTarget).attr('data-id'));
  }
})

Template.iniciativas.list = function(){
  return Iniciativas.find();
}

Template.layout.home = function(){
  return Session.equals('page','home');
}

Template.layout.iniciativas = function(){
  return Session.equals('page','iniciativas');
}

Template.layout.descripcion_iniciativa = function(){
  return Session.equals('page','descripcion_iniciativa');
}

Template.layout.perfil = function(){
  return Session.equals('page','perfil');
}


Template.medioAmbienteInicio.count = function(){
  return Iniciativas.find({categoria:"Medio Ambiente"}).count();
}
Template.medioAmbienteInicio.listado = function(){
  return Iniciativas.find({categoria:"Medio Ambiente"});
}

Template.medioAmbienteInicio.events({
  'click .iniciativa': function(event){
    Session.set('page','descripcion_iniciativa');
    Session.set('iniciativa',$(event.currentTarget).attr('data-id'));
  }
})

Template.educacionInicio.count = function(){
  return Iniciativas.find({categoria:"Educacion"}).count();
}
Template.educacionInicio.listado = function(){
  return Iniciativas.find({categoria:"Educacion"});
}
Template.educacionInicio.events({
  'click .iniciativa': function(event){
    Session.set('page','descripcion_iniciativa');
    Session.set('iniciativa',$(event.currentTarget).attr('data-id'));
  }
})


Template.desarrolloInicio.count = function(){
  return Iniciativas.find({categoria:"Desarrollo"}).count();
}
Template.desarrolloInicio.listado = function(){
  return Iniciativas.find({categoria:"Desarrollo"});
}
Template.desarrolloInicio.events({
  'click .iniciativa': function(event){
    Session.set('page','descripcion_iniciativa');
    Session.set('iniciativa',$(event.currentTarget).attr('data-id'));
  }
})

Template.arteCulturaInicio.count = function(){
  return Iniciativas.find({categoria:"Arte y Cultura"}).count();
}
Template.arteCulturaInicio.listado = function(){
  return Iniciativas.find({categoria:"Arte y Cultura"});
}
Template.arteCulturaInicio.events({
  'click .iniciativa': function(event){
    Session.set('page','descripcion_iniciativa');
    Session.set('iniciativa',$(event.currentTarget).attr('data-id'));
  }
})

Template.info.mostrarMensaje = function(){
  return Session.get('mostrarMensaje');
}

Template.mensaje.tipo = function(){
  return Session.get('mensajeTipo');
}

Template.mensaje.texto = function(){
  return Session.get('mensajeTexto');
}

Template.sesumaron.participantes = function(){
  return Participantes.find({iniciativa:Session.get('iniciativa')});
}

Template.iniciativa.detail = function () {
  return Iniciativas.findOne(Session.get("iniciativa"));
};

Template.sidebarDatos.events({
  'click .participar': function(){
      ini = Iniciativas.findOne(Session.get('iniciativa'));
      // deberia mostrar las tareas y elegir una para unirse, pero hace suenho:
      if (Meteor.userId() === null){
       mostrarMensaje('Debes ingresar al sitio para participar :)', 'error');
       return;
      }
      if ( 
       Participantes.find({ iniciativa:ini._id,usuario:Meteor.userId()}).count()>0 ){
       mostrarMensaje('Ya estas participando de esta iniciativa! :)', 'block');
      return;
    }

    var res = Participantes.insert({
      iniciativa:ini._id,
      usuario:Meteor.userId()
    });
  }
});


Template.iniciativaForm.events({
  'click .agregarTarea' : function(){
    tareas.push({
      nombre:$('#tareaNombre').val(),
      categoria:$('#tareaCategoria').val(),
      estado:0
    });

    Session.set("tareas",tareas);
    if (typeof console !== 'undefined'){
      console.log(tareas);
    }
  },
  'click .guardarIniciativa':function(){
    if (Meteor.userId() === null){
      mostrarMensaje('Debes ingresar al sitio para participar :)', 'error');
      return;
    }
    var res = Iniciativas.insert({
      creador: this.userId,
      titulo:$('#iniTitulo').val(),
      descripcion:$('#iniDescripcion').val(),
      categoria:$('#iniCategoria').val(),
      tipo:$('#iniTipo').val(),
      titulo:$('#iniTitulo').val(),
      tareas:Session.get('tareas')
    });
    $('#iniciativaForm').each (function(){
      this.reset();
    });
    
  }
});

