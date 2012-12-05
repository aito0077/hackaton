var Iniciativas = new Meteor.Collection("Iniciativas");
var Participantes = new Meteor.Collection("Participantes");

Iniciativas.allow({
	insert: function (userId, doc) {
    	// the user must be logged in, and the document must be owned by the user
    	return false;
    },
    update: function (userId, docs, fields, modifier) {
	    // can only change your own documents
	    return _.all(docs, function(doc) {
	    	return doc.creador === userId;
	    });
	},
	remove: function (userId, docs) {
	    // can only remove your own documents
	    return _.all(docs, function(doc) {
	    	return doc.creador === userId;
	    });
	},
	fetch: ['owner']
});

Meteor.methods({
	crearIniciativa: function (options) {
		options = options || {};
		/*
		    var Iniciativa = {
      titulo:$('#iniTitulo').val(),
      descripcion:$('#iniDescripcion').val(),
      categoria:$('#iniCategoria').val(),
      tipo:$('#iniTipo').val(),
      titulo:$('#iniTitulo').val(),
      tareas:Session.get('tareas')
    };
    */
		if(! (
			typeof options.titulo === "string" && options.titulo.length 
			&& typeof options.descripcion === "string" && options.descripcion.length
			&& typeof options.categoria === "string" && options.categoria.length
			&& typeof options.tipo === "string" && options.tipo.length
		)){
			throw new Meteor.Error(400,'Falta un dato');
		}
	    if (Meteor.userId() === null){
	      mostrarMensaje('Debes ingresar al sitio para participar :)', 'error');
	      return;
	    }
	    options.creador = Meteor.userId();
	    options.fecha_creacion = Date.now();
   		return Iniciativas.insert(options);
   	}
});