  Session.set("location","Buenos Aires");
  Session.set("tareas",null);

  Template.iniciativaForm.location = function(){
    return Session.get("location");
  }; 

  // TAREAS
  var tareas = [];
  Template.tareasForm.tareas = function(){
      return Session.get("tareas");
  };

  Template.iniciativas.list = function(){
    return Iniciativas.find();
  }

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
        var res = Iniciativas.insert({
            titulo:$('#iniTitulo').val(),
            descripcion:$('#iniDescripcion').val(),
            categoria:$('#iniCategoria').val(),
            tipo:$('#iniTipo').val(),
            titulo:$('#iniTitulo').val(),
            tareas:Session.get('tareas')
        });
        console.log(res);
    }
  });

